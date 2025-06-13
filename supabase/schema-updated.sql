-- 启用 RLS (Row Level Security)
alter table auth.users enable row level security;

-- 创建用户资料表
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  daily_free_count integer default 0,
  last_free_reset date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用 RLS
alter table public.profiles enable row level security;

-- 创建用户资料的 RLS 策略
create policy "用户可以查看自己的资料" on public.profiles
  for select using (auth.uid() = id);

create policy "用户可以更新自己的资料" on public.profiles
  for update using (auth.uid() = id);

create policy "用户可以插入自己的资料" on public.profiles
  for insert with check (auth.uid() = id);

-- 创建思维导图表
create table public.mindmaps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  title text not null,
  original_text text not null,
  generated_structure text not null,
  final_structure text not null,
  image_url text,
  style text not null check (style in ('kawaii', 'flat', 'watercolor', 'chalkboard', '3d')),
  aspect_ratio text not null check (aspect_ratio in ('1:1', '3:4', '9:16', '4:3', '16:9')),
  language text not null check (language in ('english', 'chinese', 'japanese', 'spanish', 'french', 'german', 'korean', 'portuguese')),
  is_public boolean default false,
  generation_time_ms integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用 RLS
alter table public.mindmaps enable row level security;

-- 创建思维导图的 RLS 策略
create policy "用户可以查看自己的思维导图" on public.mindmaps
  for select using (auth.uid() = user_id);

create policy "用户可以创建思维导图" on public.mindmaps
  for insert with check (auth.uid() = user_id);

create policy "用户可以更新自己的思维导图" on public.mindmaps
  for update using (auth.uid() = user_id);

create policy "用户可以删除自己的思维导图" on public.mindmaps
  for delete using (auth.uid() = user_id);

create policy "所有人可以查看公开的思维导图" on public.mindmaps
  for select using (is_public = true);

-- 匿名用户也可以创建思维导图（免费用户）
create policy "匿名用户可以创建思维导图" on public.mindmaps
  for insert with check (user_id is null);

-- 创建订阅表
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan_type text not null check (plan_type in ('free', 'pro')),
  status text check (status in ('active', 'inactive', 'cancelled', 'past_due')) default 'active',
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用 RLS
alter table public.subscriptions enable row level security;

-- 创建订阅的 RLS 策略
create policy "用户可以查看自己的订阅" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "用户可以更新自己的订阅" on public.subscriptions
  for update using (auth.uid() = user_id);

-- 创建使用统计表（用于跟踪免费用户的每日使用量）
create table public.usage_stats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  date date not null default current_date,
  mindmaps_created integer default 0,
  is_anonymous boolean default false,
  ip_address inet,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date),
  unique(ip_address, date) -- 防止匿名用户滥用
);

-- 启用 RLS
alter table public.usage_stats enable row level security;

-- 创建使用统计的 RLS 策略
create policy "用户可以查看自己的使用统计" on public.usage_stats
  for select using (auth.uid() = user_id);

create policy "系统可以插入使用统计" on public.usage_stats
  for insert with check (true);

create policy "系统可以更新使用统计" on public.usage_stats
  for update using (true);

-- 创建触发器函数来自动更新 updated_at 字段
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- 为所有表添加 updated_at 触发器
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.mindmaps
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.usage_stats
  for each row execute procedure public.handle_updated_at();

-- 创建函数来自动创建用户资料
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- 创建触发器，当新用户注册时自动创建资料
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 创建函数来检查用户每日免费额度
create or replace function public.check_daily_limit(user_uuid uuid default null, user_ip inet default null)
returns boolean as $$
declare
  current_count integer := 0;
  is_pro_user boolean := false;
begin
  -- 检查是否是付费用户
  if user_uuid is not null then
    select exists(
      select 1 from public.subscriptions 
      where user_id = user_uuid 
      and plan_type = 'pro' 
      and status = 'active'
      and current_period_end > now()
    ) into is_pro_user;
    
    -- 付费用户无限制
    if is_pro_user then
      return true;
    end if;
    
    -- 检查注册用户的每日使用量
    select mindmaps_created into current_count
    from public.usage_stats
    where user_id = user_uuid and date = current_date;
  else
    -- 检查匿名用户的每日使用量（基于IP）
    select mindmaps_created into current_count
    from public.usage_stats
    where ip_address = user_ip and date = current_date and is_anonymous = true;
  end if;
  
  -- 免费用户每日限制3个
  return coalesce(current_count, 0) < 3;
end;
$$ language plpgsql security definer;

-- 创建函数来记录使用量
create or replace function public.record_usage(user_uuid uuid default null, user_ip inet default null)
returns void as $$
begin
  if user_uuid is not null then
    -- 注册用户
    insert into public.usage_stats (user_id, date, mindmaps_created, is_anonymous)
    values (user_uuid, current_date, 1, false)
    on conflict (user_id, date)
    do update set 
      mindmaps_created = usage_stats.mindmaps_created + 1,
      updated_at = now();
  else
    -- 匿名用户
    insert into public.usage_stats (ip_address, date, mindmaps_created, is_anonymous)
    values (user_ip, current_date, 1, true)
    on conflict (ip_address, date)
    do update set 
      mindmaps_created = usage_stats.mindmaps_created + 1,
      updated_at = now();
  end if;
end;
$$ language plpgsql security definer; 