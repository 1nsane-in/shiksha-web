import type { Metadata } from "next";
import { HeroSection } from "@/components/about-us/hero-section";
import { StorySection } from "@/components/about-us/story-section";
import { WhyWciecSection } from "@/components/about-us/why-wciec-section";
import { PartnerSection } from "@/components/about-us/partner-section";
import { FoundationSection } from "@/components/about-us/foundation-section";
import { ServicesSection } from "@/components/about-us/services-section";
import { CtaSection } from "@/components/about-us/cta-section";

/* ─── Metadata ─── */

export const metadata: Metadata = {
  title: "About Us | Shiksha Global — Trusted Medical Education Abroad",
  description:
    "WCIEC guides ambitious students to prestigious medical universities worldwide with absolute transparency, legal compliance, and personalized mentorship since 2010.",
  openGraph: {
    title: "About Shiksha Global | Medical Education Consultants",
    description:
      "12,000+ successful admissions. 100% legal & verified path to medical universities abroad.",
  },
};

/* ─── Main Page (pure composition) ─── */

export default function AboutUsPage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <WhyWciecSection />
      <PartnerSection />
      <FoundationSection />
      <ServicesSection />
      <CtaSection />
    </>
  );
}
