'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, ShieldCheck, Gem, Crown } from 'lucide-react';
import type { Database } from '@/lib/supabase/types';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

interface PlansBillingCardProps {
  subscription: Subscription | null;
}

const features = {
  free: [
    { text: 'Unlimited image generation', unavailable: false },
    { text: 'Basic generation speed (20s)', unavailable: false },
    { text: 'Basic Refine feature', unavailable: false },
  ],
  premium: [
    { text: '5x Faster Generation', unavailable: false },
    { text: 'No Watermark', unavailable: false },
    { text: 'Priority Queue', unavailable: false },
    { text: 'Private Generation', unavailable: false },
  ],
};

export function PlansBillingCard({ subscription }: PlansBillingCardProps) {
  const currentPlan = subscription ? 'Premium' : 'Free';
  const planDetails = subscription ? features.premium : features.free;

  // TODO: Implement upgrade logic
  const handleUpgrade = () => {
    console.log('Upgrade button clicked');
    // This will later redirect to Stripe checkout
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
                <h3 className="text-xl font-bold text-yellow-400">Premium Benefits</h3>
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
                Upgrade to Premium for just <span className="font-bold text-yellow-400">$10/month</span> (annual billing)
            </p>
            <Button onClick={handleUpgrade} className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg py-6">
                Upgrade Now <Zap className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 