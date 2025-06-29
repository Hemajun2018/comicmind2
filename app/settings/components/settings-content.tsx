'use client';

import { Suspense } from 'react';
import { UserProfileCard } from './user-profile-card';
import { PlansBillingCard } from './plans-billing-card';
import { PaymentStatus } from './payment-status';
import ErrorBoundary from './error-boundary';
import type { Database } from '@/lib/supabase/types';
import type { User } from '@supabase/supabase-js';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

interface SettingsContentProps {
  user: User;
  subscription: Subscription | null;
}

export function SettingsContent({ user, subscription }: SettingsContentProps) {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-6 text-text">Settings</h1>
      
      {/* 支付状态消息 - 用错误边界保护 */}
      <ErrorBoundary>
        <Suspense fallback={null}>
          <PaymentStatus />
        </Suspense>
      </ErrorBoundary>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <UserProfileCard user={user} />
          </ErrorBoundary>
        </div>
        <div className="lg:col-span-3">
          <ErrorBoundary>
            <PlansBillingCard subscription={subscription} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
} 