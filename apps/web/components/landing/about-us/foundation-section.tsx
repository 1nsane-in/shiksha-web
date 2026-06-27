import React from "react";
import { brand } from "@/lib/brand";
import { foundationStats } from "@/lib/brand-data";
import { StatBadge } from "@/components/landing/about-us/stat-badge";

/**
 * Charity foundation section. Dark background with stats.
 */
export function FoundationSection() {
  return (
    <section className="py-24 text-white" style={{ background: brand.ink }}>
      <div className="mx-auto max-w-5xl px-6 text-center sm:px-8 lg:px-12">
        <div
          className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full"
          style={{ background: brand.goldLight }}
        >
          <HeartIcon />
        </div>

        <span
          className="text-[11px] font-bold uppercase tracking-[0.2em]"
          style={{ color: brand.gold }}
        >
          Doing Good Foundation
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
          Caring for Tomorrow&apos;s Doctors
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm leading-relaxed opacity-80">
          A charity program established by WCIEC to promote professional ethics
          and service within our students. We believe true medical excellence
          begins with empathy, so we fund local healthcare initiatives and
          provide medical scholarships to outstanding applicants.
        </p>

        <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-white/10 pt-8">
          {foundationStats.map((stat) => (
            <StatBadge key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HeartIcon() {
  return (
    <svg
      className="size-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: brand.gold }}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
