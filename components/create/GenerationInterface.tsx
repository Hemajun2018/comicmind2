'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Download, RefreshCw, Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface GenerationState {
  step: 'input' | 'structure' | 'image';
  isGeneratingStructure: boolean;
  isGeneratingImage: boolean;
  hasStructure: boolean;
  hasImage: boolean;
  error: string | null;
}

export function GenerationInterface() {
  const [input, setInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [style, setStyle] = useState('kawaii');
  const [language, setLanguage] = useState('english');
  const [generatedStructure, setGeneratedStructure] = useState('');
  const [editableStructure, setEditableStructure] = useState('');
  const [isEditingStructure, setIsEditingStructure] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [generationState, setGenerationState] = useState<GenerationState>({
    step: 'input',
    isGeneratingStructure: false,
    isGeneratingImage: false,
    hasStructure: false,
    hasImage: false,
    error: null,
  });

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
      toast.error('请输入内容来生成思维导图');
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
        throw new Error(data.error || '生成结构失败');
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

      toast.success('思维导图结构生成成功！请确认内容后点击生成图片');
    } catch (error) {
      console.error('Structure generation error:', error);
      setGenerationState({
        step: 'input',
        isGeneratingStructure: false,
        isGeneratingImage: false,
        hasStructure: false,
        hasImage: false,
        error: error instanceof Error ? error.message : '生成结构失败',
      });

      toast.error('生成结构失败，请重试');
    }
  };

  // 第二阶段：生成思维导图图片
  const handleGenerateImage = async () => {
    if (!editableStructure.trim()) {
      toast.error('请先生成或编辑思维导图结构');
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
          ratio: aspectRatio,
          language: language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成图片失败');
      }

      // 提取图片URL（根据API响应格式调整）
      const imageUrl = data.imageUrl || '';
      console.log('Received image URL:', imageUrl);
      setGeneratedImageUrl(imageUrl);
      
      setGenerationState({
        step: 'image',
        isGeneratingStructure: false,
        isGeneratingImage: false,
        hasStructure: true,
        hasImage: true,
        error: null,
      });

      toast.success('思维导图图片生成成功！');
    } catch (error) {
      console.error('Image generation error:', error);
      setGenerationState({
        step: 'structure',
        isGeneratingStructure: false,
        isGeneratingImage: false,
        hasStructure: true,
        hasImage: false,
        error: error instanceof Error ? error.message : '生成图片失败',
      });

      toast.error('生成图片失败，请重试');
    }
  };

  const handleEditStructure = () => {
    setIsEditingStructure(true);
  };

  const handleSaveStructure = () => {
    setGeneratedStructure(editableStructure);
    setIsEditingStructure(false);
    toast.success('结构已保存');
  };

  const handleCancelEdit = () => {
    setEditableStructure(generatedStructure);
    setIsEditingStructure(false);
  };

  const handleRegenerate = () => {
    if (generationState.hasStructure && !generationState.hasImage) {
      handleGenerateImage();
    } else {
      handleGenerateStructure();
    }
  };

  const handleDownload = () => {
    if (generatedImageUrl) {
      const link = document.createElement('a');
      link.href = generatedImageUrl;
      link.download = 'mindmap.png';
      link.click();
      toast.success('思维导图已下载！');
    } else {
      toast.error('没有可下载的图片');
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
    setIsEditingStructure(false);
  };

  const selectedAspectRatio = aspectRatioOptions.find(option => option.value === aspectRatio);

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-8">
          
          {/* Left Panel - Controls */}
          <div className="bg-neutral-card rounded-xl p-6 shadow-soft h-fit">
            <div className="space-y-6">
              
              {/* Input Section */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-text">
                  输入内容
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="在此输入您的文本、想法或文章内容。我们的AI将分析它并创建结构化的思维导图..."
                  className="w-full h-32 p-4 border border-border rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors-smooth text-text placeholder-text-muted bg-neutral-bg"
                  disabled={generationState.isGeneratingStructure || generationState.isGeneratingImage}
                />
                <div className="text-sm text-text-muted">
                  {input.length}/2000 字符
                </div>
              </div>

              {/* 思维导图结构编辑区域 */}
              {generationState.hasStructure && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-lg font-semibold text-text">
                      思维导图结构
                    </label>
                    {!isEditingStructure ? (
                      <button
                        onClick={handleEditStructure}
                        className="text-primary hover:text-primary/80 flex items-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>编辑</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveStructure}
                          className="text-green-600 hover:text-green-700 flex items-center space-x-1"
                        >
                          <Check className="w-4 h-4" />
                          <span>保存</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>取消</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {isEditingStructure ? (
                    <textarea
                      value={editableStructure}
                      onChange={(e) => setEditableStructure(e.target.value)}
                      className="w-full h-48 p-4 border border-border rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors-smooth text-text bg-neutral-bg font-mono text-sm"
                      placeholder="编辑思维导图结构..."
                    />
                  ) : (
                    <div className="w-full h-48 p-4 border border-border rounded-xl bg-neutral-bg overflow-y-auto">
                      <pre className="text-sm text-text font-mono whitespace-pre-wrap">{generatedStructure}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* Aspect Ratio - Visual Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-text">
                  长宽比
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
                        {/* Visual Shape */}
                        <div className={`${option.shapeClass} border-2 rounded-sm ${
                          aspectRatio === option.value 
                            ? 'bg-primary/30 border-primary shadow-md' 
                            : 'bg-gray-200 border-gray-300'
                        }`}></div>
                        
                        {/* Ratio Label */}
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

              {/* Style Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-text">
                  艺术风格
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
                <div className="text-sm text-text-muted">
                  {styleOptions.find(s => s.value === style)?.description}
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-text">
                  语言
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

              {/* Step 1: Generate Structure Button */}
              {generationState.step === 'input' && (
                <button
                  onClick={handleGenerateStructure}
                  disabled={generationState.isGeneratingStructure || !input.trim()}
                  className="w-full bg-primary text-white px-6 py-4 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {generationState.isGeneratingStructure ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>生成结构中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>生成思维导图结构</span>
                    </>
                  )}
                </button>
              )}

              {/* Step 2: Generate Image Button */}
              {generationState.hasStructure && !generationState.hasImage && (
                <button
                  onClick={handleGenerateImage}
                  disabled={generationState.isGeneratingImage}
                  className="w-full bg-accent text-white px-6 py-4 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {generationState.isGeneratingImage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>生成图片中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>生成思维导图图片</span>
                    </>
                  )}
                </button>
              )}

              {/* Action Buttons (when image generated) */}
              {generationState.hasImage && (
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={handleRegenerate}
                      className="flex-1 border-2 border-accent text-accent px-4 py-3 rounded-xl font-medium hover:bg-accent hover:text-white transition-colors-smooth flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>重新生成</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-secondary text-text px-4 py-3 rounded-xl font-medium hover-darken transition-colors-smooth flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>下载</span>
                    </button>
                  </div>
                  <button
                    onClick={handleStartOver}
                    className="w-full border border-border text-text-muted px-4 py-2 rounded-xl font-medium hover:bg-neutral-bg transition-colors-smooth"
                  >
                    重新开始
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview Canvas */}
          <div className="bg-neutral-card rounded-xl p-6 shadow-soft">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-text">预览</h2>
              
              {/* Preview Container */}
              <div className="relative">
                <div className={`${selectedAspectRatio?.dimensions} bg-neutral-bg border-2 border-dashed border-border rounded-xl overflow-hidden relative`}>
                  
                  {/* Loading Overlay - Structure Generation */}
                  {generationState.isGeneratingStructure && (
                    <div className="absolute inset-0 bg-neutral-card/90 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                        <div className="text-lg font-semibold text-text mb-2">正在生成思维导图结构...</div>
                        <div className="text-text-muted">AI正在分析您的内容并创建结构化大纲</div>
                        
                        {/* Progress Bar */}
                        <div className="w-64 bg-border rounded-full h-2 mt-4 mx-auto">
                          <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading Overlay - Image Generation */}
                  {generationState.isGeneratingImage && (
                    <div className="absolute inset-0 bg-neutral-card/90 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                        <div className="text-lg font-semibold text-text mb-2">正在生成思维导图图片...</div>
                        <div className="text-text-muted">AI正在将结构转换为漫画风格的思维导图</div>
                        
                        {/* Progress Bar */}
                        <div className="w-64 bg-border rounded-full h-2 mt-4 mx-auto">
                          <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {generationState.step === 'input' && !generationState.isGeneratingStructure && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-secondary" />
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-2">
                          您的思维导图将在这里显示
                        </h3>
                        <p className="text-text-muted max-w-md">
                          输入内容并点击"生成思维导图结构"开始创建漂亮的漫画风格思维导图
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Structure Generated - Waiting for Image */}
                  {generationState.hasStructure && !generationState.hasImage && !generationState.isGeneratingImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-accent/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <Check className="w-12 h-12 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-2">
                          结构生成完成！
                        </h3>
                        <p className="text-text-muted max-w-md">
                          思维导图结构已生成完成，请确认左侧内容后点击"生成思维导图图片"按钮
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Final Generated Image */}
                  {generationState.hasImage && generatedImageUrl && (
                    <div className="absolute inset-0">
                      <img 
                        src={generatedImageUrl} 
                        alt="Generated Mind Map"
                        className="w-full h-full object-contain rounded-xl"
                        onError={() => {
                          toast.error('图片加载失败');
                          setGeneratedImageUrl('');
                        }}
                      />
                    </div>
                  )}

                  {/* Fallback if image generation completed but no URL */}
                  {generationState.hasImage && !generatedImageUrl && !generationState.isGeneratingImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <X className="w-12 h-12 text-red-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-2">
                          图片生成失败
                        </h3>
                        <p className="text-text-muted max-w-md">
                          图片生成过程中出现问题，请尝试重新生成
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-text-muted">
                预览将以 {selectedAspectRatio?.ratio} 格式显示您生成的思维导图
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Generate Button */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-neutral-card border-t border-border">
          {generationState.step === 'input' && (
            <button
              onClick={handleGenerateStructure}
              disabled={generationState.isGeneratingStructure || !input.trim()}
              className="w-full bg-primary text-white px-6 py-4 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {generationState.isGeneratingStructure ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>生成结构中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>生成思维导图结构</span>
                </>
              )}
            </button>
          )}
          
          {generationState.hasStructure && !generationState.hasImage && (
            <button
              onClick={handleGenerateImage}
              disabled={generationState.isGeneratingImage}
              className="w-full bg-accent text-white px-6 py-4 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {generationState.isGeneratingImage ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>生成图片中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>生成思维导图图片</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}