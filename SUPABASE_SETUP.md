# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并登录
2. 点击 "New Project" 创建新项目
3. 选择组织，输入项目名称和数据库密码
4. 选择地区（建议选择离用户最近的地区）
5. 等待项目创建完成

## 2. 获取项目配置信息

在 Supabase 项目仪表板中：

1. 进入 **Settings** → **API**
2. 复制以下信息：
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

## 3. 配置环境变量

创建 `.env.local` 文件并添加以下内容：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_项目_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_supabase_service_role_key

# 其他配置
NEXTAUTH_SECRET=你的_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 4. 创建数据库表

1. 在 Supabase 仪表板中，进入 **SQL Editor**
2. 复制 `supabase/schema.sql` 文件中的内容
3. 粘贴到 SQL 编辑器中并执行

或者使用 Supabase CLI：

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录 Supabase
supabase login

# 链接到你的项目
supabase link --project-ref 你的项目引用ID

# 推送数据库架构
supabase db push
```

## 5. 配置认证

在 Supabase 仪表板中：

1. 进入 **Authentication** → **Settings**
2. 配置 **Site URL**: `http://localhost:3000`
3. 配置 **Redirect URLs**: 
   - `http://localhost:3000/auth/callback`
   - `https://你的域名.com/auth/callback` (生产环境)

## 6. 启用认证提供商（可选）

如果需要第三方登录：

1. 进入 **Authentication** → **Providers**
2. 启用需要的提供商（Google, GitHub 等）
3. 配置相应的客户端 ID 和密钥

## 7. 测试连接

启动开发服务器并测试 Supabase 连接：

```bash
npm run dev
```

## 数据库表结构

### profiles 表
- 用户资料信息
- 与 auth.users 表关联

### comics 表
- 漫画内容存储
- 支持草稿、已发布、已归档状态

### subscriptions 表
- 用户订阅信息
- 支持多种订阅状态

## 安全策略 (RLS)

所有表都启用了行级安全策略：
- 用户只能访问自己的数据
- 已发布的漫画对所有人可见
- 自动处理用户注册和资料创建 