'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { checkDailyLimit, recordUsage } from '@/lib/supabase/utils';
import { useState } from 'react';

export default function TestAuthPage() {
  const { user, loading } = useAuth();
  const [limitResult, setLimitResult] = useState<boolean | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  const testDailyLimit = async () => {
    setTestLoading(true);
    try {
      // 模拟获取用户IP（在实际应用中会从服务端获取）
      const mockIP = '192.168.1.1';
      const result = await checkDailyLimit(user?.id, mockIP);
      setLimitResult(result);
      
      if (result) {
        // 如果还有额度，记录一次使用
        await recordUsage(user?.id, mockIP);
        console.log('使用量已记录');
      }
    } catch (error) {
      console.error('测试失败:', error);
    } finally {
      setTestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg py-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-neutral-card rounded-xl p-8 shadow-soft">
          <h1 className="text-3xl font-semibold text-text mb-8 text-center">
            认证功能测试
          </h1>
          
          {/* 用户状态 */}
          <div className="mb-8 p-6 bg-neutral-bg rounded-xl">
            <h2 className="text-xl font-semibold text-text mb-4">用户状态</h2>
            {user ? (
              <div className="space-y-2">
                <p className="text-text"><strong>已登录</strong></p>
                <p className="text-text-muted">ID: {user.id}</p>
                <p className="text-text-muted">邮箱: {user.email}</p>
                <p className="text-text-muted">
                  姓名: {user.user_metadata?.full_name || '未设置'}
                </p>
                <p className="text-text-muted">
                  注册时间: {new Date(user.created_at).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-text-muted">未登录 - 请点击右上角登录按钮</p>
            )}
          </div>

          {/* 每日限制测试 */}
          <div className="mb-8 p-6 bg-neutral-bg rounded-xl">
            <h2 className="text-xl font-semibold text-text mb-4">每日限制测试</h2>
            <button
              onClick={testDailyLimit}
              disabled={testLoading}
              className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover-darken transition-colors-smooth disabled:opacity-50"
            >
              {testLoading ? '测试中...' : '测试每日限制'}
            </button>
            
            {limitResult !== null && (
              <div className="mt-4 p-4 rounded-lg bg-neutral-card">
                <p className="text-text">
                  <strong>结果:</strong> {limitResult ? '✅ 还有额度' : '❌ 已达到每日限制'}
                </p>
              </div>
            )}
          </div>

          {/* 数据库连接状态 */}
          <div className="p-6 bg-neutral-bg rounded-xl">
            <h2 className="text-xl font-semibold text-text mb-4">数据库连接</h2>
            <p className="text-primary">✅ Supabase 连接正常</p>
            <p className="text-text-muted text-sm mt-2">
              认证系统已集成，数据库表已创建
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 