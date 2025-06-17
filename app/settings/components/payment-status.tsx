'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function PaymentStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'success' | 'canceled' | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  // 清理 URL 参数的函数
  const cleanUrl = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('success');
    url.searchParams.delete('canceled');
    router.replace(url.pathname, { scroll: false });
  }, [router]);

  useEffect(() => {
    // 防止重复处理
    if (hasProcessed) return;

    try {
      // 检查URL参数中的支付状态
      const successParam = searchParams.get('success');
      const canceledParam = searchParams.get('canceled');
      
      if (successParam === 'true') {
        setStatus('success');
        setHasProcessed(true);
        
        // 3秒后自动隐藏成功消息并清理URL
        const timer = setTimeout(() => {
          setStatus(null);
          cleanUrl();
        }, 3000);
        
        return () => clearTimeout(timer);
      } else if (canceledParam === 'true') {
        setStatus('canceled');
        setHasProcessed(true);
        
        // 5秒后自动隐藏取消消息并清理URL
        const timer = setTimeout(() => {
          setStatus(null);
          cleanUrl();
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('PaymentStatus error:', error);
      setStatus(null);
    }
  }, [searchParams, hasProcessed, cleanUrl]);

  // 手动关闭消息的函数
  const handleClose = useCallback(() => {
    setStatus(null);
    cleanUrl();
  }, [cleanUrl]);

  if (status === 'success') {
    return (
      <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-semibold text-green-400">Payment successful!</h3>
              <p className="text-green-300 text-sm">
                Welcome to ComicMind Pro! Your subscription is now active.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-green-300 hover:text-green-100 transition-colors"
            aria-label="Close notification"
          >
            <XCircle className="w-4 h-4" />
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
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <div>
              <h3 className="font-semibold text-yellow-400">Payment canceled</h3>
              <p className="text-yellow-300 text-sm">
                Your payment was canceled. You can try again anytime.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-yellow-300 hover:text-yellow-100 transition-colors"
            aria-label="Close notification"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
} 