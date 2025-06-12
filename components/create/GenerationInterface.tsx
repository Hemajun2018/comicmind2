'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface GenerationState {
  isGenerating: boolean;
  hasGenerated: boolean;
  error: string | null;
}

export function GenerationInterface() {
  const [input, setInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [style, setStyle] = useState('comic');
  const [language, setLanguage] = useState('english');
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    hasGenerated: false,
    error: null,
  });

  const aspectRatioOptions = [
    { 
      value: '1:1', 
      ratio: '1:1',
      dimensions: 'w-full aspect-square',
      shapeClass: 'w-6 h-6'
    },
    { 
      value: '3:4', 
      ratio: '3:4',
      dimensions: 'w-full aspect-[3/4]',
      shapeClass: 'w-5 h-6'
    },
    { 
      value: '9:16', 
      ratio: '9:16',
      dimensions: 'w-full aspect-[9/16]',
      shapeClass: 'w-4 h-7'
    },
    { 
      value: '4:3', 
      ratio: '4:3',
      dimensions: 'w-full aspect-[4/3]',
      shapeClass: 'w-8 h-6'
    },
    { 
      value: '16:9', 
      ratio: '16:9',
      dimensions: 'w-full aspect-video',
      shapeClass: 'w-9 h-5'
    },
  ];

  const styleOptions = [
    { value: 'comic', label: 'Comic Style', description: 'Vibrant colors with speech bubbles' },
    { value: 'sketch', label: 'Hand Sketch', description: 'Pencil-drawn aesthetic' },
    { value: 'chalkboard', label: 'Chalkboard', description: 'Chalk on blackboard style' },
    { value: 'watercolor', label: 'Watercolor', description: 'Soft, flowing paint effects' },
    { value: 'doodle', label: 'Doodle', description: 'Playful hand-drawn style' },
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

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter some text to generate a mind map');
      return;
    }

    setGenerationState({
      isGenerating: true,
      hasGenerated: false,
      error: null,
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setGenerationState({
        isGenerating: false,
        hasGenerated: true,
        error: null,
      });
      
      toast.success('Mind map generated successfully!');
    } catch (error) {
      setGenerationState({
        isGenerating: false,
        hasGenerated: false,
        error: 'Failed to generate mind map. Please try again.',
      });
      
      toast.error('Generation failed. Please try again.');
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDownload = () => {
    toast.success('Mind map downloaded!');
  };

  const selectedAspectRatio = aspectRatioOptions.find(option => option.value === aspectRatio);

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
          
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
                  disabled={generationState.isGenerating}
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
                <div className="grid grid-cols-5 gap-2">
                  {aspectRatioOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAspectRatio(option.value)}
                      disabled={generationState.isGenerating}
                      className={`p-1.5 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                        aspectRatio === option.value
                          ? 'border-primary bg-primary/5 shadow-soft'
                          : 'border-border bg-neutral-bg hover:border-primary/50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        {/* Visual Shape */}
                        <div className={`${option.shapeClass} bg-gradient-to-br from-primary/20 to-accent/20 rounded border-2 ${
                          aspectRatio === option.value ? 'border-primary' : 'border-border'
                        }`}></div>
                        
                        {/* Ratio Label */}
                        <div className={`text-xs font-medium ${
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
                  disabled={generationState.isGenerating}
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
                  disabled={generationState.isGenerating}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generationState.isGenerating || !input.trim()}
                className="w-full bg-primary text-white px-6 py-4 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {generationState.isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Mind Map</span>
                  </>
                )}
              </button>

              {/* Action Buttons (when generated) */}
              {generationState.hasGenerated && (
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
                  
                  {/* Loading Overlay */}
                  {generationState.isGenerating && (
                    <div className="absolute inset-0 bg-neutral-card/90 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                        <div className="text-lg font-semibold text-text mb-2">Generating your mind map...</div>
                        <div className="text-text-muted">This may take a few seconds</div>
                        
                        {/* Progress Bar */}
                        <div className="w-64 bg-border rounded-full h-2 mt-4 mx-auto">
                          <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!generationState.hasGenerated && !generationState.isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-secondary" />
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-2">
                          Your mind map will appear here
                        </h3>
                        <p className="text-text-muted max-w-md">
                          Enter your content and click "Generate" to create a beautiful comic-style mind map
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Generated Mind Map Sample */}
                  {generationState.hasGenerated && !generationState.isGenerating && (
                    <div className="absolute inset-0 p-8">
                      {/* Sample Mind Map Visualization */}
                      <div className="relative w-full h-full">
                        {/* Central Brain Node */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center shadow-soft border-4 border-white">
                            <span className="text-2xl">🧠</span>
                          </div>
                          <div className="text-center mt-2 font-semibold text-text">Main Idea</div>
                        </div>

                        {/* Branch Nodes */}
                        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-14 h-14 bg-primary/80 rounded-full flex items-center justify-center shadow-soft border-3 border-white">
                            <span className="text-lg">💡</span>
                          </div>
                          <div className="text-sm font-medium text-text mt-1 text-center">Concept A</div>
                        </div>

                        <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                          <div className="w-14 h-14 bg-accent/80 rounded-full flex items-center justify-center shadow-soft border-3 border-white">
                            <span className="text-lg">🎯</span>
                          </div>
                          <div className="text-sm font-medium text-text mt-1 text-center">Concept B</div>
                        </div>

                        <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2">
                          <div className="w-14 h-14 bg-primary/60 rounded-full flex items-center justify-center shadow-soft border-3 border-white">
                            <span className="text-lg">🚀</span>
                          </div>
                          <div className="text-sm font-medium text-text mt-1 text-center">Concept C</div>
                        </div>

                        <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2">
                          <div className="w-14 h-14 bg-accent/60 rounded-full flex items-center justify-center shadow-soft border-3 border-white">
                            <span className="text-lg">⭐</span>
                          </div>
                          <div className="text-sm font-medium text-text mt-1 text-center">Concept D</div>
                        </div>

                        {/* Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                             refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="var(--text)" opacity="0.6" />
                            </marker>
                          </defs>
                          
                          {/* Lines from center to each node */}
                          <line x1="50%" y1="50%" x2="25%" y2="25%" 
                                stroke="var(--text)" strokeWidth="3" opacity="0.6" 
                                markerEnd="url(#arrowhead)" strokeDasharray="5,5">
                            <animate attributeName="stroke-dashoffset" values="10;0" dur="2s" repeatCount="indefinite"/>
                          </line>
                          <line x1="50%" y1="50%" x2="75%" y2="25%" 
                                stroke="var(--text)" strokeWidth="3" opacity="0.6" 
                                markerEnd="url(#arrowhead)" strokeDasharray="5,5">
                            <animate attributeName="stroke-dashoffset" values="10;0" dur="2s" repeatCount="indefinite"/>
                          </line>
                          <line x1="50%" y1="50%" x2="25%" y2="75%" 
                                stroke="var(--text)" strokeWidth="3" opacity="0.6" 
                                markerEnd="url(#arrowhead)" strokeDasharray="5,5">
                            <animate attributeName="stroke-dashoffset" values="10;0" dur="2s" repeatCount="indefinite"/>
                          </line>
                          <line x1="50%" y1="50%" x2="75%" y2="75%" 
                                stroke="var(--text)" strokeWidth="3" opacity="0.6" 
                                markerEnd="url(#arrowhead)" strokeDasharray="5,5">
                            <animate attributeName="stroke-dashoffset" values="10;0" dur="2s" repeatCount="indefinite"/>
                          </line>
                        </svg>

                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-6 h-6 bg-secondary/40 rounded-full animate-bounce"></div>
                        <div className="absolute bottom-4 left-4 w-4 h-4 bg-primary/40 rounded-full animate-bounce delay-300"></div>
                        <div className="absolute top-4 left-4 w-5 h-5 bg-accent/40 rounded-full animate-bounce delay-500"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Info */}
              <div className="text-sm text-text-muted">
                Preview will show your generated mind map in {selectedAspectRatio?.ratio} format
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Generate Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-neutral-card border-t border-border">
        <button
          onClick={handleGenerate}
          disabled={generationState.isGenerating || !input.trim()}
          className="w-full bg-primary text-white px-6 py-4 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {generationState.isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Mind Map</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}