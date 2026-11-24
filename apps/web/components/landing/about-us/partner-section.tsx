"use client";

import React, { useMemo, useState } from "react";
import { partnerUniversities } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";
import { CountryStamp } from "@/components/landing/about-us/country-stamp";
import { UniversityRow } from "@/components/landing/about-us/university-row";

const countries = ["All", "Kyrgyzstan", "Uzbekistan", "Kazakhstan", "Russia"] as const;
type Country = (typeof countries)[number];

/**
 * Filterable university register. The register is the main moment on the page:
 * real crests, one row per file, native details for the full record.
 */
export function PartnerSection() {
  const [activeCountry, setActiveCountry] = useState<Country>("All");

  const filteredUniversities = useMemo(() => {
    if (activeCountry === "All") return partnerUniversities;
    return partnerUniversities.filter((uni) => uni.country === activeCountry);
  }, [activeCountry]);

  return (
    <section
      id="partner-register"
      className="scroll-mt-32 border-b border-brand-hairline bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="University register"
          title={`${partnerUniversities.length} partner universities across four countries`}
          description="Filter by country, then open a file for tuition, approvals and the details we check before an application"
        />

        <div
          role="group"
          aria-label="Filter universities by country"
          className="flex flex-wrap gap-2"
        >
          {countries.map((country) => {
            const isActive = activeCountry === country;
            return (
              <button
                key={country}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCountry(country)}
                className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/30 focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-brand-ink bg-brand-ink text-white"
                    : "border-brand-hairline bg-white text-brand-ink hover:border-brand-ink/30"
                }`}
              >
                {country !== "All" && (
                  <CountryStamp country={country} dark={isActive} />
                )}
                {country}
              </button>
            );
          })}
        </div>

        <p
          aria-live="polite"
          className="mt-5 text-sm text-brand-ink-muted"
        >
          {activeCountry === "All"
            ? `Showing all ${partnerUniversities.length} universities`
            : `Showing ${filteredUniversities.length} universities in ${activeCountry}`}
        </p>

        <div className="mt-8 hidden grid-cols-[32px_minmax(0,1fr)_150px_170px] gap-4 border-y border-brand-hairline px-3 py-2 text-xs text-brand-ink-muted md:grid">
          <span>No.</span>
          <span>University</span>
          <span className="text-right">Tuition</span>
          <span>Approvals</span>
        </div>

        <div>
          {filteredUniversities.map((uni, index) => (
            <UniversityRow key={uni.name} {...uni} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
