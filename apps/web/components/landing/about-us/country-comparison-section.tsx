import React from "react";
import { Check } from "lucide-react";
import { countryComparison, commonBenefits } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";
import { CountryStamp } from "@/components/landing/about-us/country-stamp";

const ROWS = [
  { label: "Duration", key: "duration" as const },
  { label: "Language", key: "language" as const },
  { label: "Tuition", key: "cost" as const },
  { label: "Living cost", key: "livingCost" as const },
];

/**
 * Country comparison as a quiet table, using the same country stamps as the
 * register. No flags, no color-coded pills.
 */
export function CountryComparisonSection() {
  return (
    <section className="border-b border-brand-hairline bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Country comparison"
          title="Four countries, one comparison"
          description="Duration, language and living costs side by side, for use with the register above"
        />

        <div className="mt-8 overflow-hidden rounded-xl border border-brand-hairline">
          <p className="border-b border-brand-hairline px-4 py-2 text-xs text-brand-ink-muted md:hidden">
            Swipe to compare all four countries
          </p>
          <div
            role="region"
            aria-label="Country comparison, scroll horizontally to see all four countries"
            tabIndex={0}
            className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-ink/30"
          >
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-ice-grey">
                <tr>
                  <th scope="col" className="px-4 py-3 text-xs font-medium text-brand-ink">
                    Factor
                  </th>
                  {countryComparison.map((country) => (
                    <th
                      key={country.country}
                      scope="col"
                      className="px-4 py-3 text-xs font-medium text-brand-ink"
                    >
                      <span className="flex items-center gap-2">
                        <CountryStamp country={country.country} />
                        {country.country}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr
                    key={row.key}
                    className="border-t border-brand-hairline"
                  >
                    <th scope="row" className="px-4 py-3 text-sm font-medium text-brand-ink">
                      {row.label}
                    </th>
                    {countryComparison.map((country) => (
                      <td
                        key={country.country}
                        className="px-4 py-3 text-sm tabular-nums text-brand-ink-muted"
                      >
                        {country[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-hairline pt-6">
          <h3 className="text-sm font-medium text-brand-ink">
            Common across all four
          </h3>
          <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {commonBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2 text-sm">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-brand-ink-muted"
                  strokeWidth={1.5}
                />
                <span className="text-brand-ink">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
