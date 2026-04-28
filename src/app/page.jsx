import { HeroSection } from "@/components/landing/HeroSection";
import { LogosSection } from "@/components/landing/LogosSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { RolesSection } from "@/components/landing/RolesSection";
import { PricingCTASection } from "@/components/landing/PricingCTASection";

export default function LandingPage() {
  return (
    <div className="bg-black overflow-x-hidden">
      <HeroSection />
      <LogosSection />
      <FeaturesSection />
      <RolesSection />
      <PricingCTASection />
    </div>
  );
}
