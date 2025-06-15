'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, ShieldCheck, Gem, Crown, ExternalLink, CreditCard, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { checkDailyLimit } from '@/lib/supabase/utils';
import { toast } from 'sonner';
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
  const { user } = useAuth();
  const [hasQuota, setHasQuota] = useState(true);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  
  const currentPlan = subscription ? 'Pro' : 'Free';
  const planDetails = subscription ? features.premium : features.free;

  // 检查用户限制状态
  useEffect(() => {
    if (currentPlan === 'Free') {
      const checkUserQuota = async () => {
        setQuotaLoading(true);
        try {
          const mockIP = '127.0.0.1';
          const quota = await checkDailyLimit(user?.id, mockIP);
          setHasQuota(quota);
        } catch (error) {
          console.error('检查限制失败:', error);
          setHasQuota(true);
        } finally {
          setQuotaLoading(false);
        }
      };
      checkUserQuota();
    }
  }, [user, currentPlan]);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('请先登录后再升级');
      return;
    }
    
    setUpgradeLoading(true);
    try {
      // 模拟升级流程 - 这里将来集成 Stripe
      toast.info('升级功能即将上线，敬请期待！');
      
      // TODO: 实际的升级逻辑
      // 1. 创建 Stripe checkout session
      // 2. 重定向到支付页面
      // 3. 处理支付成功回调
      
      setTimeout(() => {
        toast.success('升级功能正在开发中，感谢您的耐心等待！');
        setUpgradeLoading(false);
      }, 2000);
    } catch (error) {
      console.error('升级失败:', error);
      toast.error('升级失败，请稍后重试');
      setUpgradeLoading(false);
    }
  };

  const getQuotaStatus = () => {
    if (quotaLoading) return '检查中...';
    if (currentPlan === 'Pro') return '无限制';
    return hasQuota ? '还有余额' : '今日已用完';
  };

  const getQuotaColor = () => {
    if (quotaLoading) return 'text-gray-500';
    if (currentPlan === 'Pro') return 'text-green-500';
    return hasQuota ? 'text-blue-500' : 'text-red-500';
  };

  return (
    <Card className="bg-neutral-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
            <CardTitle className="text-text text-2xl">Plans & Billing</CardTitle>
            <CardDescription className="text-text-muted">Manage your subscription plan and billing details.</CardDescription>
        </div>
        {currentPlan === 'Free' && !hasQuota && (
          <Badge variant="destructive" className="text-sm">
            Quota Exceeded
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <p className="text-text-muted">Current Plan:</p>
            <Badge variant={currentPlan === 'Free' ? 'outline' : 'default'} className="text-lg">{currentPlan}</Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted">Today's Usage</p>
            <p className={`font-semibold ${getQuotaColor()}`}>
              {getQuotaStatus()}
            </p>
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
            <div className="flex items-center space-x-2 mb-4">
                <Crown className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-yellow-400">Upgrade to Pro</h3>
            </div>
            
            {!hasQuota && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-700 text-sm font-medium">
                  ⚠️ You've reached your daily limit. Upgrade now for unlimited access!
                </p>
              </div>
            )}
            
            <ul className="space-y-3 mb-6">
                {features.premium.map((feature) => (
                    <li key={feature.text} className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        <span className="text-text">{feature.text}</span>
                    </li>
                ))}
            </ul>
            
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-yellow-400">$12<span className="text-sm font-normal">/month</span></p>
                  <p className="text-sm text-yellow-200">Cancel anytime</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-yellow-200">Save vs daily limits</p>
                  <p className="text-lg font-bold text-yellow-400">Unlimited</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleUpgrade} 
              disabled={upgradeLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg py-6 disabled:opacity-50"
            >
              {upgradeLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Upgrade Now
                </>
              )}
            </Button>
            
            <p className="text-center text-xs text-yellow-200 mt-3">
              Secure payment powered by Stripe • No setup fees
            </p>
          </div>
        )}

        {currentPlan === 'Pro' && (
          <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30">
            <div className="flex items-center space-x-2 mb-4">
                <Crown className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold text-green-400">Pro Member</h3>
            </div>
            <p className="text-text-muted">
              You're enjoying unlimited access to all Pro features! 
            </p>
            <div className="mt-4 flex items-center space-x-4 text-sm text-text-muted">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Next billing: Soon</span>
              </div>
              <div className="flex items-center space-x-1">
                <CreditCard className="w-4 h-4" />
                <span>Manage billing</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 