'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export function Header() {
  // 状态管理：控制移动端菜单的开启和关闭
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 导航菜单配置：定义导航链接的名称和路径
  const navigation = [
    { name: 'Features', href: '/features' },  // 功能页面
    { name: 'Pricing', href: '/pricing' },   // 定价页面
    { name: 'Blog', href: '/blog' },         // 博客页面
  ];

  return (
    // 页面顶部导航栏容器 - 固定在顶部，背景渐变，层级最高
    <header className="bg-gradient-to-br from-neutral-bg to-neutral-card sticky top-0 z-50">
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
                  // 样式：灰色文字，悬停变主色，18px字体，中等粗细
                  className="text-text-muted hover:text-primary transition-colors-smooth font-medium text-lg"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* === 右侧：桌面端登录按钮 === */}
          {/* 使用ml-auto推到最右边 */}
          <div className="hidden md:flex items-center ml-auto">
            <Link
              href="/auth"             // 登录页面路径
              // 样式：橙色背景，白色文字，内边距32x12px，圆角，18px字体
              className="bg-accent text-white px-8 py-3 rounded-xl font-medium text-lg hover-darken active-darken transition-colors-smooth shadow-soft"
            >
              Sign in
            </Link>
          </div>

          {/* === 右侧：移动端菜单按钮 === */}
          {/* 只在中等屏幕以下显示 */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-bg transition-colors-smooth"
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
                  onClick={() => setIsMenuOpen(false)}  // 点击后关闭菜单
                >
                  {item.name}
                </Link>
              ))}
              
              {/* 移动端登录按钮区域 */}
              <div className="pt-4 border-t border-border">
                <Link
                  href="/auth"
                  // 样式：橙色背景，块级元素，居中文字，内边距32x16px
                  className="bg-accent text-white px-8 py-4 rounded-xl font-medium text-lg hover-darken active-darken transition-colors-smooth shadow-soft text-center block"
                  onClick={() => setIsMenuOpen(false)}  // 点击后关闭菜单
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}