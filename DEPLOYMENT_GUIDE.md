# ComicMind 部署与付费集成指南

## 🚀 Vercel 部署步骤

### 1. 准备环境变量

在 Vercel 项目设置中添加以下环境变量：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 麻雀API (Gemini AI)
GEMINI_API_KEY=sk-uaVHEzg9zWASWVj0uZ6DZXGSxVq1nkNlQg3Bq9DEsDBXmPqU
GEMINI_API_URL=https://ismaque.org/v1/chat/completions

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app
NEXTAUTH_URL=https://your-app-domain.vercel.app
NEXTAUTH_SECRET=your_random_secret_key_here
```

### 2. Vercel 部署配置

1. **连接 GitHub 仓库**
   - 登录 Vercel
   - 点击 "New Project"
   - 导入你的 GitHub 仓库

2. **构建设置**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **域名配置**
   - 获取 Vercel 提供的域名或绑定自定义域名
   - 更新环境变量中的 URL

### 3. Supabase 生产环境配置

1. **更新认证设置**
   - 在 Supabase Dashboard 中更新 Site URL
   - 添加 Vercel 域名到 Redirect URLs

2. **RLS 策略检查**
   - 确保所有 RLS 策略正确配置
   - 测试匿名用户和注册用户的权限

## 💳 Creem 付费系统集成

### 1. Creem 账户设置

1. **注册 Creem 账户**
   - 访问 [Creem 官网](https://creem.com)
   - 注册开发者账户
   - 获取 API 密钥

2. **配置产品和价格**
   ```json
   {
     "products": [
       {
         "name": "ComicMind Pro",
         "description": "Unlimited AI mind map generation",
         "prices": [
           {
             "amount": 990,
             "currency": "usd",
             "interval": "month",
             "interval_count": 1
           }
         ]
       }
     ]
   }
   ```

### 2. 环境变量添加

```env
# Creem 配置
CREEM_API_KEY=creem_live_xxx
CREEM_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_CREEM_PUBLISHABLE_KEY=creem_pk_live_xxx
```

### 3. API 路由创建

需要创建以下 API 路由：

#### `/api/create-checkout-session`
处理订阅购买

#### `/api/webhooks/creem`
处理 Creem webhook 事件

#### `/api/customer-portal`
管理订阅门户

### 4. 数据库集成

更新订阅表结构以支持 Creem：

```sql
-- 添加 Creem 相关字段
alter table public.subscriptions 
add column creem_subscription_id text unique,
add column creem_customer_id text,
add column creem_price_id text;
```

## 🔧 集成实施计划

### 阶段一：基础部署 (1-2天)
1. ✅ 配置 Vercel 环境变量
2. ✅ 部署到 Vercel
3. ✅ 测试基础功能
4. ✅ 配置自定义域名

### 阶段二：Creem 集成 (3-5天)
1. 🔄 注册 Creem 账户
2. 🔄 创建产品和价格
3. 🔄 实现结账流程
4. 🔄 配置 webhook 处理
5. 🔄 测试支付流程

### 阶段三：生产优化 (2-3天)
1. 🔄 性能优化
2. 🔄 错误监控
3. 🔄 用户反馈收集
4. 🔄 SEO 优化

## 📊 监控和维护

### 性能监控
- Vercel Analytics
- Supabase 数据库监控
- 用户使用量统计

### 错误处理
- Sentry 错误追踪
- 日志记录
- 用户反馈系统

## 🚨 注意事项

1. **安全性**
   - 所有 API 密钥使用环境变量
   - 启用 HTTPS
   - 验证 webhook 签名

2. **用户体验**
   - 支付失败处理
   - 订阅状态同步
   - 清晰的错误提示

3. **合规性**
   - 隐私政策更新
   - 服务条款
   - 退款政策

## 💡 建议的技术债务处理

1. **代码优化**
   - 移除硬编码的 API 密钥
   - 统一错误处理
   - 添加单元测试

2. **用户体验优化**
   - 添加加载状态
   - 优化移动端体验
   - 国际化支持

## 🎯 上线检查清单

### 部署前检查
- [ ] 所有环境变量配置正确
- [ ] 数据库迁移完成
- [ ] API 密钥安全存储
- [ ] 域名和 SSL 配置

### 功能测试
- [ ] 用户注册/登录
- [ ] 思维导图生成
- [ ] 用户限制机制
- [ ] 支付流程（Creem 集成后）

### 生产环境测试
- [ ] 性能测试
- [ ] 安全测试
- [ ] 移动端测试
- [ ] 跨浏览器测试 