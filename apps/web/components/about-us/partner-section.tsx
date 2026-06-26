import React from "react";
import { brand } from "@/lib/brand";
import { partnerUniversities } from "@/lib/brand-data";
import { SectionHeader } from "@/components/about-us/section-header";
import { UniversityCard } from "@/components/about-us/university-card";

/**
 * Partner universities directory listing.
 */
export function PartnerSection() {
  return (
    <section className="py-24" style={{ background: brand.canvas }}>
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Our Directory"
          title="Partner Medical Universities"
          description="We work exclusively with legal, government-approved medical faculties offering WHO-listed courses."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partnerUniversities.map((uni, i) => (
            <UniversityCard key={uni.name} {...uni} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
