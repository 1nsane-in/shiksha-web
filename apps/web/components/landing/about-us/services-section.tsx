import React from "react";
import { brand } from "@/lib/brand";
import { e2eServices } from "@/lib/brand-data";
import { ShieldCheck } from "lucide-react";

/**
 * End-to-end services section with a split layout.
 * Left: service guarantees list. Right: FMGE prep coaching card.
 */
export function ServicesSection() {
  return (
    <section
      className="py-24 bg-white border-b"
      style={{ borderColor: brand.hairline }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: service guarantees */}
          <div className="space-y-6">
            <span
              className="text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: brand.gold }}
            >
              End-to-End Guarantees
            </span>
            <h2
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: brand.ink }}
            >
              Zero Bureaucracy, Pure Guidance
            </h2>
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: brand.inkMuted }}
            >
              We coordinate with embassies, prepare legal translations, and
              manage S3-compliant secure document vaults so your files are
              completely protected and immediately processed.
            </p>
            <div className="space-y-3">
              {e2eServices.map((service) => (
                <div
                  key={service}
                  className="flex gap-2 text-xs font-semibold text-gray-700"
                >
                  <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: FMGE coaching card */}
          <div
            className="bg-[#FAF9F6] border rounded-2xl p-8 space-y-6"
            style={{ borderColor: brand.hairline }}
          >
            <h3 className="font-bold text-sm text-[#2D2154] uppercase tracking-wider">
              FMGE Exam Prep Coaching
            </h3>
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: brand.inkMuted }}
            >
              Every student gains access to structured exam coaching materials
              and licensing mock tests to clear major state licensing
              examinations with absolute ease.
            </p>
            <div
              className="rounded-lg bg-white p-4 border"
              style={{ borderColor: brand.hairline }}
            >
              <p className="text-xs italic text-gray-500">
                &quot;WCIEC provided incredible guidance during my visa phase,
                and the hostel staff ensured I had home-style Indian food from
                day one.&quot;
              </p>
              <p className="text-[10px] font-bold mt-2 text-[#2D2154]">
                - Medical Graduate, CAIMU
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
