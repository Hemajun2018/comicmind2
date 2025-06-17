import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 根据Creem.io官方API文档更新的代码
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

    // 根据API Key判断使用测试环境还是生产环境的端点
    const apiKey = process.env.CREEM_API_KEY!;
    const isTestMode = apiKey.startsWith('creem_test_');
    const apiEndpoint = isTestMode 
      ? 'https://test-api.creem.io/v1/checkouts'
      : 'https://api.creem.io/v1/checkouts';

    console.log(`Using Creem API endpoint: ${apiEndpoint} (Test Mode: ${isTestMode})`);

    // 创建Creem结账会话 - 使用正确的测试/生产环境端点
    const creemResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: process.env.CREEM_PRICE_ID_PRO!,
        customer: {
          email: user.email,
        },
        success_url: `${process.env.NEXTAUTH_URL}/settings?success=true`,
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
    
    // Creem API 返回的checkout URL字段名是 checkout_url
    return NextResponse.json({ 
      url: session.checkout_url 
    });

  } catch (error: any) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
} 