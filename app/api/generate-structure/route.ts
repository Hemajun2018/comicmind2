import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkDailyLimit, recordUsage, getUserSubscription } from '@/lib/supabase/utils';

// 使用麻雀API平台的Gemini模型
const API_URL = process.env.GEMINI_API_URL || 'https://ismaque.org/v1/chat/completions';
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  try {
    const { text, language = 'english' } = await request.json();
    
    // 获取用户信息和IP地址
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1';

    // 检查用户每日限制
    try {
      const hasQuota = await checkDailyLimit(user?.id, clientIP);
      if (!hasQuota) {
        return NextResponse.json({ 
          error: 'Daily limit reached',
          message: 'You have reached your daily limit of 3 mind maps. Upgrade to Pro for unlimited access.',
          code: 'DAILY_LIMIT_REACHED',
          upgradeRequired: true
        }, { status: 429 });
      }
    } catch (limitError) {
      console.error('Error checking daily limit:', limitError);
      // 如果限制检查失败，为了用户体验继续处理但记录错误
    }

    // Create a specialized prompt for mind map structure generation
    const prompt = `Based on the following text, create a structured mind map outline in Markdown format. The mind map should be hierarchical, well-organized, and capture the key concepts and relationships.

Text to analyze: "${text}"

Requirements:
- Use Markdown format with # for main topic, ## for primary branches, ### for sub-branches
- Create 3-6 main branches maximum
- Each branch should have 2-4 sub-branches
- Keep text concise and clear
- Focus on key concepts, relationships, and actionable items
- Language: ${language}
- Structure should be logical and easy to understand

Example format:
# Main Topic
## Branch 1
### Sub-branch 1.1
### Sub-branch 1.2
## Branch 2
### Sub-branch 2.1
### Sub-branch 2.2

Please generate the mind map structure:`;

    const requestBody = {
      model: 'gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: false,
    };

    console.log('Generating mind map structure with Gemini...');
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      
      return NextResponse.json({ 
        error: errorData.error?.message || 'Failed to generate mind map structure',
        details: errorData
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('Structure generation response:', data);
    
    // Extract the generated structure from the response
    const structure = data.choices?.[0]?.message?.content || '';
    
    // 记录使用量（只有在成功生成后才记录）
    try {
      await recordUsage(user?.id, clientIP);
    } catch (usageError) {
      console.error('Error recording usage:', usageError);
      // 记录使用量失败不影响主要功能
    }
    
    return NextResponse.json({ 
      success: true,
      structure: structure,
      usage: data.usage
    });
    
  } catch (error) {
    console.error('Structure generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 