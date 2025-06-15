'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function PaymentStatus() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'success' | 'canceled' | null>(null);

  useEffect(() => {
    // 检查URL参数中的支付状态
    if (searchParams.get('success') === 'true') {
      setStatus('success');
      // 3秒后自动隐藏成功消息
      setTimeout(() => setStatus(null), 3000);
    } else if (searchParams.get('canceled') === 'true') {
      setStatus('canceled');
      // 5秒后自动隐藏取消消息
      setTimeout(() => setStatus(null), 5000);
    }
  }, [searchParams]);

  if (status === 'success') {
    return (
      <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <h3 className="font-semibold text-green-400">订阅成功！</h3>
            <p className="text-green-300 text-sm">
              Welcome to ComicMind Pro! Your subscription is now active.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'canceled') {
    return (
      <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <div>
            <h3 className="font-semibold text-yellow-400">支付已取消</h3>
            <p className="text-yellow-300 text-sm">
              Your payment was canceled. You can try again anytime.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 