import PricingSection from "@/components/PricingSection";
import { StarsBackgroundDemo } from "@/components/demo-components-backgrounds-stars";
import { GoldTitle, GrayTitle, SectionHeading, SectionLabel } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PricingCTASection() {
  return (
    <>
      <section className="relative z-10 pb-28 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>Pricing</SectionLabel>
          <SectionHeading
            gray="Simple, transparent"
            gold="credit-based plans"
          />
          <p className="text-stone-400 mt-3 text-sm">
            Each credit = one session. Unused credits roll over.
          </p>
        </div>

        <PricingSection />
      </section>

      <section className="relative z-10 pb-28 max-w-5xl mx-auto px-6">
        <div className="relative border border-amber-400/20 rounded-3xl px-3 sm:px-16 py-20 bg-linear-to-br from-amber-400/5 text-center overflow-hidden">
          <StarsBackgroundDemo />

          <h2 className="font-serif relative text-4xl md:text-5xl leading-tight tracking-tight mb-4">
            <GrayTitle>Your next interview</GrayTitle>
            <br />
            <GoldTitle>starts here</GoldTitle>
          </h2>

          <p className="relative text-stone-400 font-light text-sm mb-11">
            Join thousands of engineers already levelling up on Prept.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/onboarding" className="relative">
              <Button variant="gold" size="hero">
                Get started
              </Button>
            </Link>

            <Link href="/explore" className="relative">
              <Button variant="outline" size="hero">
                Browse Interviewers →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
