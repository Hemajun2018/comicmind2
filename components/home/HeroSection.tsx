import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-neutral-bg to-neutral-card">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-text leading-tight mb-4">
              <div>
                Transform your{' '}
                <span className="text-primary">ideas</span>
              </div>
              <div>
                into{' '}
                <span className="text-accent">comic</span>{' '}
                <span className="text-accent">mind-maps</span>
              </div>
            </h1>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-text leading-relaxed mb-6">
        
            </h2>
            
            <div className="space-y-3 mb-8">
              <p className="text-lg sm:text-xl text-text-muted leading-relaxed">
               The world's first comic mind map generator.
              </p>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/create"
                className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover-darken active-darken transition-colors-smooth shadow-soft"
              >
                Try for free 
              </Link>
              <Link
                href="#gallery"
                className="border-2 border-accent text-accent px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent hover:text-white transition-colors-smooth"
              >
                View examples 
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-semibold text-text">50K+</div>
                <div className="text-xs sm:text-sm text-text-muted">Mind maps created</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-semibold text-text">8</div>
                <div className="text-xs sm:text-sm text-text-muted">Languages supported</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-semibold text-text">5</div>
                <div className="text-xs sm:text-sm text-text-muted">Art styles</div>
              </div>
            </div>
          </div>

          {/* Right illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <Image 
                src="/hero-image1.png"
                alt="ComicMind AI"
                width={600}
                height={450}
                className="w-full h-auto rounded-xl shadow-soft"
                priority
              />
              
              {/* Floating elements */}
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