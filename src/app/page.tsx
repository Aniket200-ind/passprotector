//! src/app/page.tsx

import WhyUseSection from "@/components/layout/EducationSection";
import FeaturesShowcase from "@/components/layout/FeatureSection";
import HeroSection from "@/components/layout/HeroSection";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center bg-background text-foreground mt-6">
      <HeroSection />
      <WhyUseSection />
      <FeaturesShowcase />
    </main>
  );
}
