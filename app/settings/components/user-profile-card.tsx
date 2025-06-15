'use client'; 

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@supabase/supabase-js';

// 一个帮助函数，从姓名中获取首字母作为备用头像
function getInitials(name: string) {
  if (!name) return '';
  const names = name.split(' ');
  // 确保能正确处理单名或多名的情况
  if (names.length > 1 && names[0] && names[names.length - 1]) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

interface UserProfileCardProps {
  user: User;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  // 从 user_metadata 中安全地获取信息
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || 'User';
  const userEmail = user.email || 'No email provided';
  const avatarUrl = user.user_metadata?.picture || user.user_metadata?.avatar_url;

  return (
    <Card className="bg-neutral-card border-border">
      <CardHeader>
        <CardTitle className="text-text text-2xl">Profile Information</CardTitle>
        <CardDescription className="text-text-muted">Your personal account details.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={userName}
            className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={(e) => {
              console.log('Settings页面头像加载失败，URL:', e.currentTarget.src);
              const originalSrc = e.currentTarget.src;
              if (originalSrc.includes('=s96-c')) {
                e.currentTarget.src = originalSrc.replace('=s96-c', '');
              } else {
                e.currentTarget.style.display = 'none';
              }
            }}
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-semibold">
            {getInitials(userName)}
          </div>
        )}
        <div className="text-center sm:text-left">
          <p className="text-xl font-semibold text-text">{userName}</p>
          <p className="text-text-muted">{userEmail}</p>
        </div>
      </CardContent>
    </Card>
  );
} 