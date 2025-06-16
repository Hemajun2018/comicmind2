'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, ShieldCheck, Gem, Crown, Settings } from 'lucide-react';
import type { Database } from '@/lib/supabase/types';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

interface PlansBillingCardProps {
  subscription: Subscription | null;
}

const features = {
  free: [
    { text: '3 mind maps per day', unavailable: false },
    { text: 'Basic comic styles (5 styles)', unavailable: false },
    { text: 'Standard resolution export', unavailable: false },
  ],
  premium: [
    { text: 'Unlimited mind map generation', unavailable: false },
    { text: 'All premium comic styles (8+ styles)', unavailable: false },
    { text: 'High-resolution exports', unavailable: false },
    { text: 'Priority processing speed', unavailable: false },
    { text: 'Commercial usage license', unavailable: false },
  ],
};

export function PlansBillingCard({ subscription }: PlansBillingCardProps) {
  const currentPlan = subscription ? 'Pro' : 'Free';
  const planDetails = subscription ? features.premium : features.free;

  // 处理升级逻辑 - 暂时禁用，显示开发中提示
  const handleUpgrade = async () => {
    // 暂时禁用支付功能，等待Creem配置完成
    alert('支付功能开发中，敬请期待！\n\n如需立即升级，请联系客服。');
    return;
    
    // 以下代码将在Creem配置完成后启用
    /*
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: 'pro' }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // 重定向到Creem结账页面
        window.location.href = data.url;
      } else {
        console.error('创建结账会话失败:', data.error);
        // 这里可以显示错误提示给用户
      }
    } catch (error) {
      console.error('升级处理错误:', error);
      // 这里可以显示错误提示给用户
    }
    */
  };

  // 处理订阅管理
  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // 重定向到Creem客户门户
        window.location.href = data.url;
      } else {
        console.error('创建客户门户会话失败:', data.error);
        // 这里可以显示错误提示给用户
      }
    } catch (error) {
      console.error('管理订阅错误:', error);
      // 这里可以显示错误提示给用户
    }
  };

  return (
    <Card className="bg-neutral-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
            <CardTitle className="text-text text-2xl">Plans & Billing</CardTitle>
            <CardDescription className="text-text-muted">Manage your subscription plan and billing details.</CardDescription>
        </div>
        {/* Potentially add an "Upgrade Available" badge if applicable */}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-baseline space-x-2">
            <p className="text-text-muted">Current Plan:</p>
            <Badge variant={currentPlan === 'Free' ? 'outline' : 'default'} className="text-lg">{currentPlan}</Badge>
          </div>
        </div>

        <div className="space-y-3">
            <h3 className="font-semibold text-text">Current Features:</h3>
            <ul className="space-y-2">
                {planDetails.map((feature) => (
                    <li key={feature.text} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-text-muted">{feature.text}</span>
                    </li>
                ))}
            </ul>
        </div>

        {currentPlan === 'Free' && (
          <div className="p-6 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-700/50">
            <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-yellow-400">Pro Benefits</h3>
            </div>
            <ul className="space-y-3 mt-4">
                {features.premium.map((feature) => (
                    <li key={feature.text} className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        <span className="text-text">{feature.text}</span>
                    </li>
                ))}
            </ul>
            <p className="mt-6 text-center text-lg text-text">
                Upgrade to Pro for just <span className="font-bold text-yellow-400">$9.9/month</span> and unlock unlimited creativity
            </p>
            <Button onClick={handleUpgrade} className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg py-6" disabled={false}>
                Coming Soon - Pro Version <Zap className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {currentPlan === 'Pro' && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-700/50">
            <div className="flex items-center space-x-2 mb-4">
                <Gem className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold text-green-400">Pro Subscription Active</h3>
            </div>
            <p className="text-text-muted mb-4">
              You're enjoying unlimited access to all premium features. Manage your subscription below.
            </p>
            <Button onClick={handleManageSubscription} variant="outline" className="w-full">
              Manage Subscription <Settings className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 