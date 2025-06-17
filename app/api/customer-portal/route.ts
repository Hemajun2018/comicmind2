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
        error: 'No active subscription found or customer ID is missing.'
      }, { status: 404 });
    }

    // 直接构建Creem客户门户URL，无需API调用
    const portalUrl = `https://app.creem.io/self-serve/${subscription.creem_customer_id}`;

    return NextResponse.json({
      url: portalUrl
    });

  } catch (error: any) {
    console.error('Customer portal URL creation error:', error);
    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
} 