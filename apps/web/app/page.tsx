import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shiksha | Medical Admission Platform",
  description:
    "Your gateway to medical education abroad. Apply to top medical universities worldwide with guided admission support.",
};

import { Header } from "@/components/landing/Header";
import { HeroCarousel } from "@/components/landing/HeroCarousel";
import { TrustBar } from "@/components/landing/TrustBar";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { WhyTrustUs } from "@/components/landing/WhyTrustUs";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { UniversityHero } from "@/components/landing/UniversityHero";
import { UniversityOverview } from "@/components/landing/UniversityOverview";
import { UniversityComparison } from "@/components/landing/UniversityComparison";
import { UniversityAdvantages } from "@/components/landing/UniversityAdvantages";
import { UniversityCards } from "@/components/landing/UniversityCards";
import { UniversityProcess } from "@/components/landing/UniversityProcess";
import { UniversityCareer } from "@/components/landing/UniversityCareer";
import { EligibilityCalculator } from "@/components/landing/EligibilityCalculator";

export default function Home() {
  return (
    <>
      {/* Full-screen hero with overlaid header */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-20">
          <Header />
        </div>
        <HeroCarousel />
      </div>
      {/* Rest of the page */}
      <main className=" max-w-6xl mx-auto">
        <EligibilityCalculator />
        <UniversityCards />
        <UniversityComparison />
        <UniversityAdvantages />
        <WhyTrustUs />
      </main>
      <Footer />
    </>
  );
}
