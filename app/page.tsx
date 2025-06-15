import { HeroSection } from '@/components/home/HeroSection';
import { FeatureCards } from '@/components/home/FeatureCards';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import { GalleryGrid } from '@/components/home/GalleryGrid';
import { PricingPreview } from '@/components/home/PricingPreview';
import { FAQ } from '@/components/home/FAQ';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <GalleryGrid />
      <section id="features" className="py-20 bg-neutral-card">
        <FeatureCards />
      </section>
      <ProcessTimeline />
      <PricingPreview />
      <FAQ />
    </main>
  );
}