import React from "react";
import { brand, admissionYear } from "@/lib/brand";

/**
 * Closing call-to-action banner with phone and email links.
 */
export function CtaSection() {
  return (
    <section
      className="py-24"
      style={{
        background: `radial-gradient(100% 160% at 50% 0%, ${brand.goldGlow}, transparent 60%), ${brand.navy}`,
      }}
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Begin Your Journey Toward Medical Excellence
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-xs sm:text-sm opacity-80 text-white">
            Contact our consultants today to check your program eligibility and
            begin your international university application. Admissions open for
            {admissionYear()} — apply early for priority processing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+79184826501"
              className="inline-flex items-center justify-center min-h-11 px-6 py-3 text-xs font-semibold text-navy bg-white rounded-lg transition-all hover:bg-white/95"
            >
              Call +7 918 482-65-01
            </a>
            <a
              href="tel:+918826427297"
              className="inline-flex items-center justify-center min-h-11 px-6 py-3 text-xs font-semibold text-navy bg-white rounded-lg transition-all hover:bg-white/95"
            >
              Call +91 88264 27297
            </a>
            <a
              href="mailto:admin@shiksha.study"
              className="inline-flex items-center justify-center min-h-11 px-6 py-3 text-xs font-semibold text-white border border-white/20 rounded-lg transition-all hover:bg-white/10"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
