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
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return NextResponse.json({ 
        error: 'User already has an active subscription' 
      }, { status: 400 });
    }

    // 创建Creem结账会话
    // 注意：这里的API调用需要根据Creem的实际文档进行调整
    const creemResponse = await fetch('https://api.creem.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CREEM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
        customer_email: user.email,
        mode: 'subscription',
        line_items: [
          {
            price: process.env.CREEM_PRICE_ID_PRO, // 在环境变量中配置价格ID
            quantity: 1,
          },
        ],
        metadata: {
          user_id: user.id,
          plan: plan,
        },
      }),
    });

    if (!creemResponse.ok) {
      const error = await creemResponse.json();
      console.error('Creem API error:', error);
      return NextResponse.json({ 
        error: 'Failed to create checkout session' 
      }, { status: 500 });
    }

    const session = await creemResponse.json();
    
    return NextResponse.json({ 
      url: session.url 
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 