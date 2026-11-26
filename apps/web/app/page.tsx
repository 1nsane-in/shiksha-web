import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shiksha International | MBBS Abroad Admissions 2026",
  description:
    "Shiksha International — your trusted global education ally. MBBS admissions in Kyrgyzstan, Uzbekistan, Kazakhstan & Russia. Official university collaborations, free FMGE/NEXT coaching, and transparent admissions.",
};

// Critical above-the-fold components - load immediately
import { Header } from "@/components/landing/home/Header";
import { TopBar } from "@/components/landing/home/TopBar";
import { HeroCarousel } from "@/components/landing/home/HeroCarousel";
import { CountrySection } from "@/components/landing/home/CountrySection";

// Static below-the-fold sections - server components, zero client JS
import { TrustBar } from "@/components/landing/home/TrustBar";
import { ProblemSection } from "@/components/landing/home/ProblemSection";
import { SolutionSection } from "@/components/landing/home/SolutionSection";
import { HowItWorks } from "@/components/landing/home/HowItWorks";
import { UniversityComparison } from "@/components/landing/home/UniversityComparison";
import { Footer } from "@/components/landing/home/Footer";
import { ScrollToTop } from "@/components/landing/home/ScrollToTop";
import {
  WhyShikshaSection,
  ScholarshipsSection,
  StudentStoriesSection,
} from "@/components/landing/home/AdditionalSections";

// Interactive below-the-fold components - lazy loaded via client component
import { LazySections, LazyFinalCTA } from "@/components/landing/home/LazySections";

// Home renders no request-dependent data (the admin/parent redirect lives in
// proxy.ts), so prerender it: no Suspense fallback, no server round-trip.
export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <HeroCarousel />
      <CountrySection />
      {/* Below the fold: static sections are server-rendered (zero JS),
          interactive ones lazy load */}
      <main className="mx-auto">
        <LazySections />
        <WhyShikshaSection />
        <ScholarshipsSection />
        <StudentStoriesSection />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <UniversityComparison />
        <LazyFinalCTA />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
