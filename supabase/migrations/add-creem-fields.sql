-- 为订阅表添加Creem相关字段
-- 这个迁移脚本可以在现有数据库上安全运行

-- 添加Creem相关字段到subscriptions表
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS creem_subscription_id text UNIQUE,
ADD COLUMN IF NOT EXISTS creem_customer_id text,
ADD COLUMN IF NOT EXISTS creem_price_id text;

-- 更新现有的stripe字段为可选
ALTER TABLE public.subscriptions 
ALTER COLUMN stripe_subscription_id DROP NOT NULL;

-- 添加注释说明
COMMENT ON COLUMN public.subscriptions.creem_subscription_id IS 'Creem订阅ID';
COMMENT ON COLUMN public.subscriptions.creem_customer_id IS 'Creem客户ID';
COMMENT ON COLUMN public.subscriptions.creem_price_id IS 'Creem价格ID';

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_subscriptions_creem_subscription_id 
ON public.subscriptions(creem_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_creem_customer_id 
ON public.subscriptions(creem_customer_id); 