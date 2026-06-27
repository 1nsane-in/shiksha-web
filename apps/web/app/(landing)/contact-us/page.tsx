"use client";

import React, { Suspense } from "react";
import { brand } from "@/lib/brand";
import { ContactHero } from "@/components/landing/contact-us/contact-hero";
import { ContactInfo } from "@/components/landing/contact-us/contact-info";
import { ContactPageLoading } from "@/components/landing/contact-us/contact-page-loading";
import { ContactUsTabsSection } from "@/components/landing/contact-us/contact-us-tabs-section";

/**
 * Contact-us page with hero, contact info sidebar, and tabbed forms.
 *
 * Hero and Info render immediately (no Suspense needed).
 * Only the tab section is wrapped in Suspense because it uses
 * useSearchParams (has a CSR bailout in Next.js).
 */
export default function ContactUsPage() {
  return (
    <>
      <ContactHero />

      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Contact info sidebar */}
          <div className="lg:col-span-2">
            <ContactInfo />
          </div>

          {/* Tabbed forms */}
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
