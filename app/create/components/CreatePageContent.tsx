'use client';

import { useState, useEffect } from 'react';
import { Loader2, Sparkles, Download, RefreshCw, Crown, AlertCircle, History } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/AuthContext';
import { checkDailyLimit, getUserSubscription } from '@/lib/supabase/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  language: string;
  image_url: string;
  structure_content: string;
  created_at: string;
}

export function CreatePageContent() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('english');
  const [style, setStyle] = useState('kawaii');
  const [aspectRatio, setAspectRatio] = useState('4:3');
  
  // 生成状态
  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedStructure, setGeneratedStructure] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  
  // 历史记录
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // 用户状态
  const [hasQuota, setHasQuota] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const aspectRatioOptions = [
    { value: '1:1', label: '1:1 (Square)' },
    { value: '3:4', label: '3:4 (Portrait)' },
    { value: '9:16', label: '9:16 (Vertical)' },
    { value: '4:3', label: '4:3 (Landscape)' },
    { value: '16:9', label: '16:9 (Wide)' },
  ];

  const styleOptions = [
    { value: 'kawaii', label: 'Kawaii Flat Cartoon' },
    { value: 'flat', label: 'Flat Minimalist' },
    { value: 'watercolor', label: 'Watercolor Artistic' },
    { value: 'chalkboard', label: 'Chalkboard Style' },
    { value: '3d', label: '3D Rendered' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'chinese', label: '中文 (Chinese)' },
    { value: 'japanese', label: '日本語 (Japanese)' },
    { value: 'spanish', label: 'Español (Spanish)' },
    { value: 'french', label: 'Français (French)' },
    { value: 'german', label: 'Deutsch (German)' },
    { value: 'korean', label: '한국어 (Korean)' },
    { value: 'portuguese', label: 'Português (Portuguese)' },
  ];

  // 检查用户订阅状态和配额
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) return;
      
      try {
        // 检查订阅状态
        const subscription = await getUserSubscription(user.id);
        setIsSubscribed(subscription?.status === 'active');
        
        // 检查每日配额
        const mockIP = '127.0.0.1';
        const quota = await checkDailyLimit(user.id, mockIP);
        setHasQuota(quota);
      } catch (error) {
        console.error('检查用户状态失败:', error);
      }
    };

    checkUserStatus();
  }, [user]);

  // 加载历史记录（只有登录且付费用户才显示）
  useEffect(() => {
    const loadHistory = async () => {
      if (!user || !isSubscribed) return;
      
      setIsLoadingHistory(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('generated_images')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setGeneratedImages(data || []);
      } catch (error) {
        console.error('加载历史记录失败:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [user, isSubscribed]);

  // 生成思维导图结构
  const handleGenerateStructure = async () => {
    if (!input.trim()) {
      toast.error('请输入内容来生成思维导图');
      return;
    }

    setIsGeneratingStructure(true);

    try {
      const response = await fetch('/api/generate-structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input,
          language: language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'DAILY_LIMIT_REACHED') {
          setHasQuota(false);
          toast.error('每日使用次数已用完，升级到Pro版本享受无限制使用！');
          return;
        }
        throw new Error(data.error || '结构生成失败');
      }

      setGeneratedStructure(data.structure);
      toast.success('思维导图结构生成成功！');
      
      // 自动开始生成图片
      await handleGenerateImage(data.structure);
    } catch (error) {
      console.error('结构生成错误:', error);
      toast.error('结构生成失败，请重试');
    } finally {
      setIsGeneratingStructure(false);
    }
  };

  // 生成图片
  const handleGenerateImage = async (structure?: string) => {
    const structureToUse = structure || generatedStructure;
    if (!structureToUse.trim()) {
      toast.error('请先生成思维导图结构');
      return;
    }

    setIsGeneratingImage(true);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structure: structureToUse,
          style,
          ratio: aspectRatio,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'DAILY_LIMIT_REACHED') {
          setHasQuota(false);
          toast.error('每日使用次数已用完，升级到Pro版本享受无限制使用！');
          return;
        }
        throw new Error(data.error || '图片生成失败');
      }

      const imageUrl = data.imageUrl || '';
      setCurrentImageUrl(imageUrl);
      
      // 只有登录且付费的用户才保存到数据库
      if (user && isSubscribed) {
        await saveImageToDatabase(imageUrl, structureToUse);
      }

      toast.success('思维导图图片生成成功！');
    } catch (error) {
      console.error('图片生成错误:', error);
      toast.error('图片生成失败，请重试');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 保存图片记录到数据库
  const saveImageToDatabase = async (imageUrl: string, structure: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('generated_images')
        .insert({
          user_id: user!.id,
          prompt: input,
          style,
          aspect_ratio: aspectRatio,
          language,
          image_url: imageUrl,
          structure_content: structure,
        })
        .select()
        .single();

      if (error) throw error;

      // 更新历史记录
      setGeneratedImages(prev => [data, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('保存图片记录失败:', error);
    }
  };

  // 下载图片
  const handleDownload = (imageUrl?: string) => {
    const urlToDownload = imageUrl || currentImageUrl;
    if (urlToDownload) {
      const link = document.createElement('a');
      link.href = urlToDownload;
      link.download = `mindmap-${Date.now()}.png`;
      link.click();
      toast.success('思维导图已下载！');
    } else {
      toast.error('没有可下载的图片');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Mind Map Generator</h1>
          <p className="text-gray-600">Transform your ideas into beautiful visual mind maps</p>
        </div>

        {/* 上半部分：图片显示区域 */}
        <div className="mb-8">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                {isGeneratingStructure || isGeneratingImage ? (
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-600 text-lg">
                      {isGeneratingStructure ? 'Analyzing content...' : 'Generating image...'}
                    </p>
                  </div>
                ) : currentImageUrl ? (
                  <div className="relative w-full max-w-4xl">
                    <Image
                      src={currentImageUrl}
                      alt="Generated Mind Map"
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-lg shadow-lg"
                      unoptimized
                    />
                    <div className="absolute top-4 right-4 space-x-2">
                      <Button
                        onClick={() => handleDownload()}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={() => handleGenerateImage()}
                        variant="outline"
                        size="sm"
                        disabled={!generatedStructure}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Sparkles className="w-16 h-16 text-gray-400 mx-auto" />
                    <p className="text-gray-600 text-lg">Enter content below to generate your mind map</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 下半部分：输入控制区域和历史记录 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 左侧：输入和控制区域 (占2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Content Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your text, ideas, or article content here. Our AI will analyze it and create a structured mind map..."
                  className="min-h-[120px] resize-none"
                  disabled={isGeneratingStructure || isGeneratingImage}
                />
                <div className="text-sm text-gray-500">
                  {input.length}/2000 characters
                </div>

                {/* 配置选项 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Style</label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Aspect Ratio</label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatioOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 生成按钮 */}
                <Button
                  onClick={handleGenerateStructure}
                  disabled={!input.trim() || isGeneratingStructure || isGeneratingImage || !hasQuota}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isGeneratingStructure || isGeneratingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Mind Map
                    </>
                  )}
                </Button>

                {/* 配额警告 */}
                {!hasQuota && (
                  <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-orange-700">
                      Daily limit reached. {!user && 'Please log in or '}Upgrade to Pro for unlimited access!
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：历史记录 (占1/3) */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    History
                  </CardTitle>
                  {isSubscribed && (
                    <Badge className="bg-yellow-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Please log in to view generation history</p>
                  </div>
                ) : !isSubscribed ? (
                  <div className="text-center py-8 text-gray-500">
                    <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                    <p className="mb-2">Upgrade to Pro</p>
                    <p className="text-sm">Save and view all your mind maps</p>
                  </div>
                ) : isLoadingHistory ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                  </div>
                ) : generatedImages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No history yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {generatedImages.map((image) => (
                      <div
                        key={image.id}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setCurrentImageUrl(image.image_url)}
                      >
                        <div className="flex items-start space-x-3">
                          <Image
                            src={image.image_url}
                            alt="Mind map thumbnail"
                            width={60}
                            height={45}
                            className="rounded object-cover flex-shrink-0"
                            unoptimized
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {image.prompt.slice(0, 50)}...
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {styleOptions.find(s => s.value === image.style)?.label}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(image.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(image.image_url);
                            }}
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 