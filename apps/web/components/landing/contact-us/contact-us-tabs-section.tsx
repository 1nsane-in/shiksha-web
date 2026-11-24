"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { brand } from "@/lib/brand";
import { FormTabs, type TabId } from "@/components/landing/contact-us/form-tabs";
import {
  LazyConsultationForm,
  LazyUniversityRequestForm,
} from "@/components/landing/contact-us/form-loader";

// ---------------------------------------------------------------------------
// Tab content config — mapping each tab to its title and description.
// Adding a new tab only requires adding an entry here + a FormTabs item.
// ---------------------------------------------------------------------------
const TAB_CONTENT: Record<TabId, { title: string; description: string }> = {
  consultation: {
    title: "Free guidance request",
    description: "Use a mobile number we can reach you on.",
  },
  university: {
    title: "Request a university",
    description:
      "Can't find your university? Send the details and we will review it within 24-48 hours.",
  },
};

/**
 * Tabbed section for the contact-us page.
 * Isolated here so only this component needs useSearchParams,
 * keeping the Suspense boundary narrow.
 */
export function ContactUsTabsSection() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>(
    searchParams.get("subject") === "university-request"
      ? "university"
      : "consultation"
  );

  const content = TAB_CONTENT[activeTab];

  return (
    <>
      <FormTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mb-6">
        <h3
          className="text-lg font-medium tracking-[-0.01em]"
          style={{ color: brand.ink }}
        >
          {content.title}
        </h3>
        <p className="mt-2 text-sm" style={{ color: brand.inkMuted }}>
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
