'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, CreditCard } from 'lucide-react';

export function UserNav() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 用户头像按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-neutral-bg transition-colors-smooth"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-text font-medium hidden sm:block">
          {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
        </span>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-neutral-card rounded-xl shadow-soft border border-neutral-border z-50">
          {/* 用户信息 */}
          <div className="px-4 py-3 border-b border-neutral-border">
            <p className="text-sm font-medium text-text">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs text-text-muted truncate">
              {user.email}
            </p>
          </div>

          {/* 菜单项 */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: 导航到设置页面
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-text hover:bg-neutral-bg transition-colors-smooth"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: 导航到订阅页面
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-text hover:bg-neutral-bg transition-colors-smooth"
            >
              <CreditCard className="w-4 h-4 mr-3" />
              Subscription
            </button>

            <div className="border-t border-neutral-border my-2" />
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors-smooth"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 