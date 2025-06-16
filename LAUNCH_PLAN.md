# ComicMind 分阶段上线计划

## 🎯 阶段一：基础功能上线（现在立即执行）

### ✅ 可以立即部署的功能
- AI思维导图生成（完全正常）
- 用户认证（Google OAuth）
- 免费用户限制（每日3个）
- 响应式界面
- 用户设置页面

### 🔧 立即部署步骤

1. **Vercel部署配置**
   ```bash
   # 连接GitHub仓库到Vercel
   # 设置环境变量（不包含Creem相关）
   ```

2. **必需的环境变量**
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

3. **当前状态**
   - ✅ 免费用户：每日3个思维导图
   - ⚠️ 付费按钮：显示但暂时不可用（会显示"功能开发中"）

## 🎯 阶段二：Creem支付集成（需要1-2天配置）

### 📝 Creem账户配置清单

#### 1. 注册Creem账户
- [ ] 访问 [Creem官网](https://creem.com) 注册
- [ ] 完成企业认证
- [ ] 获取测试和生产环境API密钥

#### 2. 产品配置
- [ ] 创建产品："ComicMind Pro"
- [ ] 设置价格：$9.9/月
- [ ] 配置试用期（可选）

#### 3. Webhook配置
- [ ] 设置webhook URL：`https://your-domain.vercel.app/api/webhooks/creem`
- [ ] 配置事件类型：
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.deleted`

#### 4. 环境变量更新
```env
# 添加Creem配置
CREEM_API_KEY=creem_live_xxx
CREEM_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_CREEM_PUBLISHABLE_KEY=creem_pk_live_xxx
CREEM_PRICE_ID_PRO=price_xxx
```

## 🎯 阶段三：生产优化（支付功能上线后）

### 📊 监控和分析
- [ ] 用户行为分析
- [ ] 支付转化率监控
- [ ] 性能优化

### 🔧 功能增强
- [ ] 更多AI模型选择
- [ ] 批量生成功能
- [ ] 高级导出格式

## 🚀 现在立即执行的操作

### 方式1：自动部署（推荐）
1. 访问 [Vercel.com](https://vercel.com)
2. 使用GitHub账户登录
3. 点击"New Project"
4. 导入你的GitHub仓库
5. 配置环境变量
6. 点击部署

### 方式2：命令行部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel

# 设置环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
# ... 其他环境变量
```

## ⚠️ 重要提醒

1. **支付功能暂时禁用**
   - 升级按钮会显示"功能开发中，敬请期待"
   - 不会影响核心AI生成功能

2. **用户数据安全**
   - 所有用户数据正常保存
   - 免费限制正常工作

3. **后续集成**
   - Creem配置完成后，只需更新环境变量
   - 无需重新部署代码

## 📞 下一步行动

**现在你可以选择：**

A. **立即部署基础版本**（30分钟内完成）
   - 用户可以正常使用AI生成功能
   - 开始积累用户和数据
   - 支付功能标记为"即将推出"

B. **等待Creem配置完成再部署**（需要1-2天）
   - 完整功能一次性上线
   - 但延迟了产品发布时间

**我的建议：选择A，立即部署基础版本！** 

这样你可以：
- ✅ 立即开始获得用户反馈  
- ✅ 开始积累用户数据
- ✅ 验证产品市场需求
- ✅ 同时并行配置Creem支付

你想现在就开始部署到Vercel吗？ 