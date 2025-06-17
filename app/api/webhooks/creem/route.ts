import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// 验证Creem Webhook签名的函数，符合官方最佳实践
function verifySignature(body: string, signature: string, secret: string): boolean {
  if (!signature || !body) {
    console.log('❌ Signature verification failed: missing signature or body');
    return false;
  }

  const [timestampPart, signaturePart] = signature.split(',');
  if (!timestampPart || !signaturePart) {
    console.log('❌ Signature verification failed: invalid signature format');
    return false;
  }

  const timestamp = timestampPart.split('=')[1];
  const expectedSignature = signaturePart.split('=')[1];

  if (!timestamp || !expectedSignature) {
    console.log('❌ Signature verification failed: missing timestamp or signature');
    return false;
  }

  const signedPayload = `${timestamp}.${body}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(signedPayload);
  const calculatedSignature = hmac.digest('hex');

  const isValid = calculatedSignature === expectedSignature;
  console.log(`🔐 Signature verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
  
  return isValid;
}

export async function POST(request: Request) {
  const startTime = Date.now();
  console.log('🎯 ==> Creem Webhook received at', new Date().toISOString());
  
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('creem-signature') || '';
    
    console.log('📦 Webhook body length:', body.length);
    console.log('🔑 Signature present:', !!signature);

    if (!verifySignature(body, signature, process.env.CREEM_WEBHOOK_SECRET!)) {
      console.error('❌ Invalid signature - webhook rejected');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = createClient();

    console.log('📋 Webhook event details:');
    console.log('   - Type:', event.type);
    console.log('   - ID:', event.id || 'N/A');
    console.log('   - Data object:', !!event.data?.object);

    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('🛒 Processing checkout.session.completed event');
        const session = event.data.object;
        const userId = session.metadata?.user_id;

        console.log('   - Session ID:', session.id);
        console.log('   - User ID from metadata:', userId);
        console.log('   - Customer ID:', session.customer);
        console.log('   - Subscription ID:', session.subscription);

        if (!userId) {
          console.error('❌ No user_id in session metadata');
          return NextResponse.json({ error: 'No user_id found' }, { status: 400 });
        }

        // 检查是否已经存在订阅
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', userId)
          .in('status', ['active', 'trialing'])
          .single();

        if (existingSubscription) {
          console.log('⚠️ User already has active subscription, skipping creation');
          return NextResponse.json({ 
            received: true, 
            message: 'User already has active subscription' 
          });
        }

        // 创建新订阅
        const subscriptionData = {
          user_id: userId,
          plan_type: session.metadata?.plan || 'pro',
          status: 'active',
          creem_subscription_id: session.subscription,
          creem_customer_id: session.customer,
          creem_price_id: session.line_items?.data?.[0]?.price?.id,
          current_period_start: new Date(session.created * 1000).toISOString(),
          current_period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log('💾 Creating subscription with data:', subscriptionData);
        
        const { error } = await supabase.from('subscriptions').insert(subscriptionData);
        
        if (error) {
          console.error('❌ Database error creating subscription:', error);
          return NextResponse.json({ error: 'Database error on subscription creation' }, { status: 500 });
        }
        
        console.log('✅ Subscription created successfully for user:', userId);
        break;
      }

      case 'invoice.payment_succeeded': {
        console.log('💰 Processing invoice.payment_succeeded event');
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        
        console.log('   - Invoice ID:', invoice.id);
        console.log('   - Subscription ID:', subscriptionId);
        console.log('   - Period:', new Date(invoice.period_start * 1000).toISOString(), 'to', new Date(invoice.period_end * 1000).toISOString());

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
          console.error('❌ Database error updating subscription:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log('✅ Subscription renewed:', subscriptionId);
        break;
      }

      case 'invoice.payment_failed': {
        console.log('⚠️ Processing invoice.payment_failed event');
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        
        console.log('   - Invoice ID:', invoice.id);
        console.log('   - Subscription ID:', subscriptionId);

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('creem_subscription_id', subscriptionId);

        if (error) {
          console.error('❌ Database error updating subscription status:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log('⚠️ Subscription marked as past due:', subscriptionId);
        break;
      }

      case 'customer.subscription.deleted': {
        console.log('🗑️ Processing customer.subscription.deleted event');
        const subscription = event.data.object;
        const subscriptionId = subscription.id;
        
        console.log('   - Subscription ID:', subscriptionId);

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('creem_subscription_id', subscriptionId);

        if (error) {
          console.error('❌ Database error cancelling subscription:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log('🗑️ Subscription cancelled:', subscriptionId);
        break;
      }

      default:
        console.log('ℹ️ Unhandled event type:', event.type);
    }

    const processingTime = Date.now() - startTime;
    console.log(`✅ Webhook processed successfully in ${processingTime}ms`);
    
    return NextResponse.json({ 
      received: true,
      processed_at: new Date().toISOString(),
      processing_time_ms: processingTime
    });

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ Webhook processing error after ${processingTime}ms:`, error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({ 
      error: `Webhook handler failed: ${error.message}`,
      processed_at: new Date().toISOString(),
      processing_time_ms: processingTime
    }, { status: 500 });
  }
} 