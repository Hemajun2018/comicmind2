import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkDailyLimit, getUserSubscription } from '@/lib/supabase/utils';

// 使用环境变量配置API
const API_URL = process.env.GEMINI_API_URL || 'https://ismaque.org/v1/chat/completions';
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  try {
    const { structure, style = 'kawaii', ratio = '16:9', language = 'english' } = await request.json();

    // 获取用户信息和IP地址
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1';

    // 检查用户每日限制 (临时禁用)
    /*
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
    */

    // Create a specialized prompt for comic mind maps based on the structure
    const styleDescriptions = {
      kawaii: 'Kawaii flat cartoon style with cute characters and bright pastel colors',
      flat: 'Clean flat minimalist design with simple shapes and modern typography',
      watercolor: 'Artistic watercolor painting style with soft flowing paint effects',
      chalkboard: 'Chalk on blackboard style with white chalk drawings on dark background',
      '3d': 'Three-dimensional rendered style with depth, shadows and realistic textures'
    };

    const prompt = `Create a ${styleDescriptions[style as keyof typeof styleDescriptions] || styleDescriptions.kawaii} based on this mind map structure:

${structure}

Style requirements:
- ${styleDescriptions[style as keyof typeof styleDescriptions] || styleDescriptions.kawaii}
- Clear hierarchy and visual connections between concepts
- Easy to read text labels
- Engaging visual elements appropriate to the ${style} style
- Aspect ratio: ${ratio}
- Language: ${language}
- Professional yet approachable design
- Include appropriate icons or illustrations for each concept
- Make sure the mind map layout fits well within the ${ratio} aspect ratio
- Central topic should be prominently displayed
- Use connecting lines or branches to show relationships
- Color-coded sections for better organization
`;

    const requestBody = {
      model: 'gpt-4o-image',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: false,
      // 如果API支持ratio参数，也传递给API
      ...(ratio && { ratio }),
    };

    console.log('Sending image generation request to:', API_URL);
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
      
      // 检查是否是分组配置问题
      if (errorData.error?.message?.includes('无可用渠道')) {
        return NextResponse.json({ 
          error: 'gpt-4o-image model is not available in current group',
          message: 'Please configure Maque API group following these steps:',
          steps: [
            '1. Visit Maque API console: https://pbs32p1cml.apifox.cn/',
            '2. Go to Workspace -> API Tokens page',
            '3. Find your API token and click edit',
            '4. Select a group that includes gpt-4o-image model in "Channel Group"',
            '5. Save configuration and retry'
          ],
          originalError: errorData.error?.message,
          requestId: errorData.error?.message?.match(/request id: ([^)]+)/)?.[1]
        }, { status: 503 });
      }
      
      return NextResponse.json({ 
        error: errorData.error?.message || 'API request failed',
        details: errorData
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    // 提取图片URL
    const messageContent = data.choices?.[0]?.message?.content || '';
    console.log('Message content:', messageContent);
    
    // 从消息内容中提取图片URL
    // 查找.png或.jpg结尾的URL，并处理可能的编码
    let imageUrl = '';
    
    // 尝试多种URL提取方式
    const urlPatterns = [
      /https?:\/\/[^\s\)\]]+\.(?:png|jpg|jpeg|gif|webp)/gi,
      /https?:\/\/[^\s\)\]]+/gi,
      /\[.*?\]\((https?:\/\/[^\)]+)\)/gi,
      /!\[.*?\]\((https?:\/\/[^\)]+)\)/gi
    ];
    
    for (const pattern of urlPatterns) {
      const matches = messageContent.match(pattern);
      if (matches && matches.length > 0) {
        // 取最后一个匹配的URL（通常是最终生成的图片）
        imageUrl = matches[matches.length - 1];
        
        // 如果是markdown格式，提取URL部分
        const markdownMatch = imageUrl.match(/\((https?:\/\/[^\)]+)\)/);
        if (markdownMatch) {
          imageUrl = markdownMatch[1];
        }
        
        // 清理URL中的特殊字符
        imageUrl = imageUrl.replace(/[^\w\-\.\/\:\?\=\&]/g, '').trim();
        
        if (imageUrl && imageUrl.startsWith('http')) {
          break;
        }
      }
    }
    
    console.log('Extracted image URL:', imageUrl);
    
    if (!imageUrl) {
      console.error('No image URL found in response content:', messageContent);
      return NextResponse.json({ 
        error: 'Generated image URL not found',
        details: messageContent
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      imageUrl: imageUrl,
      originalResponse: data
    });
    
  } catch (error) {
    console.error('Request error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 