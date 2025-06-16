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
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20 hover:border-primary/40 transition-colors-smooth">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-text text-sm">No login required</div>
                    <div className="text-xs text-text-muted">Start instantly</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20 hover:border-accent/40 transition-colors-smooth">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-text text-sm">Free trial</div>
                    <div className="text-xs text-text-muted">3 maps daily</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4 border border-secondary/20 hover:border-secondary/40 transition-colors-smooth">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-text text-sm">Multiple art styles</div>
                    <div className="text-xs text-text-muted">5 unique styles</div>
                  </div>
                </div>
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