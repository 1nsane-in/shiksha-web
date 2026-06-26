"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { brand } from "@/lib/brand";
import { FormTabs, type TabId } from "@/components/contact-us/form-tabs";
import {
  LazyConsultationForm,
  LazyUniversityRequestForm,
} from "@/components/contact-us/form-loader";

// ---------------------------------------------------------------------------
// Tab content config — mapping each tab to its title and description.
// Adding a new tab only requires adding an entry here + a FormTabs item.
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

/**
 * Tabbed section for the contact-us page.
 * Isolated here so only this component needs useSearchParams,
 * keeping the Suspense boundary narrow.
 */
export function ContactUsTabsSection() {
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

      {activeTab === "consultation" ? (
        <LazyConsultationForm />
      ) : (
        <LazyUniversityRequestForm />
      )}
    </>
  );
}
