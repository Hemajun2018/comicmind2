-- 修复数据库函数 - 支持文本IP地址参数
-- 在Supabase控制台的SQL编辑器中执行这些语句

-- 创建函数来检查用户每日免费额度
create or replace function public.check_daily_limit(user_uuid uuid default null, user_ip text default null)
returns boolean as $$
declare
  current_count integer := 0;
  is_pro_user boolean := false;
  ip_inet inet;
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
    -- 将文本IP转换为inet类型，包含错误处理
    begin
      ip_inet := user_ip::inet;
    exception
      when others then
        -- 如果IP转换失败，返回true允许使用
        return true;
    end;
    
    -- 检查匿名用户的每日使用量（基于IP）
    select mindmaps_created into current_count
    from public.usage_stats
    where ip_address = ip_inet and date = current_date and is_anonymous = true;
  end if;
  
  -- 免费用户每日限制3个
  return coalesce(current_count, 0) < 3;
end;
$$ language plpgsql security definer;

-- 创建函数来记录使用量
create or replace function public.record_usage(user_uuid uuid default null, user_ip text default null)
returns void as $$
declare
  ip_inet inet;
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
    -- 将文本IP转换为inet类型，包含错误处理
    begin
      ip_inet := user_ip::inet;
    exception
      when others then
        -- 如果IP转换失败，直接返回不记录
        return;
    end;
    
    -- 匿名用户
    insert into public.usage_stats (ip_address, date, mindmaps_created, is_anonymous)
    values (ip_inet, current_date, 1, true)
    on conflict (ip_address, date)
    do update set 
      mindmaps_created = usage_stats.mindmaps_created + 1,
      updated_at = now();
  end if;
end;
$$ language plpgsql security definer; 