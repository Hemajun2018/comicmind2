-- 创建图片生成记录表
create table public.generated_images (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  prompt text not null,
  style text not null,
  aspect_ratio text not null,
  language text not null default 'english',
  image_url text not null,
  structure_content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用 RLS
alter table public.generated_images enable row level security;

-- 创建生成图片记录的 RLS 策略
create policy "用户可以查看自己的生成记录" on public.generated_images
  for select using (auth.uid() = user_id);

create policy "用户可以创建生成记录" on public.generated_images
  for insert with check (auth.uid() = user_id);

create policy "用户可以删除自己的生成记录" on public.generated_images
  for delete using (auth.uid() = user_id);

-- 添加 updated_at 触发器
create trigger handle_updated_at before update on public.generated_images
  for each row execute procedure public.handle_updated_at();

-- 创建索引以提高查询性能
create index idx_generated_images_user_id on public.generated_images(user_id);
create index idx_generated_images_created_at on public.generated_images(created_at desc); 