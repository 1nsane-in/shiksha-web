import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shiksha | Medical Admission Platform",
  description:
    "Your gateway to medical education abroad. Apply to top medical universities worldwide with guided admission support.",
};

import { Header } from "@/components/landing/home/Header";
import { HeroCarousel } from "@/components/landing/home/HeroCarousel";
import { TrustBar } from "@/components/landing/home/TrustBar";
import { ProblemSection } from "@/components/landing/home/ProblemSection";
import { SolutionSection } from "@/components/landing/home/SolutionSection";
import { HowItWorks } from "@/components/landing/home/HowItWorks";
import { Features } from "@/components/landing/home/Features";
import { WhyTrustUs } from "@/components/landing/home/WhyTrustUs";
import { AudienceSection } from "@/components/landing/home/AudienceSection";
import { FinalCTA } from "@/components/landing/home/FinalCTA";
import { Footer } from "@/components/landing/home/Footer";
import { EligibilityCalculator } from "@/components/landing/home/EligibilityCalculator";
import { UniversityHero } from "@/components/landing/home/UniversityHero";
import { UniversityOverview } from "@/components/landing/home/UniversityOverview";
import { UniversityComparison } from "@/components/landing/home/UniversityComparison";
import { UniversityAdvantages } from "@/components/landing/home/UniversityAdvantages";
import { UniversityCards } from "@/components/landing/home/UniversityCards";
import { UniversityProcess } from "@/components/landing/home/UniversityProcess";
import { UniversityCareer } from "@/components/landing/home/UniversityCareer";

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
        {/* <EligibilityCalculator /> */}
        <UniversityCards />
        {/* <UniversityComparison />
        <UniversityAdvantages />
        <WhyTrustUs /> */}
      </main>
      <Footer />
    </>
  );
}
