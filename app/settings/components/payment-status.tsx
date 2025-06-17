'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export function PaymentStatus() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'success' | 'canceled' | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 简单的一次性检查，避免复杂的状态管理
    const successParam = searchParams?.get('success');
    const canceledParam = searchParams?.get('canceled');
    
    if (successParam === 'true') {
      setStatus('success');
      setIsVisible(true);
      
      // 5秒后自动隐藏
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else if (canceledParam === 'true') {
      setStatus('canceled');
      setIsVisible(true);
      
      // 5秒后自动隐藏
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !status) {
    return null;
  }

  if (status === 'success') {
    return (
      <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-400">Payment successful!</h3>
              <p className="text-green-300 text-sm">
                Welcome to ComicMind Pro! Your subscription is now active.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-green-300 hover:text-green-100 transition-colors ml-4 flex-shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (status === 'canceled') {
    return (
      <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-400">Payment canceled</h3>
              <p className="text-yellow-300 text-sm">
                Your payment was canceled. You can try again anytime.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-yellow-300 hover:text-yellow-100 transition-colors ml-4 flex-shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
} 