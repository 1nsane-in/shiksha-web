import React from "react";
import { Check } from "lucide-react";
import { e2eServices } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";

/**
 * What sits inside the file: documents, visa, arrival and exam support.
 */
export function ServicesSection() {
  return (
    <section className="border-b border-brand-hairline bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="What we coordinate"
              title="The paperwork, handled"
              description="Documents, translations, university letters and the visa file sit with one team"
            />

            <ul className="border-t border-brand-hairline">
              {e2eServices.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-3 border-b border-brand-hairline py-4 text-sm"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-brand-ink-muted"
                    strokeWidth={1.5}
                  />
                  <span className="text-brand-ink">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl border border-brand-hairline bg-ice-grey p-6">
              <h3 className="text-base font-medium text-brand-ink">
                FMGE / NEXT
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-ink">
                Coaching, revision and mock tests are part of the student file.
                The academic team shares the current schedule before arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
