import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserProfileCard } from './components/user-profile-card';
import { PlansBillingCard } from './components/plans-billing-card';
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
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-10 text-text">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <UserProfileCard user={user} />
        </div>
        <div className="lg:col-span-3">
          <PlansBillingCard subscription={subscription as Subscription | null} />
        </div>
      </div>
    </div>
  );
} 