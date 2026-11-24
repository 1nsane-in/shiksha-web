import React from "react";
import { SectionHeader } from "@/components/landing/about-us/section-header";

const FACTS = [
  {
    label: "When",
    value: "After each academic year",
  },
  {
    label: "Who",
    value: "High performers in the internal exam",
  },
  {
    label: "What",
    value: "Tuition support for the next year",
  },
];

/**
 * Scholarship note: a quiet, specific read of how the reward works.
 */
export function FoundationSection() {
  return (
    <section className="bg-brand-ink py-24 text-white">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Scholarship program 2026"
              title="Academic excellence is rewarded"
              description="Internal scholarship examinations run after each academic year. High performers receive tuition support for the next year."
              dark
            />
          </div>

          <div className="lg:col-span-5">
            <dl className="border-t border-white/15">
              {FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-[80px_1fr] gap-4 border-b border-white/15 py-4"
                >
                  <dt className="text-xs text-white/60">{fact.label}</dt>
                  <dd className="text-sm text-white">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
