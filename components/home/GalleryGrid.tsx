'use client';

import Image from 'next/image';

// 配置画廊图片，按照数字顺序排列（1.png到12.png）
const images = [
  { src: '/gallery/1.png', alt: 'ComicMind思维导图示例 1' },
  { src: '/gallery/2.png', alt: 'ComicMind思维导图示例 2' },
  { src: '/gallery/3.png', alt: 'ComicMind思维导图示例 3' },
  { src: '/gallery/4.png', alt: 'ComicMind思维导图示例 4' },
  { src: '/gallery/5.png', alt: 'ComicMind思维导图示例 5' },
  { src: '/gallery/6.png', alt: 'ComicMind思维导图示例 6' },
  { src: '/gallery/7.png', alt: 'ComicMind思维导图示例 7' },
  { src: '/gallery/8.png', alt: 'ComicMind思维导图示例 8' },
  { src: '/gallery/9.png', alt: 'ComicMind思维导图示例 9' },
  { src: '/gallery/10.png', alt: 'ComicMind思维导图示例 10' },
  { src: '/gallery/11.png', alt: 'ComicMind思维导图示例 11' },
  { src: '/gallery/12.png', alt: 'ComicMind思维导图示例 12' },
];

export function GalleryGrid() {
  return (
    <section id="gallery" className="py-16 sm:py-20 bg-gradient-to-br from-neutral-bg to-neutral-card">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text mb-4">
            Mind maps that inspire
          </h2>
          <h3 className="text-xl sm:text-2xl text-text mb-4">
          </h3>
          <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto">
            See how others are using ComicMind to transform their ideas into engaging visual stories.
          </p>
        </div>

        {/* 响应式网格布局：移动端1列，平板2列，桌面端3列，大屏4列 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-neutral-bg shadow-soft hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="aspect-[3/4.2] relative">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 ease-in-out" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}