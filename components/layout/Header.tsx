'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useAuth } from '@/lib/auth/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// 一个帮助函数，从姓名中获取首字母作为备用头像
function getInitials(name: string) {
  if (!name) return 'U';
  const names = name.split(' ');
  if (names.length > 1 && names[0] && names[names.length - 1]) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function Header() {
  // 状态管理：控制移动端菜单的开启和关闭
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // 获取用户认证状态
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  // 导航菜单配置：定义导航链接的名称和路径
  const navigation = [
    { name: 'Features', href: '/#features' },  // 功能页面
    { name: 'FAQs', href: '/#faqs' },         // 常见问题页面
    { name: 'Pricing', href: '/#pricing' },   // 定价页面
    
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === '/' && href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.substring(2);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
    // 在其他页面，Next.js 的 Link 组件会处理导航
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAuthModalOpen(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* 页面顶部导航栏容器 - 固定在顶部，背景渐变，层级最高 */}
      <header className="bg-gradient-to-br from-neutral-bg to-neutral-card">
        {/* 内容容器 - 设置最大宽度和响应式内边距 */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* 导航栏主要布局 - 水平排列，Logo和菜单靠左，登录按钮靠右，高度80px */}
          <div className="flex items-center h-20">
            
            {/* === 左侧：Logo和导航菜单组合区域 === */}
            {/* 移除左侧多余空间，让Logo和文字直接贴靠容器左边 */}
            <div className="flex items-center -ml-18">
              {/* Logo区域 */}
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                {/* Logo图片 - 64x64px显示尺寸，减少右侧间距 */}
                <Image 
                  src="/icon128.png"         // 图片路径：public/icon128.png
                  alt="ComicMind Logo"       // 无障碍描述
                  width={128}                // 原始图片宽度
                  height={128}               // 原始图片高度
                  className="w-16 h-16"      // 实际显示尺寸：64x64px
                />
                {/* 品牌名称 - 30px字体，粗体，减少左侧空间 */}
                <span className="text-3xl font-semibold text-text">ComicMind</span>
              </Link>

              {/* 桌面端导航菜单 - 紧贴Logo右侧 */}
              <nav className="hidden md:flex items-center space-x-8 ml-6">
                {/* 遍历导航配置数组，生成导航链接 */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}          // React列表key
                    href={item.href}         // 链接地址
                    onClick={(e) => handleLinkClick(e, item.href)}
                    // 样式：灰色文字，悬停变主色，18px字体，中等粗细
                    className="text-text-muted hover:text-primary transition-colors-smooth font-medium text-lg"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* === 右侧：语言选择器和登录按钮/用户菜单 === */}
            {/* 使用ml-auto推到最右边 */}
            <div className="hidden md:flex items-center space-x-4 ml-auto">
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* 用户认证区域 */}
              {loading ? (
                // 加载状态
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : user ? (
                // 已登录用户菜单
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-neutral-bg border border-border px-3 py-2 rounded-xl hover:bg-neutral-card transition-colors-smooth"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || 'User'} />
                      <AvatarFallback className="text-sm">
                        {getInitials(user.user_metadata?.full_name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-text font-medium hidden sm:block">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    </span>
                  </button>
                  
                  {/* 用户下拉菜单 */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-neutral-card border border-border rounded-xl shadow-soft py-2 z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-semibold text-text truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                        <p className="text-sm text-text-muted truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/settings"
                        className="w-full flex items-center space-x-2 px-4 py-2 text-left text-text hover:bg-neutral-bg transition-colors-smooth"
                        onClick={() => setShowUserMenu(false)} // 点击后关闭菜单
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-left text-text hover:bg-neutral-bg transition-colors-smooth"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // 未登录用户的登录按钮
                <button
                  onClick={handleSignInClick}
                  className="bg-accent text-white px-8 py-3 rounded-xl font-medium text-lg hover-darken active-darken transition-colors-smooth shadow-soft"
                >
                  Sign in
                </button>
              )}
            </div>

            {/* === 右侧：移动端菜单按钮 === */}
            {/* 只在中等屏幕以下显示 */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-neutral-bg transition-colors-smooth ml-auto"
              onClick={() => setIsMenuOpen(!isMenuOpen)}  // 切换菜单开关状态
            >
              {/* 根据菜单状态显示不同图标：关闭X或汉堡包菜单 */}
              {isMenuOpen ? (
                <X className="w-6 h-6 text-text" />      // 关闭图标
              ) : (
                <Menu className="w-6 h-6 text-text" />   // 汉堡包菜单图标
              )}
            </button>
          </div>

          {/* === 移动端展开菜单 === */}
          {/* 只有当isMenuOpen为true时才显示 */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-4">
                {/* 遍历导航配置，生成移动端导航链接 */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    // 样式：18px字体，垂直内边距8px
                    className="text-text-muted hover:text-primary transition-colors-smooth font-medium text-lg py-2"
                    onClick={(e) => {
                      handleLinkClick(e, item.href);
                      setIsMenuOpen(false); // 点击后关闭菜单
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* 移动端语言选择器和认证区域 */}
                <div className="pt-4 border-t border-border space-y-4">
                  {/* Language Selector for Mobile */}
                  <div className="flex justify-center">
                    <LanguageSelector />
                  </div>
                  
                  {/* 移动端用户认证区域 */}
                  {loading ? (
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : user ? (
                    // 已登录用户信息和登出按钮
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className="text-text font-medium">
                          {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-sm text-text-muted">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center space-x-2 bg-neutral-bg border border-border text-text px-8 py-4 rounded-xl font-medium text-lg hover:bg-neutral-card transition-colors-smooth"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  ) : (
                    // 未登录用户的登录按钮
                    <button
                      onClick={handleSignInClick}
                      className="bg-accent text-white px-8 py-4 rounded-xl font-medium text-lg hover-darken active-darken transition-colors-smooth shadow-soft text-center block w-full"
                    >
                      Sign in
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}