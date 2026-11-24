import React from "react";
import { mbbsBenefits } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";

/**
 * Why study MBBS abroad, set as a numbered list instead of icon cards.
 */
export function WhyMBBSAbroadSection() {
  return (
    <section className="border-b border-brand-hairline bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Why MBBS abroad"
          title="The practical case for studying medicine abroad"
          description="Eight reasons students weigh when they compare an Indian private college with a medical university abroad"
        />

        <ol className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
          {mbbsBenefits.map((benefit, i) => (
            <li
              key={benefit.title}
              className="grid grid-cols-[32px_1fr] gap-4 border-t border-brand-hairline py-5"
            >
              <span className="text-xs font-medium tabular-nums text-brand-ink-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-base font-medium text-brand-ink">
                  {benefit.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-ink-muted">
                  {benefit.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
