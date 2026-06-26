"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { brand } from "@/lib/brand";
import { ContactHero } from "@/components/contact-us/contact-hero";
import { ContactInfo } from "@/components/contact-us/contact-info";
import { ContactPageLoading } from "@/components/contact-us/contact-page-loading";
import { FormTabs, type TabId } from "@/components/contact-us/form-tabs";

// ---------------------------------------------------------------------------
// Dynamic (lazy) imports — both forms import `country-state-city` (~300 KB),
// so we only load them when the user interacts with that tab.
// ---------------------------------------------------------------------------
const ConsultationForm = dynamic(
  () =>
    import(
      "@/components/contact-us/consultation-form"
    ).then((mod) => ({ default: mod.ConsultationForm })),
  { loading: () => <FormSkeleton /> }
);

const UniversityRequestForm = dynamic(
  () =>
    import(
      "@/components/contact-us/university-request-form"
    ).then((mod) => ({ default: mod.UniversityRequestForm })),
  { loading: () => <FormSkeleton /> }
);

// ---------------------------------------------------------------------------
// Static config — easy to add a third tab later without changing logic
// ---------------------------------------------------------------------------
const TAB_CONTENT: Record<TabId, { title: string; description: string }> = {
  consultation: {
    title: "Free Guidance Request Form",
    description:
      "All fields are securely verified. Ensure correct mobile number for OTP/Call.",
  },
  university: {
    title: "Request to Add University",
    description:
      "Can't find your desired university? Submit details and we'll add it within 24-48 hours.",
  },
};

// ---------------------------------------------------------------------------
// Skeleton shown while the dynamic form chunk loads
// ---------------------------------------------------------------------------
function FormSkeleton() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="inline-block size-6 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root layout — Hero + Info render immediately, only the tab / form section
// is wrapped in Suspense (narrow boundary).
// ---------------------------------------------------------------------------
export default function ContactUsPageWrapper() {
  return (
    <>
      <ContactHero />

      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <ContactInfo />
          </div>

          <div className="lg:col-span-3">
            <div
              className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm"
              style={{ borderColor: brand.hairline }}
            >
              <Suspense fallback={<ContactPageLoading />}>
                <ContactUsTabsSection />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Only this component uses useSearchParams → Suspense boundary is minimal
// ---------------------------------------------------------------------------
function ContactUsTabsSection() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>("consultation");

  // Set initial tab from ?subject=university-request
  useEffect(() => {
    const subject = searchParams.get("subject");
    if (subject === "university-request") {
      setActiveTab("university");
    }
  }, [searchParams]);

  const content = TAB_CONTENT[activeTab];

  return (
    <>
      <FormTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mb-6">
        <h3
          className="text-xl font-bold tracking-tight"
          style={{ color: brand.ink }}
        >
          {content.title}
        </h3>
        <p className="text-xs mt-1" style={{ color: brand.inkMuted }}>
          {content.description}
        </p>
      </div>

      {activeTab === "consultation" ? <ConsultationForm /> : <UniversityRequestForm />}
    </>
  );
}
