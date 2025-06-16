# ComicMind - AI 思维导图生成器

将文本转换为漫画风格思维导图的 AI 工具。

## 🚀 功能特性

- ✅ **AI 思维导图生成** - 使用 Gemini AI 将文本转换为结构化思维导图
- ✅ **多种视觉风格** - 支持 Kawaii、扁平化、水彩、黑板、3D 等 5 种风格
- ✅ **多语言支持** - 支持 8 种语言（中文、英文、日文、韩文等）
- ✅ **用户认证系统** - 基于 Supabase 的 Google OAuth 登录
- ✅ **免费额度管理** - 匿名用户每日 3 次免费使用
- ✅ **订阅系统准备** - 支持 Free/Pro 计划，为 Stripe 集成做好准备
- ✅ **响应式设计** - 完美适配桌面端和移动端

## 🛠 技术栈

- **前端**: Next.js 13 (App Router), React 18, TypeScript
- **样式**: Tailwind CSS, Shadcn UI, Radix UI
- **后端**: Supabase (认证 + 数据库)
- **AI**: Gemini 2.5 Flash (通过麻雀 API)
- **部署**: Vercel (计划中)
- **支付**: Creem (计划中)

## 📦 项目结构

```
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   ├── auth/              # 认证相关页面
│   ├── create/            # 创建思维导图页面
│   └── test-auth/         # 认证功能测试页面
├── components/            # React 组件
│   ├── auth/              # 认证组件
│   ├── create/            # 创建功能组件
│   ├── home/              # 首页组件
│   ├── layout/            # 布局组件
│   └── ui/                # UI 组件
├── lib/                   # 工具库
│   ├── auth/              # 认证上下文
│   └── supabase/          # Supabase 配置和工具
└── supabase/              # 数据库架构
```

## 🗄️ 数据库设计

### 主要表结构

1. **profiles** - 用户资料表
   - 存储用户基本信息和每日使用统计

2. **mindmaps** - 思维导图表
   - 存储生成的思维导图数据（文本结构 + 图片）
   - 支持匿名用户和注册用户

3. **subscriptions** - 订阅表
   - 管理用户订阅状态（Free/Pro）

4. **usage_stats** - 使用统计表
   - 跟踪每日使用量，支持匿名用户限制

## 🔧 开发设置

### 环境变量配置

创建 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth 配置
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### Supabase 设置

1. 创建 Supabase 项目
2. 执行 `supabase/schema-updated.sql` 创建数据库表
3. 配置 Google OAuth 认证
4. 更新环境变量

详细设置请参考 `SUPABASE_SETUP.md`

## 📝 更新日志

### 2024-12-XX - 首页英雄区重新设计

#### 🎨 UI/UX 改进
- **标题文案更新**: 改为 "Transform your ideas into comic mind-maps" 并采用两行布局
- **特性卡片重设计**: 用现代卡片式设计替代传统统计数字
  - **No login required**: 闪电图标 + 主色调渐变卡片
  - **Free trial**: 美元符号图标 + 辅助色渐变卡片  
  - **Multiple art styles**: 画板图标 + 次要色渐变卡片
- **交互体验优化**: 悬停时边框颜色变化效果

#### 🔧 技术实现
- 两行标题布局，增强视觉层次感
- SVG 图标集成，提升视觉识别度
- 渐变背景和边框设计，现代化UI风格
- 响应式网格布局 (1列→3列)

### 2024-12-XX - Creem 付费系统集成与部署准备

#### 🚀 新增功能
- **Creem 支付集成**: 完整集成 Creem 支付系统，支持订阅管理
- **安全性提升**: 移除硬编码API密钥，全面使用环境变量管理
- **部署指南**: 创建详细的 Vercel 部署和 Creem 集成指南
- **订阅管理**: Pro 用户可通过客户门户管理订阅状态

#### 🔧 技术实现
- **API 路由创建**: 
  - `/api/create-checkout-session` - 创建Creem结账会话
  - `/api/webhooks/creem` - 处理Creem webhook事件  
  - `/api/customer-portal` - 管理客户订阅门户
- **数据库扩展**: 添加Creem相关字段到订阅表
- **UI/UX 优化**: 支付状态显示、Pro用户订阅管理界面

#### 📊 业务流程
- **支付流程**: 用户点击升级 → Creem结账 → webhook处理 → 订阅激活
- **状态同步**: 实时同步订阅状态，支持续费、取消、逾期处理
- **用户体验**: 支付成功/失败状态提示，一键管理订阅

#### 🛡️ 安全改进
- **环境变量管理**: 所有敏感信息使用环境变量存储
- **Webhook验证**: 完整的签名验证机制
- **错误处理**: 完善的错误处理和日志记录

### 2024-12-XX - 用户限制与付费引导系统实现

#### ✅ 已完成功能
- **API限制检查**: 在 `generate-structure` 和 `generate-image` API 中集成每日限制检查
- **用户权限控制**: 免费用户每日限制 3 个思维导图，Pro 用户享受无限制使用
- **智能限制处理**: 使用 `checkDailyLimit()` 和 `recordUsage()` 函数跟踪使用量
- **前端状态管理**: 实时检查用户配额状态，动态禁用/启用生成按钮

#### 🎨 用户体验优化
- **优雅的限制提示**: 达到每日限制时显示精美的升级引导卡片
- **付费转化流程**: 一键跳转到设置页面进行 Pro 订阅升级
- **统一UI控制**: 桌面端和移动端都支持限制状态的一致显示
- **错误处理机制**: 友好的错误提示和降级处理策略

#### 🔧 技术实现
- **数据库集成**: 完整使用 Supabase 的用户认证和使用统计功能
- **状态同步**: 前端组件实时同步用户限制状态和生成权限
- **安全检查**: API 层面的双重保护，防止绕过前端限制
- **IP 追踪**: 支持匿名用户基于 IP 地址的使用限制

#### 📊 业务逻辑
- **免费用户**: 每日 3 个思维导图 + 基础功能
- **Pro 用户**: 无限制生成 + 高级功能 + 商业授权
- **匿名用户**: 与注册免费用户相同限制，基于 IP 追踪
- **升级引导**: 限制达到时自动展示 Pro 版本价值和升级按钮

### 2024-06-16 - 首页图库升级

#### ✨ 新增与优化
- **重构图库布局**: 采用响应式瀑布流网格 (Masonry Grid) 替代旧布局，优化了在不同设备上的视觉呈现。
- **增加交互动效**: 为图库图片添加了鼠标悬停时的放大、阴影增强和蒙版效果，提升了用户体验。
- **更新图片内容**: 增加了更多由 AI 生成的思维导图案例图片。

### 2024-01-XX - Next.js 架构错误修复

#### 🔧 修复内容
- 修复 ReactServerComponentsError 错误
- 创建缺失的 UserNav 组件
- 重构 test-auth 页面为服务器/客户端分离架构
- 修复 utils.ts 中的服务器组件导入冲突
- 添加 webpack 配置忽略 WebSocket 依赖警告
- 遵循 Next.js App Router 最佳实践

#### 🏗️ 架构改进
- 严格分离服务器组件和客户端组件
- 页面组件只处理 metadata，交互逻辑分离到客户端组件
- 移除客户端组件中的服务器依赖导入
- 优化 Supabase 客户端配置

### 2024-01-XX - Supabase 认证系统集成

#### ✅ 已完成
- 集成 Supabase 认证系统
- 实现 Google OAuth 登录
- 创建用户认证上下文 (AuthContext)
- 更新 Header 组件显示用户状态
- 设计匹配应用逻辑的数据库架构
- 实现每日使用限制功能
- 创建认证测试页面

#### 🔧 技术实现
- 使用 `@supabase/ssr` 替代已弃用的 auth-helpers
- 实现服务端和客户端 Supabase 客户端
- 创建中间件处理认证状态
- 设计 RLS (行级安全) 策略
- 实现匿名用户支持

#### 📊 数据库更新
- 将 `comics` 表重构为 `mindmaps` 表
- 添加 `usage_stats` 表跟踪使用量
- 创建数据库函数处理每日限制逻辑
- 支持匿名用户和注册用户的不同权限

## 🎯 下一步计划

1. **完善思维导图生成功能**
   - 集成数据库存储
   - 实现用户历史记录
   - 添加分享功能

2. **订阅系统实现**
   - 集成 Creem 支付
   - 实现订阅管理
   - 添加付费功能限制

3. **部署到生产环境**
   - Vercel 部署配置
   - 环境变量管理
   - 域名和 SSL 设置

## 🔒 安全特性

- ✅ 行级安全策略 (RLS)
- ✅ 用户数据隔离
- ✅ 匿名用户限制
- ✅ 安全的认证流程
- ✅ 环境变量保护

## 📱 测试

访问 `/test-auth` 页面测试认证功能：
- 用户登录状态
- 每日使用限制
- 数据库连接状态

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License 

部署2