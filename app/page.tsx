import { HeroSection } from '@/components/home/HeroSection';
import { FeatureCards } from '@/components/home/FeatureCards';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import { GalleryCarousel } from '@/components/home/GalleryCarousel';
import { PricingPreview } from '@/components/home/PricingPreview';
import { FAQ } from '@/components/home/FAQ';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <ProcessTimeline />
      <GalleryCarousel />
      <PricingPreview />
      <FAQ />
    </>
  );
}