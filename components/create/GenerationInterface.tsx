'use client';

import { useState, useEffect } from 'react';
import { Loader2, Sparkles, Download, RefreshCw, Edit, Check, X, Crown, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/AuthContext';
import { checkDailyLimit } from '@/lib/supabase/utils';

interface GenerationState {
  step: 'input' | 'structure' | 'image';
  isGeneratingStructure: boolean;
  isGeneratingImage: boolean;
  hasStructure: boolean;
  hasImage: boolean;
  error: string | null;
}

// 生成记录接口
interface GenerationRecord {
  id: string;
  inputText: string;
  imageUrl: string;
  language: string;
  style: string;
  aspectRatio: string;
  createdAt: Date;
}

export function GenerationInterface() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('english');
  const [style, setStyle] = useState('kawaii');
  const [aspectRatio, setAspectRatio] = useState('4:3');
  
  // 限制状态管理
  const [hasQuota, setHasQuota] = useState(true);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const [generationState, setGenerationState] = useState<GenerationState>({
    step: 'input',
    isGeneratingStructure: false,
    isGeneratingImage: false,
    hasStructure: false,
    hasImage: false,
    error: null,
  });

  const [generatedStructure, setGeneratedStructure] = useState('');
  const [editableStructure, setEditableStructure] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  
  const [showStructureModal, setShowStructureModal] = useState(false);

  // 生成记录管理
  const [generationRecords, setGenerationRecords] = useState<GenerationRecord[]>([]);

  // 检查用户限制
  useEffect(() => {
    const checkUserQuota = async () => {
      setQuotaLoading(true);
      try {
        // 模拟获取客户端IP（实际应用中需要从服务端获取）
        const mockIP = '127.0.0.1';
        const quota = await checkDailyLimit(user?.id, mockIP);
        setHasQuota(quota);
      } catch (error) {
        console.error('检查限制失败:', error);
        // 如果检查失败，默认允许使用
        setHasQuota(true);
      } finally {
        setQuotaLoading(false);
      }
    };

    checkUserQuota();
    
    // 加载历史记录（从localStorage暂存，后续可以改为从数据库获取）
    loadGenerationRecords();
  }, [user]);

  // 加载生成记录
  const loadGenerationRecords = () => {
    try {
      const savedRecords = localStorage.getItem('generationRecords');
      if (savedRecords) {
        const records = JSON.parse(savedRecords).map((record: any) => ({
          ...record,
          createdAt: new Date(record.createdAt)
        }));
        setGenerationRecords(records.reverse()); // 最新的显示在前面
      }
    } catch (error) {
      console.error('加载生成记录失败:', error);
    }
  };

  // 保存生成记录
  const saveGenerationRecord = (record: GenerationRecord) => {
    try {
      const updatedRecords = [record, ...generationRecords];
      setGenerationRecords(updatedRecords);
      localStorage.setItem('generationRecords', JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('保存生成记录失败:', error);
    }
  };

  // 删除生成记录
  const deleteGenerationRecord = (recordId: string) => {
    try {
      const updatedRecords = generationRecords.filter(record => record.id !== recordId);
      setGenerationRecords(updatedRecords);
      localStorage.setItem('generationRecords', JSON.stringify(updatedRecords));
      toast.success('记录已删除');
    } catch (error) {
      console.error('删除生成记录失败:', error);
      toast.error('删除记录失败');
    }
  };

  // 重新检查配额的函数
  const recheckQuota = async () => {
    try {
      // 模拟获取客户端IP（实际应用中需要从服务端获取）
      const mockIP = '127.0.0.1';
      const quota = await checkDailyLimit(user?.id, mockIP);
      setHasQuota(quota);
    } catch (error) {
      console.error('重新检查配额失败:', error);
      // 检查失败时默认有配额，避免影响用户体验
      setHasQuota(true);
    }
  };

  const aspectRatioOptions = [
    { 
      value: '1:1', 
      ratio: '1:1',
      dimensions: 'w-full aspect-square',
      shapeClass: 'w-7 h-7'
    },
    { 
      value: '3:4', 
      ratio: '3:4',
      dimensions: 'w-full aspect-[3/4]',
      shapeClass: 'w-6 h-8'
    },
    { 
      value: '9:16', 
      ratio: '9:16',
      dimensions: 'w-full aspect-[9/16]',
      shapeClass: 'w-4 h-8'
    },
    { 
      value: '4:3', 
      ratio: '4:3',
      dimensions: 'w-full aspect-[4/3]',
      shapeClass: 'w-9 h-7'
    },
    { 
      value: '16:9', 
      ratio: '16:9',
      dimensions: 'w-full aspect-video',
      shapeClass: 'w-10 h-6'
    },
  ];

  const styleOptions = [
    { value: 'kawaii', label: 'Kawaii Flat Cartoon Style', description: 'Cute flat cartoon with bright colors' },
    { value: 'flat', label: 'Flat Minimalist Style', description: 'Clean and simple flat design' },
    { value: 'watercolor', label: 'Watercolor Artistic', description: 'Soft watercolor painting style' },
    { value: 'chalkboard', label: 'Chalkboard Style', description: 'Chalk on blackboard style' },
    { value: '3d', label: '3D', description: 'Three-dimensional rendered style' }
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

  // 第一阶段：生成思维导图结构
  const handleGenerateStructure = async () => {
    if (!input.trim()) {
      toast.error('Please enter content to generate mind map');
      return;
    }

    setGenerationState({
      step: 'structure',
      isGeneratingStructure: true,
      isGeneratingImage: false,
      hasStructure: false,
      hasImage: false,
      error: null,
    });

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
        // 检查是否是限制达到的错误
        if (data.code === 'DAILY_LIMIT_REACHED') {
          setHasQuota(false);
          setShowUpgradePrompt(true);
          toast.error('每日使用次数已用完，升级到Pro版本享受无限制使用！');
          setGenerationState({
            step: 'input',
            isGeneratingStructure: false,
            isGeneratingImage: false,
            hasStructure: false,
            hasImage: false,
            error: null,
          });
          return;
        }
        throw new Error(data.error || 'Structure generation failed');
      }

      setGeneratedStructure(data.structure);
      setEditableStructure(data.structure);
      setGenerationState({
        step: 'structure',
        isGeneratingStructure: false,
        isGeneratingImage: false,
        hasStructure: true,
        hasImage: false,
        error: null,
      });

      setShowStructureModal(true);
      toast.success('Mind map structure generated successfully! Please confirm content and click generate image');
      
      // 生成成功后重新检查限制状态
      await recheckQuota();
    } catch (error) {
      console.error('Structure generation error:', error);
      setGenerationState({
        step: 'input',
        isGeneratingStructure: false,
        isGeneratingImage: false,
        hasStructure: false,
        hasImage: false,
        error: error instanceof Error ? error.message : 'Structure generation failed',
      });
      toast.error(error instanceof Error ? error.message : 'Structure generation failed');
    }
  };

  // 第二阶段：生成思维导图图片
  const handleGenerateImage = async () => {
    if (!editableStructure) {
      toast.error('No structure available for image generation');
      return;
    }

    setGenerationState({
      step: 'image',
      isGeneratingStructure: false,
      isGeneratingImage: true,
      hasStructure: true,
      hasImage: false,
      error: null,
    });

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structure: editableStructure,
          style: style,
          aspectRatio: aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Image generation failed');
      }

      setGeneratedImageUrl(data.imageUrl);
      setGenerationState({
        step: 'image',
        isGeneratingStructure: false,
        isGeneratingImage: false,
        hasStructure: true,
        hasImage: true,
        error: null,
      });

      // 保存生成记录
      const newRecord: GenerationRecord = {
        id: Date.now().toString(),
        inputText: input,
        imageUrl: data.imageUrl,
        language: language,
        style: style,
        aspectRatio: aspectRatio,
        createdAt: new Date()
      };
      saveGenerationRecord(newRecord);

      toast.success('Mind map generated successfully!');
    } catch (error) {
      console.error('Image generation error:', error);
      setGenerationState({
        step: 'structure',
        isGeneratingStructure: false,
        isGeneratingImage: false,
        hasStructure: true,
        hasImage: false,
        error: error instanceof Error ? error.message : 'Image generation failed',
      });
      toast.error(error instanceof Error ? error.message : 'Image generation failed');
    }
  };

  const handleCloseModal = () => {
    setShowStructureModal(false);
  };

  const handleConfirmStructure = () => {
    setShowStructureModal(false);
    // 结构确认后，直接开始生成图片
    handleGenerateImage();
  };

  const handleRegenerate = () => {
    if (generationState.hasStructure && !generationState.hasImage) {
      handleGenerateImage();
    } else {
      handleGenerateStructure();
    }
  };

  const handleDownload = (imageUrl?: string) => {
    const downloadUrl = imageUrl || generatedImageUrl;
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'mindmap.png';
      link.click();
      toast.success('Mind map downloaded!');
    } else {
      toast.error('No image available for download');
    }
  };

  const handleStartOver = () => {
    setGenerationState({
      step: 'input',
      isGeneratingStructure: false,
      isGeneratingImage: false,
      hasStructure: false,
      hasImage: false,
      error: null,
    });
    setGeneratedStructure('');
    setEditableStructure('');
    setGeneratedImageUrl('');
    setShowStructureModal(false);
    setInput('');
  };

  const selectedAspectRatio = aspectRatioOptions.find(option => option.value === aspectRatio);

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* 主内容区域 */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 上部分：输入控制区域 */}
        <div className="bg-neutral-card rounded-xl p-6 shadow-soft mb-8">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-text mb-6">Create Mind Map</h1>
            
            {/* 主要输入区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* 左侧：文本输入 */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-text">
                    Input Content
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your text, ideas, or article content here. Our AI will analyze it and create a structured mind map..."
                    className="w-full h-32 p-4 border border-border rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors-smooth text-text placeholder-text-muted bg-neutral-bg"
                    disabled={generationState.isGeneratingStructure || generationState.isGeneratingImage}
                  />
                  <div className="text-sm text-text-muted">
                    {input.length}/2000 characters
                  </div>
                </div>

                {/* 限制提示 */}
                {!hasQuota && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-800 mb-1">Daily limit reached</h4>
                        <p className="text-sm text-yellow-700">Free users can create 3 mind maps daily. Upgrade to Pro for unlimited use!</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.open('/settings', '_blank')}
                      className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Crown className="w-4 h-4" />
                      <span>Upgrade to Pro</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 右侧：配置选项 */}
              <div className="space-y-6">
                
                {/* 比例选择 */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-text">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {aspectRatioOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setAspectRatio(option.value)}
                        disabled={generationState.isGeneratingStructure || generationState.isGeneratingImage}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                          aspectRatio === option.value
                            ? 'border-primary bg-primary/10 shadow-lg scale-105'
                            : 'border-border bg-neutral-bg hover:border-primary/50 hover:bg-primary/5'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          {/* 可视化形状 */}
                          <div className={`${option.shapeClass} border-2 rounded-sm ${
                            aspectRatio === option.value 
                              ? 'bg-primary/30 border-primary shadow-md' 
                              : 'bg-gray-200 border-gray-300'
                          }`}></div>
                          
                          {/* 比例标签 */}
                          <div className={`text-xs font-semibold ${
                            aspectRatio === option.value ? 'text-primary' : 'text-text-muted'
                          }`}>
                            {option.ratio}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 风格和语言 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 风格选择 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text">
                      Art Style
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors-smooth text-text bg-neutral-bg"
                      disabled={generationState.isGeneratingStructure || generationState.isGeneratingImage}
                    >
                      {styleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 语言选择 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors-smooth text-text bg-neutral-bg"
                      disabled={generationState.isGeneratingStructure || generationState.isGeneratingImage}
                    >
                      {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              
              {/* 生成结构按钮 */}
              {generationState.step === 'input' && (
                <button
                  onClick={handleGenerateStructure}
                  disabled={generationState.isGeneratingStructure || !input.trim() || !hasQuota || quotaLoading}
                  className="flex-1 bg-primary text-white px-6 py-4 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {generationState.isGeneratingStructure ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating Structure...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Mind Map Structure</span>
                    </>
                  )}
                </button>
              )}

              {/* 生成图片按钮 */}
              {generationState.hasStructure && !generationState.hasImage && (
                <button
                  onClick={handleGenerateImage}
                  disabled={generationState.isGeneratingImage || !hasQuota}
                  className="flex-1 bg-accent text-white px-6 py-4 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {generationState.isGeneratingImage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating Image...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Mind Map Image</span>
                    </>
                  )}
                </button>
              )}

              {/* 完成后的操作按钮 */}
              {generationState.hasImage && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleRegenerate}
                    className="flex-1 border-2 border-accent text-accent px-4 py-3 rounded-xl font-medium hover:bg-accent hover:text-white transition-colors-smooth flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Regenerate</span>
                  </button>
                  <button
                    onClick={() => handleDownload()}
                    className="flex-1 bg-secondary text-text px-4 py-3 rounded-xl font-medium hover-darken transition-colors-smooth flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleStartOver}
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover-darken active-darken transition-colors-smooth shadow-soft"
                  >
                    Create New
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 下部分：生成记录区域 */}
        <div className="bg-neutral-card rounded-xl p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-text mb-6">Generation History</h2>
          
          {generationRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                No generation history yet
              </h3>
              <p className="text-text-muted max-w-md mx-auto">
                Your generated mind maps will appear here. Start by creating your first mind map above!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generationRecords.map((record) => (
                <div key={record.id} className="bg-neutral-bg rounded-xl border border-border p-4 hover:shadow-lg transition-shadow group">
                  
                  {/* 输入文字 */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-text mb-2 text-sm">Input Text:</h4>
                    <p className="text-text-muted text-sm line-clamp-3">
                      {record.inputText}
                    </p>
                  </div>

                  {/* 生成图片 */}
                  <div className="mb-4">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[4/3]">
                      <img 
                        src={record.imageUrl} 
                        alt="Generated Mind Map" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* 元数据 */}
                  <div className="mb-4 text-xs text-text-muted space-y-1">
                    <div className="flex justify-between">
                      <span>Style:</span>
                      <span className="font-medium">{styleOptions.find(s => s.value === record.style)?.label || record.style}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ratio:</span>
                      <span className="font-medium">{record.aspectRatio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <span className="font-medium">{languageOptions.find(l => l.value === record.language)?.label || record.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="font-medium">{record.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(record.imageUrl)}
                      className="flex-1 bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => deleteGenerationRecord(record.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 结构审查模态框 */}
        {showStructureModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              {/* 模态框头部 */}
              <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Mind Map Structure Generated!</h2>
                    <p className="text-white/90">Please review and edit the structure below, then click "Generate Image" to create your mind map.</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* 模态框内容 */}
              <div className="p-6 max-h-[50vh] overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Mind Map Structure</h3>
                  <textarea
                    value={editableStructure}
                    onChange={(e) => setEditableStructure(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors font-mono text-sm bg-white"
                  />
                </div>
              </div>

              {/* 模态框底部 */}
              <div className="bg-gray-50 p-6">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleConfirmStructure}
                    className="px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors"
                  >
                    Generate Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}