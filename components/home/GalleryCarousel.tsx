'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function GalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Sample gallery images (these would be real mind map examples)
  const examples = [
    {
      id: 1,
      title: 'Business Strategy',
      style: 'Doodle Style',
      image: 'https://images.pexels.com/photos/3183170/pexels-photo-3183170.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Strategic planning mind map with hand-drawn elements'
    },
    {
      id: 2,
      title: 'Learning Path',
      style: 'Cartoon Style',
      image: 'https://images.pexels.com/photos/5428833/pexels-photo-5428833.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Educational content visualization with playful characters'
    },
    {
      id: 3,
      title: 'Project Timeline',
      style: 'Chalk Style',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Project management made fun with chalk-board aesthetics'
    },
    {
      id: 4,
      title: 'Creative Ideas',
      style: 'Healing Style',
      image: 'https://images.pexels.com/photos/3183167/pexels-photo-3183167.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Brainstorming session with soothing, organic designs'
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
  };

  return (
    <section className="py-20 bg-neutral-card">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text mb-4">
            Mind maps that inspire
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            See how others are using ComicMind to transform their ideas into engaging visual stories.
          </p>
        </div>

        <div className="relative">
          {/* Main carousel */}
          <div className="overflow-hidden rounded-xl shadow-soft">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {examples.map((example) => (
                <div key={example.id} className="w-full flex-shrink-0">
                  <div className="relative h-96 bg-gradient-to-br from-primary/10 to-accent/10">
                    {/* Placeholder for mind map visualization */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-3xl">🧠</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-text mb-2">
                          {example.title}
                        </h3>
                        <p className="text-accent font-medium">
                          {example.style}
                        </p>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-8 left-8 w-16 h-16 bg-primary/20 rounded-full"></div>
                    <div className="absolute top-16 right-12 w-12 h-12 bg-accent/20 rounded-full"></div>
                    <div className="absolute bottom-12 left-16 w-8 h-8 bg-secondary/20 rounded-full"></div>
                    <div className="absolute bottom-8 right-8 w-20 h-20 bg-primary/20 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-neutral-card shadow-soft rounded-full p-3 hover:bg-neutral-bg transition-colors-smooth"
          >
            <ChevronLeft className="w-6 h-6 text-text" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-neutral-card shadow-soft rounded-full p-3 hover:bg-neutral-bg transition-colors-smooth"
          >
            <ChevronRight className="w-6 h-6 text-text" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {examples.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors-smooth ${
                  index === currentIndex ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Gallery description */}
        <div className="text-center mt-8">
          <p className="text-text-muted">
            {examples[currentIndex].description}
          </p>
        </div>
      </div>
    </section>
  );
}