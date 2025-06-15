import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

// 验证webhook签名的函数
function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  // 注意：这里需要根据Creem的实际签名验证方式进行调整
  // 通常使用HMAC-SHA256进行验证
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('creem-signature') || '';
    
    // 验证webhook签名
    if (!verifyWebhookSignature(body, signature, process.env.CREEM_WEBHOOK_SECRET!)) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = createClient();

    console.log('Received Creem webhook:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        // 订阅成功创建
        const session = event.data.object;
        const userId = session.metadata.user_id;
        const plan = session.metadata.plan || 'pro';

        if (!userId) {
          console.error('No user_id in session metadata');
          return NextResponse.json({ error: 'No user_id found' }, { status: 400 });
        }

        // 创建或更新订阅记录
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan_type: plan,
            status: 'active',
            creem_subscription_id: session.subscription,
            creem_customer_id: session.customer,
            current_period_start: new Date(session.current_period_start * 1000).toISOString(),
            current_period_end: new Date(session.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error creating subscription:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log('Subscription created for user:', userId);
        break;
      }

      case 'invoice.payment_succeeded': {
        // 支付成功，续费
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        // 更新订阅状态
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_start: new Date(invoice.period_start * 1000).toISOString(),
            current_period_end: new Date(invoice.period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('creem_subscription_id', subscriptionId);

        if (error) {
          console.error('Error updating subscription:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log('Subscription renewed:', subscriptionId);
        break;
      }

      case 'invoice.payment_failed': {
        // 支付失败
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        // 更新订阅状态为逾期
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('creem_subscription_id', subscriptionId);

        if (error) {
          console.error('Error updating subscription status:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log('Subscription marked as past due:', subscriptionId);
        break;
      }

      case 'customer.subscription.deleted': {
        // 订阅取消
        const subscription = event.data.object;
        const subscriptionId = subscription.id;

        // 更新订阅状态为已取消
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('creem_subscription_id', subscriptionId);

        if (error) {
          console.error('Error cancelling subscription:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log('Subscription cancelled:', subscriptionId);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed' 
    }, { status: 500 });
  }
} 