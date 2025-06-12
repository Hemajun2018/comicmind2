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
  const [language, setLanguage] = useState('english');
  const [style, setStyle] = useState('kawaii');
  const [aspectRatio, setAspectRatio] = useState('4:3');

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

      toast.error('Structure generation failed, please try again');
    }
  };

  // 第二阶段：生成思维导图图片
  const handleGenerateImage = async () => {
    if (!editableStructure.trim()) {
      toast.error('Please generate or edit mind map structure first');
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
        throw new Error(data.error || 'Image generation failed');
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

      toast.success('Mind map image generated successfully!');
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

      toast.error('Image generation failed, please try again');
    }
  };

  const handleCloseModal = () => {
    setShowStructureModal(false);
    // Discard changes when closing modal
    setEditableStructure(generatedStructure);
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

  const handleDownload = () => {
    if (generatedImageUrl) {
      const link = document.createElement('a');
      link.href = generatedImageUrl;
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



              {/* Aspect Ratio - Visual Selection */}
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
                <div className="text-sm text-text-muted">
                  {styleOptions.find(s => s.value === style)?.description}
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-text">
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

              {/* Action Buttons (when image generated) */}
              {generationState.hasImage && (
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={handleRegenerate}
                      className="flex-1 border-2 border-accent text-accent px-4 py-3 rounded-xl font-medium hover:bg-accent hover:text-white transition-colors-smooth flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Regenerate</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-secondary text-text px-4 py-3 rounded-xl font-medium hover-darken transition-colors-smooth flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                  <button
                    onClick={handleStartOver}
                    className="w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft"
                  >
                    Create New
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview Canvas */}
          <div className="bg-neutral-card rounded-xl p-6 shadow-soft">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-text">Preview</h2>
              
              {/* Preview Container */}
              <div className="relative">
                <div className={`${selectedAspectRatio?.dimensions} bg-neutral-bg border-2 border-dashed border-border rounded-xl overflow-hidden relative`}>
                  
                  {/* Loading Overlay - Structure Generation */}
                  {generationState.isGeneratingStructure && (
                    <div className="absolute inset-0 bg-neutral-card/90 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                        <div className="text-lg font-semibold text-text mb-2">Generating mind map structure...</div>
                        <div className="text-text-muted">AI is analyzing your content and creating structured outline</div>
                        
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
                        <div className="text-lg font-semibold text-text mb-2">Generating mind map image...</div>
                        <div className="text-text-muted">AI is converting structure into comic-style mind map</div>
                        
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
                          Your mind map will appear here
                        </h3>
                        <p className="text-text-muted max-w-md">
                          Enter content and click "Generate Mind Map Structure" to start creating beautiful comic-style mind maps
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
                          Structure generation complete!
                        </h3>
                        <p className="text-text-muted max-w-md">
                          Mind map structure has been generated. Please confirm the content on the left and click "Generate Mind Map Image" button
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
                          toast.error('Image loading failed');
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
                          Image generation failed
                        </h3>
                        <p className="text-text-muted max-w-md">
                          There was a problem during image generation, please try regenerating
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-text-muted">
                Preview will display your generated mind map in {selectedAspectRatio?.ratio} format
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
          
          {generationState.hasStructure && !generationState.hasImage && (
            <button
              onClick={handleGenerateImage}
              disabled={generationState.isGeneratingImage}
              className="w-full bg-accent text-white px-6 py-4 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
        </div>

        {/* Structure Review Modal */}
        {showStructureModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              {/* Modal Header */}
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

              {/* Modal Content */}
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

              {/* Modal Footer */}
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