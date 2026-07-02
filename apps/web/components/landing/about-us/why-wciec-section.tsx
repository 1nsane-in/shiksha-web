import React from "react";
import { brand } from "@/lib/brand";
import { whyShikshaItems } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";
import { WhyWciecCard } from "@/components/landing/about-us/why-wciec-card";

/**
 * "Why Shiksha" — Feature grid displaying official collaborations,
 * visa support, coaching, and on-ground assistance.
 */
export function WhyWciecSection() {
  return (
    <section
      className="py-24 bg-white border-b"
      style={{ borderColor: brand.hairline }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Why Shiksha"
          title="Complete Admission & Student Support"
          description="From application to graduation — we provide official university partnerships, transparent admissions, visa assistance, and on-ground support in every country."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {whyShikshaItems.map((item) => (
            <WhyWciecCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
