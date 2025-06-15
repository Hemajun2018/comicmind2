'use client';

import Image from 'next/image';

// 配置画廊图片，使用用户提供的所有图片
const images = [
  { src: '/gallery/gallery-1.png', alt: 'AI-generated comic mind map example 1' },
  { src: '/gallery/gallery-2.png', alt: 'AI-generated comic mind map example 2' },
  { src: '/gallery/gallery-3.png', alt: 'AI-generated comic mind map example 3' },
  { src: '/gallery/gallery-4.png', alt: 'AI-generated comic mind map example 4' },
  { src: '/gallery/gallery-5.png', alt: 'AI-generated comic mind map example 5' },
  { src: '/gallery/gallery-6.png', alt: 'AI-generated comic mind map example 6' },
  { src: '/gallery/VYZWWg0agg0TJEz3y7f1IIG3o6DIRa.png', alt: 'AI-generated comic mind map example 7' },
  { src: '/gallery/chayd0QW7OxfKVHN1MGc70gmyFsdWB.png', alt: 'AI-generated comic mind map example 8' },
  // The filenames below contain spaces and might cause issues.
  // Next.js can often handle this, but it's better to rename them without spaces.
  // For now, let's assume they work.
  { src: '/gallery/ChatGPT Image 2025年6月15日 10_11_01.png', alt: 'AI-generated comic mind map example 9' },
  { src: '/gallery/ChatGPT Image 2025年6月15日 10_10_15.png', alt: 'AI-generated comic mind map example 10' },
];

export function GalleryGrid() {
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

        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 lg:gap-6 space-y-4 lg:space-y-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="break-inside-avoid rounded-xl overflow-hidden group transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:z-10 relative"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 ease-in-out" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}