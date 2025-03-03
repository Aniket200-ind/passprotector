//! src/app/page.tsx

import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroSection from "@/components/layout/HeroSection";
import Footer from "@/components/layout/Footer";
import { InViewSection } from "@/components/InViewSection";

//* Lazy load components
const WhyUseSection = React.lazy(
  () => import("@/components/layout/EducationSection")
);
const HowItWorks = React.lazy(() => import("@/components/layout/HowItWorks"));
const FeaturesShowcase = React.lazy(
  () => import("@/components/layout/FeatureSection")
);
const PasswordStrengthChecker = React.lazy(
  () => import("@/components/layout/PasswordStrengthChecker")
);
const SecurityTerminal = React.lazy(
  () => import("@/components/layout/SecurityTerminalSection")
);

//* Simple skeleton components
const SectionSkeleton = () => (
  <div className="w-full py-16">
    <div className="container px-4 md:px-6">
      <Skeleton className="h-8 w-1/2 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  </div>
);

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center bg-background text-foreground mt-10">
      {/* Always render immediately */}
      <HeroSection />

      {/* Double-optimized sections using both lazy loading and conditional rendering */}
      <InViewSection
        rootMargin="200px"
        fallback={<SectionSkeleton />}
        className="w-full"
      >
        <Suspense fallback={<SectionSkeleton />}>
          <WhyUseSection />
        </Suspense>
      </InViewSection>

      <InViewSection
        rootMargin="200px"
        fallback={<SectionSkeleton />}
        className="w-full"
      >
        <Suspense fallback={<SectionSkeleton />}>
          <HowItWorks />
        </Suspense>
      </InViewSection>

      <InViewSection
        rootMargin="200px"
        fallback={<SectionSkeleton />}
        className="w-full"
      >
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturesShowcase />
        </Suspense>
      </InViewSection>

      <InViewSection
        rootMargin="200px"
        fallback={<SectionSkeleton />}
        className="w-full"
      >
        <Suspense fallback={<SectionSkeleton />}>
          <PasswordStrengthChecker />
        </Suspense>
      </InViewSection>

      <InViewSection
        rootMargin="200px"
        fallback={<SectionSkeleton />}
        className="w-full"
      >
        <Suspense fallback={<SectionSkeleton />}>
          <SecurityTerminal />
        </Suspense>
      </InViewSection>

      <Footer />
    </main>
  );
}
