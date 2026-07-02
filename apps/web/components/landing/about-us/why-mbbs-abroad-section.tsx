import React from "react";
import { brand } from "@/lib/brand";
import { mbbsBenefits, iconMap } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";

/**
 * Why Study MBBS Abroad section with 8 key benefits.
 */
export function WhyMBBSAbroadSection() {
  return (
    <section
      className="py-24 border-b"
      style={{ borderColor: brand.hairline, background: brand.canvas }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Why MBBS Abroad?"
          title="8 Compelling Reasons to Study Medicine Overseas"
          description="Discover why thousands of Indian students choose to pursue their medical dreams abroad — from affordable tuition to globally recognized degrees."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mbbsBenefits.map((benefit, i) => {
            const Icon = iconMap[benefit.icon];
            return (
              <div
                key={i}
                className="group rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg"
                style={{
                  background: brand.surface,
                  borderColor: brand.hairline,
                }}
              >
                <div
                  className="mb-4 flex size-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                  style={{ background: brand.goldLight }}
                >
                  {Icon && (
                    <Icon className="size-6" style={{ color: brand.gold }} />
                  )}
                </div>
                <h3
                  className="text-base font-bold mb-2"
                  style={{ color: brand.ink }}
                >
                  {benefit.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: brand.inkMuted }}
                >
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
