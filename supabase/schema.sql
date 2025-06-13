-- 启用 RLS (Row Level Security)
alter table auth.users enable row level security;

-- 创建用户资料表
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
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

-- 创建漫画内容表
create table public.comics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  image_url text,
  content text,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用 RLS
alter table public.comics enable row level security;

-- 创建漫画的 RLS 策略
create policy "用户可以查看自己的漫画" on public.comics
  for select using (auth.uid() = user_id);

create policy "用户可以创建漫画" on public.comics
  for insert with check (auth.uid() = user_id);

create policy "用户可以更新自己的漫画" on public.comics
  for update using (auth.uid() = user_id);

create policy "用户可以删除自己的漫画" on public.comics
  for delete using (auth.uid() = user_id);

create policy "所有人可以查看已发布的漫画" on public.comics
  for select using (status = 'published');

-- 创建订阅表
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan_id text not null,
  status text check (status in ('active', 'inactive', 'cancelled', 'past_due')) default 'inactive',
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
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

create trigger handle_updated_at before update on public.comics
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.subscriptions
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