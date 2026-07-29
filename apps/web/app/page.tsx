import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Shiksha International | MBBS Abroad Admissions 2026",
  description:
    "Shiksha International — your trusted global education ally. MBBS admissions in Kyrgyzstan, Uzbekistan, Kazakhstan & Russia. Official university collaborations, free FMGE/NEXT coaching, and transparent admissions.",
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

function decodeToken(token: string): { role?: string } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default async function Home() {
  // Redirect logged-in PARENT/ADMIN away from landing page
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (token) {
    const payload = decodeToken(token);
    const role = payload?.role?.toLowerCase();
    if (role && role !== "student") {
      const dest =
        role === "admin" || role === "super_admin"
          ? "/admin/dashboard"
          : "/parents/dashboard";
      redirect(dest);
    }
  }

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
      <main className="mx-auto">
        <UniversityCards />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <Features />
        <UniversityComparison />
        {/* <UniversityAdvantages /> */}
        {/* <WhyTrustUs /> */}
        {/* <AudienceSection /> */}
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
