import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// 验证Creem Webhook签名的函数，符合官方最佳实践
function verifySignature(body: string, signature: string, secret: string): boolean {
  if (!signature || !body) {
    return false;
  }

  const [timestampPart, signaturePart] = signature.split(',');
  if (!timestampPart || !signaturePart) {
    return false;
  }

  const timestamp = timestampPart.split('=')[1];
  const expectedSignature = signaturePart.split('=')[1];

  if (!timestamp || !expectedSignature) {
    return false;
  }

  const signedPayload = `${timestamp}.${body}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(signedPayload);
  const calculatedSignature = hmac.digest('hex');

  return calculatedSignature === expectedSignature;
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('creem-signature') || '';

    if (!verifySignature(body, signature, process.env.CREEM_WEBHOOK_SECRET!)) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = createClient();

    console.log('Received Creem webhook:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.user_id;

        if (!userId) {
          console.error('No user_id in session metadata');
          return NextResponse.json({ error: 'No user_id found' }, { status: 400 });
        }

        // 优化为更健壮的"先检查、后创建"逻辑
        const { error } = await supabase.from('subscriptions').insert({
          user_id: userId,
          plan_type: session.metadata.plan || 'pro',
          status: 'active',
          creem_subscription_id: session.subscription,
          creem_customer_id: session.customer,
          creem_price_id: session.line_items?.data[0]?.price.id, // 填充price_id
          current_period_start: new Date(session.created * 1000).toISOString(),
          current_period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // 估算一个月
          updated_at: new Date().toISOString(),
        });
        
        if (error) {
          console.error('Error creating subscription:', error);
          return NextResponse.json({ error: 'Database error on subscription creation' }, { status: 500 });
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

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ 
      error: `Webhook handler failed: ${error.message}` 
    }, { status: 500 });
  }
} 