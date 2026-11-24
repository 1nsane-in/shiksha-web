import type { Metadata } from "next";
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
import { admissionYear } from "@/lib/brand";

/* ─── Metadata ─── */

export function generateMetadata(): Metadata {
  return {
    title: "About Shiksha International | MBBS Abroad Admissions",
    description:
      "Shiksha International helps Indian students apply to medical universities in Kyrgyzstan, Uzbekistan, Kazakhstan and Russia. Read the director's letter, partner register and country comparison.",
    openGraph: {
      title: "About Shiksha International",
      description: `Director's letter, partner university register and country comparison for the ${admissionYear()} intake.`,
    },
  };
}

/* ─── Main Page (pure composition) ─── */

export default function AboutUsPage() {
  return (
    <>
      <DirectorSection />
      <StorySection />
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
