import React from "react";
import { whyShikshaItems } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";
import { WhyWciecCard } from "@/components/landing/about-us/why-wciec-card";

/**
 * The work Shiksha handles between shortlist and arrival.
 */
export function WhyWciecSection() {
  return (
    <section className="border-b border-brand-hairline bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="What we handle"
          title="One team, one file, from shortlist to arrival"
          description="The work that sits between the shortlist and the first day of class"
        />

        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
          {whyShikshaItems.map((item, index) => (
            <WhyWciecCard key={item.title} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
