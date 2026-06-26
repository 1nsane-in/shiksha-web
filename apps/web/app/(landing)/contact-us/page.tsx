"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Building2 } from "lucide-react";
import { brand } from "@/lib/brand";
import { ContactHero } from "@/components/contact-us/contact-hero";
import { ContactInfo } from "@/components/contact-us/contact-info";
import { ContactPageLoading } from "@/components/contact-us/contact-page-loading";
import { ConsultationForm } from "@/components/contact-us/consultation-form";
import { UniversityRequestForm } from "@/components/contact-us/university-request-form";

/** Wrapped in Suspense to use useSearchParams safely. */
export default function ContactUsPageWrapper() {
  return (
    <Suspense fallback={<ContactPageLoading />}>
      <ContactUsPage />
    </Suspense>
  );
}

function ContactUsPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"consultation" | "university">(
    "consultation"
  );

  // Set active tab based on ?subject=university-request query param
  useEffect(() => {
    const subject = searchParams.get("subject");
    if (subject === "university-request") {
      setActiveTab("university");
    }
  }, [searchParams]);

  return (
    <>
      <ContactHero />

      {/* Form and Info Section */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left: Contact Info (2/5 size) */}
          <div className="lg:col-span-2">
            <ContactInfo />
          </div>

          {/* Right: Forms (3/5 size) */}
          <div className="lg:col-span-3">
            <div
              className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm"
              style={{ borderColor: brand.hairline }}
            >
              {/* Tab Switcher */}
              <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab("consultation")}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === "consultation"
                      ? "bg-white text-[#1A153A] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    Free Consultation
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("university")}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === "university"
                      ? "bg-white text-[#1A153A] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Request University
                  </span>
                </button>
              </div>

              {activeTab === "consultation" ? (
                <>
                  <div className="mb-6">
                    <h3
                      className="text-xl font-bold tracking-tight"
                      style={{ color: brand.ink }}
                    >
                      Free Guidance Request Form
                    </h3>
                    <p className="text-xs mt-1" style={{ color: brand.inkMuted }}>
                      All fields are securely verified. Ensure correct mobile
                      number for OTP/Call.
                    </p>
                  </div>
                  <ConsultationForm />
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <h3
                      className="text-xl font-bold tracking-tight"
                      style={{ color: brand.ink }}
                    >
                      Request to Add University
                    </h3>
                    <p className="text-xs mt-1" style={{ color: brand.inkMuted }}>
                      Can&apos;t find your desired university? Submit details
                      and we&apos;ll add it within 24-48 hours.
                    </p>
                  </div>
                  <UniversityRequestForm />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
