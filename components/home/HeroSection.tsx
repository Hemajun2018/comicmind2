import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-neutral-bg to-neutral-card">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-text leading-tight mb-6">
              Turn text into{' '}
              <span className="text-primary">comic</span>{' '}
              mind-maps in{' '}
              <span className="text-accent">seconds</span>
            </h1>
            
            <p className="text-xl text-text-muted mb-8 leading-relaxed">
              No login. Free 3 images a day. Transform your ideas into beautiful, 
              hand-drawn style mind maps with AI magic.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/create"
                className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft"
              >
                Try it now
              </Link>
              <Link
                href="/examples"
                className="border-2 border-accent text-accent px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent hover:text-white transition-colors-smooth"
              >
                View examples
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-semibold text-text">50K+</div>
                <div className="text-sm text-text-muted">Mind maps created</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-semibold text-text">8</div>
                <div className="text-sm text-text-muted">Languages supported</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-semibold text-text">12</div>
                <div className="text-sm text-text-muted">Art styles</div>
              </div>
            </div>
          </div>

          {/* Right illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* 替换为您自己的图片 - 请将 "your-image.png" 替换为您的实际图片文件名 */}
              <Image 
                src="/hero-image1.png"  // 请替换为您的图片路径
                alt="ComicMind Hero Image"
                width={400}  // 根据您的图片调整宽度
                height={300} // 根据您的图片调整高度
                className="w-full max-w-mg lg:max-w-xl rounded-xl shadow-soft"
                priority // 优先加载主要图片
              />
              
              {/* Floating elements - 保持装饰性动画元素 */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent rounded-full opacity-60 animate-bounce delay-300"></div>
              <div className="absolute top-1/4 -right-6 w-4 h-4 bg-primary rounded-full opacity-60 animate-bounce delay-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}