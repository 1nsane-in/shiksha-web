import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/about-us/hero-section";
import { StorySection } from "@/components/landing/about-us/story-section";
import { DirectorSection } from "@/components/landing/about-us/director-section";
import { WhyMBBSAbroadSection } from "@/components/landing/about-us/why-mbbs-abroad-section";
import { WhyWciecSection } from "@/components/landing/about-us/why-wciec-section";
import { PartnerSection } from "@/components/landing/about-us/partner-section";
import { CountryComparisonSection } from "@/components/landing/about-us/country-comparison-section";
import { Admissions2026Section } from "@/components/landing/about-us/admissions-2026-section";
import { FoundationSection } from "@/components/landing/about-us/foundation-section";
import { ServicesSection } from "@/components/landing/about-us/services-section";
import { OTCSection } from "@/components/landing/about-us/otc-section";
import { FAQSection } from "@/components/landing/about-us/faq-section";
import { CtaSection } from "@/components/landing/about-us/cta-section";

/* ─── Metadata ─── */

export const metadata: Metadata = {
  title: "About Us | Shiksha International — MBBS Abroad Admissions",
  description:
    "Shiksha International guides ambitious students to prestigious medical universities in Kyrgyzstan, Uzbekistan, Kazakhstan & Russia with transparency, legal compliance, and personalized support.",
  openGraph: {
    title: "About Shiksha International | Medical Education Consultants",
    description:
      "Official university collaborations. Transparent admissions. Free FMGE/NEXT coaching. Admissions open for 2026.",
  },
};

/* ─── Main Page (pure composition) ─── */

export default function AboutUsPage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <DirectorSection />
      <WhyMBBSAbroadSection />
      <WhyWciecSection />
      <PartnerSection />
      <CountryComparisonSection />
      <Admissions2026Section />
      <FoundationSection />
      <ServicesSection />
      <OTCSection />
      <FAQSection />
      <CtaSection />
    </>
  );
}
