import React from "react";
import { brand } from "@/lib/brand";
import { countryComparison, commonBenefits } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";
import { Check, Clock, Globe, Wallet, Home } from "lucide-react";

/**
 * Country Comparison table section.
 */
export function CountryComparisonSection() {
  return (
    <section
      className="py-24 border-b border-white/10"
      style={{ background: brand.navy }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Compare Destinations"
          title="Country Comparison (2026)"
          description="Compare MBBS programs across our partner countries to find the best fit for your goals and budget."
          dark
        />

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ background: brand.ink }}>
                  <th
                    className="px-6 py-4 font-semibold text-white"
                    style={{ borderBottom: "1px solid " + brand.hairline }}
                  >
                    Factor
                  </th>
                  {countryComparison.map((c) => (
                    <th
                      key={c.country}
                      className="px-6 py-4 font-semibold text-white text-center"
                      style={{ borderBottom: "1px solid " + brand.hairline }}
                    >
                      {c.country}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: brand.canvas }}>
                  <td
                    className="px-6 py-4 font-medium"
                    style={{ color: brand.ink }}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="size-4" style={{ color: brand.gold }} />{" "}
                      Duration
                    </div>
                  </td>
                  {countryComparison.map((c) => (
                    <td
                      key={c.country}
                      className="px-6 py-4 text-center"
                      style={{ color: brand.inkMuted }}
                    >
                      {c.duration}
                    </td>
                  ))}
                </tr>
                <tr style={{ background: brand.surface }}>
                  <td
                    className="px-6 py-4 font-medium"
                    style={{ color: brand.ink }}
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="size-4" style={{ color: brand.gold }} />{" "}
                      Language
                    </div>
                  </td>
                  {countryComparison.map((c) => (
                    <td
                      key={c.country}
                      className="px-6 py-4 text-center"
                      style={{ color: brand.inkMuted }}
                    >
                      {c.language}
                    </td>
                  ))}
                </tr>
                <tr style={{ background: brand.canvas }}>
                  <td
                    className="px-6 py-4 font-medium"
                    style={{ color: brand.ink }}
                  >
                    <div className="flex items-center gap-2">
                      <Wallet
                        className="size-4"
                        style={{ color: brand.gold }}
                      />{" "}
                      Cost
                    </div>
                  </td>
                  {countryComparison.map((c) => (
                    <td
                      key={c.country}
                      className="px-6 py-4 text-center"
                      style={{ color: brand.inkMuted }}
                    >
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                        style={{
                          background:
                            c.cost === "Affordable"
                              ? "rgba(34, 197, 94, 0.1)"
                              : c.cost === "Moderate"
                                ? "rgba(251, 191, 36, 0.1)"
                                : "rgba(168, 85, 247, 0.1)",
                          color:
                            c.cost === "Affordable"
                              ? "var(--success)"
                              : c.cost === "Moderate"
                                ? "#b45309"
                                : "var(--medical-cyan)",
                        }}
                      >
                        {c.cost}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr style={{ background: brand.surface }}>
                  <td
                    className="px-6 py-4 font-medium"
                    style={{ color: brand.ink }}
                  >
                    <div className="flex items-center gap-2">
                      <Home className="size-4" style={{ color: brand.gold }} />{" "}
                      Living Cost
                    </div>
                  </td>
                  {countryComparison.map((c) => (
                    <td
                      key={c.country}
                      className="px-6 py-4 text-center"
                      style={{ color: brand.inkMuted }}
                    >
                      {c.livingCost}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Common Benefits */}
        <div className="mt-10">
          <h3
            className="text-sm font-semibold uppercase tracking-wider mb-4 text-center"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Common Benefits Across All Countries
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {commonBenefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid " + brand.goldBorder,
                }}
              >
                <Check className="size-4" style={{ color: brand.gold }} />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
