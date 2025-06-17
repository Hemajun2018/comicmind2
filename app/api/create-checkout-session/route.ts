import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 注意：这里使用的是示例代码，需要根据实际的Creem API文档进行调整
export async function POST(request: Request) {
  try {
    const { plan = 'pro' } = await request.json();
    
    // 获取当前用户
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 检查用户是否已经有活跃订阅
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .single();

    if (existingSubscription) {
      return NextResponse.json({ 
        error: 'User already has an active subscription' 
      }, { status: 400 });
    }

    // 创建Creem结账会话
    // 注意：这里的API调用需要根据Creem的实际文档进行调整
    const creemResponse = await fetch('https://api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CREEM_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: process.env.CREEM_PRICE_ID_PRO!,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
        customer_email: user.email,
        metadata: {
          user_id: user.id,
          plan: plan,
        },
      }),
    });

    if (!creemResponse.ok) {
      const errorText = await creemResponse.text();
      console.error(`Creem API error: ${creemResponse.status}`, errorText);
      return NextResponse.json({ 
        error: `Failed to create checkout session. Creem API responded with: ${errorText}` 
      }, { status: 500 });
    }

    const session = await creemResponse.json();
    
    return NextResponse.json({ 
      url: session.url 
    });

  } catch (error: any) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
} 