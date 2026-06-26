import React from "react";
import { brand } from "@/lib/brand";
import { whyWciecItems } from "@/lib/brand-data";
import { SectionHeader } from "@/components/about-us/section-header";
import { WhyWciecCard } from "@/components/about-us/why-wciec-card";

/**
 * "Why WCIEC" — Feature grid displaying accommodation, scholarships,
 * coaching, and visa support.
 */
export function WhyWciecSection() {
  return (
    <section
      className="py-24 bg-white border-b"
      style={{ borderColor: brand.hairline }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Why WCIEC"
          title="Comprehensive Ground Support"
          description="Counselling is only step one. We maintain permanent on-ground offices near partner universities to secure your housing, meals, and safety daily."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {whyWciecItems.map((item) => (
            <WhyWciecCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
