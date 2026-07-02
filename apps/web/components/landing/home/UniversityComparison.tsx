"use client";

import { brand } from "@/lib/brand";
import { Check, Minus } from "lucide-react";

const countries = [
  { name: "India", duration: "4.5 + 1 Year", language: "English", cost: "₹60 Lacs – 1.5 Cr", livingCost: "—", donation: false, hostel: false, mess: true, feeStructure: false },
  { name: "Kyrgyzstan", duration: "6 Years", language: "English", cost: "₹15–25 Lacs", livingCost: "Low", donation: true, hostel: true, mess: true, feeStructure: true },
  { name: "Uzbekistan", duration: "6 Years", language: "English", cost: "Moderate", livingCost: "Moderate", donation: true, hostel: true, mess: true, feeStructure: true },
  { name: "Kazakhstan", duration: "6 Years", language: "English", cost: "Moderate–Premium", livingCost: "Moderate", donation: true, hostel: true, mess: true, feeStructure: true },
  { name: "Russia", duration: "6 Years", language: "English", cost: "USD 2,100–4,000/yr", livingCost: "Moderate", donation: true, hostel: true, mess: true, feeStructure: true },
];

const rows: { label: string; key: keyof (typeof countries)[number]; highlight?: boolean }[] = [
  { label: "Duration", key: "duration" },
  { label: "Language", key: "language" },
  { label: "Annual Tuition", key: "cost", highlight: true },
  { label: "Living Cost", key: "livingCost" },
  { label: "No Donation / Capitation", key: "donation" },
  { label: "Guaranteed Hostel", key: "hostel" },
  { label: "Indian Mess", key: "mess" },
  { label: "Transparent Fee Structure", key: "feeStructure" },
];

export function UniversityComparison() {
  return (
    <section className="py-20 sm:py-28" style={{ background: "#fff" }}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            Country Comparison 2026
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 leading-[1.15]"
            style={{ color: brand.ink }}
          >
            India vs.{" "}
            <span style={{ color: brand.gold }}>Kyrgyzstan, Uzbekistan, Kazakhstan, Russia</span>
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: brand.hairline }}>
          <table className="w-full text-sm">
            {/* Header */}
            <thead>
              <tr style={{ background: brand.ink }}>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                  Parameter
                </th>
                {countries.map((c) => (
                  <th
                    key={c.name}
                    className={`px-5 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                      c.name === "India" ? "text-white/40" : "text-white"
                    }`}
                  >
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {rows.map((row, i) => {
                const isEven = i % 2 === 0;
                return (
                  <tr
                    key={row.label}
                    className={isEven ? "bg-white" : "bg-[#FAF9F6]"}
                  >
                    <td
                      className="px-5 py-4 text-xs font-semibold whitespace-nowrap"
                      style={{ color: brand.ink }}
                    >
                      {row.label}
                    </td>
                    {countries.map((c) => {
                      const val = c[row.key];
                      // Boolean fields → check/minus icons
                      if (typeof val === "boolean") {
                        return (
                          <td key={c.name} className="px-5 py-4">
                            {val ? (
                              <Check className="size-4" style={{ color: "#16a34a" }} />
                            ) : (
                              <Minus className="size-4" style={{ color: "#d1d5db" }} />
                            )}
                          </td>
                        );
                      }
                      return (
                        <td
                          key={c.name}
                          className={`px-5 py-4 text-xs ${
                            c.name === "India" ? "text-gray-400" : "text-[#2D2154]"
                          } ${row.highlight ? "font-bold" : ""}`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom note */}
        <p className="mt-6 text-xs leading-relaxed" style={{ color: brand.inkMuted }}>
          All Shiksha partner universities offer English-medium programs, NMC/WHO approved degrees,
          and on-campus Indian mess facilities. No donation, no capitation — only official university fees.
        </p>
      </div>
    </section>
  );
}
