import React from "react";
import { brand } from "@/lib/brand";

/**
 * Closing call-to-action banner with phone and email links.
 */
export function CtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <div
          className="rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: brand.ink }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Begin Your Journey Toward Medical Excellence
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-xs sm:text-sm opacity-80 text-white">
            Contact our consultants today to check your program eligibility and
            begin your international university application.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+996556611890"
              className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-[#1A153A] bg-white rounded-lg transition-all hover:bg-white/95"
            >
              Call +7 918 482-65-01
            </a>
            <a
              href="mailto:siksha.sabkaadhikaar@gmail.com"
              className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-white border border-white/20 rounded-lg transition-all hover:bg-white/10"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
