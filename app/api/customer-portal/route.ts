import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 获取当前用户
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 获取用户的订阅信息
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('creem_customer_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription?.creem_customer_id) {
      return NextResponse.json({ 
        error: 'No active subscription found' 
      }, { status: 404 });
    }

    // 创建Creem客户门户会话
    // 注意：这里的API调用需要根据Creem的实际文档进行调整
    const creemResponse = await fetch('https://api.creem.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CREEM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: subscription.creem_customer_id,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      }),
    });

    if (!creemResponse.ok) {
      const error = await creemResponse.json();
      console.error('Creem portal API error:', error);
      return NextResponse.json({ 
        error: 'Failed to create portal session' 
      }, { status: 500 });
    }

    const portalSession = await creemResponse.json();
    
    return NextResponse.json({ 
      url: portalSession.url 
    });

  } catch (error) {
    console.error('Customer portal creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 