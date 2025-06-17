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

    // 检测是否为测试模式
    const apiKey = process.env.CREEM_API_KEY!;
    const isTestMode = apiKey.startsWith('creem_test_');
    
    // 根据测试/生产模式选择API端点
    const baseUrl = isTestMode 
      ? 'https://test-api.creem.io' 
      : 'https://api.creem.io';
    
    console.log(`Using Creem API endpoint: ${baseUrl}/v1/checkouts (Test Mode: ${isTestMode})`);

    // 调用Creem API创建结账会话
    const response = await fetch(`${baseUrl}/v1/checkouts`, {
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
        success_url: `${process.env.NEXTAUTH_URL}/settings/success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/settings?canceled=true`,
        metadata: {
          user_id: user.id,
          plan: plan,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Creem API error:', errorData);
      return NextResponse.json({ 
        error: `Failed to create checkout session. Creem API responded with: ${errorData}` 
      }, { status: response.status });
    }

    const data = await response.json();

    // 返回checkout URL，根据Creem API文档，返回字段可能是 checkout_url 或 url
    return NextResponse.json({ 
      url: data.checkout_url || data.url 
    });

  } catch (error: any) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json({ 
      error: `Failed to create checkout session: ${error.message}` 
    }, { status: 500 });
  }
} 