//! src/app/page.tsx

import WhyUseSection from "@/components/layout/EducationSection";
import FeaturesShowcase from "@/components/layout/FeatureSection";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/layout/HeroSection";
import HowItWorks from "@/components/layout/HowItWorks";
import PasswordStrengthChecker from "@/components/layout/PasswordStrengthChecker";
import SecurityTerminal from "@/components/layout/SecurityTerminalSection";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center bg-background text-foreground mt-10">
      <HeroSection />
      <WhyUseSection />
      <HowItWorks />
      <FeaturesShowcase />
      <PasswordStrengthChecker />
      <SecurityTerminal />
      <Footer />
    </main>
  );
}
