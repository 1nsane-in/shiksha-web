import React from "react";
import Link from "next/link";
import { brand, admissionYear } from "@/lib/brand";
import { admissions2026Benefits, iconMap } from "@/lib/brand-data";
import { Calendar, ArrowRight } from "lucide-react";

/**
 * Admissions Open 2026 section with benefits and CTA.
 */
export function Admissions2026Section() {
  return (
    <section
      className="border-b py-24"
      style={{ borderColor: brand.hairline, background: brand.canvas }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] mb-4"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            <Calendar className="size-4" />
            Admissions Open {admissionYear()}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: brand.ink }}
          >
            Benefits of Early Application
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-sm sm:text-base"
            style={{ color: brand.inkMuted }}
          >
            Secure your spot at top medical universities. Early applicants
            receive priority processing, better admission chances, and
            scholarship opportunities.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {admissions2026Benefits.map((benefit, i) => {
            const Icon = iconMap[benefit.icon];
            return (
              <div
                key={i}
                className="group rounded-2xl border bg-white p-6 transition-all duration-200 hover:bg-slate-50"
                style={{
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
                  className="mb-2 text-base font-bold"
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

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/universities"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-95"
            style={{
              background: brand.gold,
              color: brand.ink,
            }}
          >
            Explore Universities
            <ArrowRight className="size-4" />
          </Link>
          <p className="mt-3 text-xs" style={{ color: brand.inkMuted }}>
            Admissions close soon · Limited seats available
          </p>
        </div>
      </div>
    </section>
  );
}
