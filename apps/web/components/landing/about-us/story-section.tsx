import React from "react";
import { brand } from "@/lib/brand";

/**
 * Narrative "Who We Are" section with editorial column layout
 * and an impact stats aside card.
 */
export function StorySection() {
  return (
    <section
      id="story"
      className="py-24 border-b"
      style={{ borderColor: brand.hairline }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Editorial content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span
                className="text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: brand.gold }}
              >
                Who We Are
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: brand.ink }}
              >
                Igniting Ambition, Building Future Doctors
              </h2>
            </div>
            <div
              className="space-y-4 text-sm sm:text-base leading-relaxed"
              style={{ color: brand.inkMuted }}
            >
              <p>
                Shiksha International is a global education consultancy
                specializing in MBBS Abroad admissions. Built on uncompromising
                transparency and reliable service, we guide medical aspirants
                toward world-class academic institutions based purely on merit
                and budget.
              </p>
              <p>
                We work with officially recognized universities in Kyrgyzstan,
                Uzbekistan, Kazakhstan, and Russia — offering English-medium
                programs, affordable tuition, and globally recognized degrees
                (eligible for FMGE, NEXT, USMLE, PLAB).
              </p>
              <p>
                Our mission is to guide students with honesty and transparency,
                help them secure quality medical education abroad, and provide
                strong international support through every step of their journey.
              </p>
            </div>
          </div>

          {/* Impact stats card */}
          <div
            className="lg:col-span-5 bg-white rounded-2xl p-8 border"
            style={{ borderColor: brand.hairline }}
          >
            <div className="space-y-6">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{ color: brand.gold }}
              >
                The Impact
              </span>
              <div className="space-y-1">
                <p
                  className="text-5xl font-black tracking-tight"
                  style={{ color: brand.gold }}
                >
                  12,000+
                </p>
                <p className="text-sm font-semibold" style={{ color: brand.ink }}>
                  Successful Admissions
                </p>
              </div>
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: brand.inkMuted }}
              >
                Placed in NMC & WHO recognized medical universities across
                Kyrgyzstan, Uzbekistan, Kazakhstan, and Russia — with
                transparent fee structures, no hidden charges, and on-ground
                international support.
              </p>
              <div
                className="border-t pt-4"
                style={{ borderColor: brand.hairline }}
              >
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                  100% Legal & Verified Path
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
