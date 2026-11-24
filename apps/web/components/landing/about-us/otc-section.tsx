import React from "react";
import { SectionHeader } from "@/components/landing/about-us/section-header";

const ELIGIBLE = [
  {
    title: "Panchayat families",
    desc: "Families serving in local governance and rural development.",
  },
  {
    title: "Indian Army families",
    desc: "Families of Indian Army personnel serving the nation.",
  },
];

const WAIVED = [
  {
    label: "Shiksha service charges",
    value: "Waived",
  },
  {
    label: "University and living costs",
    value: "Unchanged",
  },
];

/**
 * OTC initiative: the eligibility and what is actually waived, stated plainly.
 */
export function OTCSection() {
  return (
    <section className="border-b border-brand-hairline bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="OTC initiative"
              title="Zero company charges for families who serve"
              description="Shiksha International waives its service charges for eligible Panchayat and Indian Army families. University fees and living costs still apply."
            />

            <dl className="border-t border-brand-hairline">
              {ELIGIBLE.map((item) => (
                <div
                  key={item.title}
                  className="grid gap-2 border-b border-brand-hairline py-5 sm:grid-cols-[180px_1fr] sm:gap-6"
                >
                  <dt className="text-sm font-medium text-brand-ink">
                    {item.title}
                  </dt>
                  <dd className="text-sm leading-relaxed text-brand-ink-muted">
                    {item.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl border border-brand-hairline bg-ice-grey p-6">
              <h3 className="text-sm font-medium text-brand-ink">
                What changes
              </h3>
              <dl className="mt-4 border-t border-brand-hairline">
                {WAIVED.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 border-b border-brand-hairline py-3"
                  >
                    <dt className="text-sm text-brand-ink">{item.label}</dt>
                    <dd className="text-sm font-medium text-brand-ink">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-brand-ink">
                Eligibility is checked before the application file is opened.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
