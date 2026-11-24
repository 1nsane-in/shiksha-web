import React from "react";
import { partnerUniversities } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";
import { CountryStamp } from "@/components/landing/about-us/country-stamp";

const COUNTRIES = ["Kyrgyzstan", "Uzbekistan", "Kazakhstan", "Russia"];

/**
 * Who we are: a short narrative and a file summary built from real data.
 */
export function StorySection() {
  return (
    <section
      id="story"
      className="border-b border-white/10 bg-navy py-24"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Who we are"
              title="We stay with the file until the visa is stamped"
              dark
            />
            <div className="space-y-4 text-sm leading-relaxed text-white/75 sm:text-base">
              <p>
                Shiksha International is a medical admissions consultancy for
                Indian students. We work with universities in Kyrgyzstan,
                Uzbekistan, Kazakhstan and Russia, and keep the process in one
                file.
              </p>
              <p>
                The file starts with your NEET score, budget and preferred
                country. From there we shortlist universities, prepare the
                application and documents, and stay through the visa and
                arrival.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl border border-brand-hairline bg-white p-6">
              <p className="text-xs font-medium text-brand-ink-muted">
                The file at a glance
              </p>
              <dl className="mt-4">
                <div className="flex items-center justify-between gap-4 border-b border-brand-hairline py-4">
                  <dt className="text-xs text-brand-ink-muted">Countries</dt>
                  <dd className="flex items-center gap-1.5">
                    {COUNTRIES.map((country) => (
                      <CountryStamp key={country} country={country} />
                    ))}
                    <span className="sr-only">{COUNTRIES.join(", ")}</span>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-brand-hairline py-4">
                  <dt className="text-xs text-brand-ink-muted">
                    Partner universities
                  </dt>
                  <dd className="text-sm font-medium tabular-nums text-brand-ink">
                    {partnerUniversities.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-brand-hairline py-4">
                  <dt className="text-xs text-brand-ink-muted">
                    Program length
                  </dt>
                  <dd className="text-sm font-medium text-brand-ink">6 years</dd>
                </div>
                <div className="flex items-center justify-between gap-4 pt-4">
                  <dt className="text-xs text-brand-ink-muted">Support</dt>
                  <dd className="text-sm font-medium text-brand-ink">
                    Shortlist to arrival
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
