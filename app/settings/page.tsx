import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsContent } from './components/settings-content';
import type { Database } from '@/lib/supabase/types';

// 从数据库类型中获取订阅的行类型
type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export default async function SettingsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 如果用户未登录，则重定向到首页并附带提示信息
    redirect('/?message=Please log in to view settings'); 
  }

  // 获取用户的有效订阅信息
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .in('status', ['trialing', 'active']) // 用户的有效订阅可以是试用中或已激活
    .maybeSingle(); // 使用 maybeSingle，即使找不到记录也不会报错，而是返回 null

  // 仅在发生非预期的数据库错误时打印日志
  if (error) {
    console.error('Error fetching subscription:', error.message);
  }

  return (
    <SettingsContent 
      user={user} 
      subscription={subscription as Subscription | null} 
    />
  );
} 