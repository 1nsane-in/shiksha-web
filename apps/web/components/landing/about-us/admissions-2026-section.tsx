import React from "react";
import { brand } from "@/lib/brand";
import { admissions2026Benefits, iconMap } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";
import { Calendar, ArrowRight } from "lucide-react";

/**
 * Admissions Open 2026 section with benefits and CTA.
 */
export function Admissions2026Section() {
  return (
    <section
      className="py-24"
      style={{ background: brand.ink }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] mb-4"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            <Calendar className="size-4" />
            Admissions Open 2026
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Benefits of Early Application
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/70">
            Secure your spot at top medical universities. Early applicants receive priority processing, better admission chances, and scholarship opportunities.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {admissions2026Benefits.map((benefit, i) => {
            const Icon = iconMap[benefit.icon];
            return (
              <div
                key={i}
                className="group rounded-2xl p-6 border transition-all duration-200 hover:bg-white/5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.1)",
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
                <h3 className="text-base font-bold mb-2 text-white">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/universities"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:opacity-95"
            style={{
              background: brand.gold,
              color: brand.ink,
            }}
          >
            Explore Universities
            <ArrowRight className="size-4" />
          </a>
          <p className="mt-3 text-xs text-white/50">
            Admissions close soon · Limited seats available
          </p>
        </div>
      </div>
    </section>
  );
}
