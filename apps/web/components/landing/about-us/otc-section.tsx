import React from "react";
import { brand } from "@/lib/brand";
import { SectionHeader } from "@/components/landing/about-us/section-header";
import { Building2, ShieldCheck, Heart, Users } from "lucide-react";

/**
 * Zero Company Charges (OTC) Initiative section.
 * Highlights the special program for Panchayat and Army families.
 */
export function OTCSection() {
  return (
    <section
      className="py-24 border-b"
      style={{ borderColor: brand.hairline, background: brand.canvas }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em]"
              style={{ background: brand.goldLight, color: brand.gold }}
            >
              <ShieldCheck className="size-4" />
              Zero Company Charges (OTC) Initiative — 2026
            </span>

            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: brand.ink }}
            >
              Supporting Those Who Serve Society
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: brand.inkMuted }}
            >
              In recognition of their service to society and the nation, Shiksha
              International waives all service charges for eligible families
              under our OTC (Zero Company Charges) Initiative.
            </p>

            {/* Eligible Families */}
            <div className="space-y-4 pt-4">
              <p
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: brand.ink }}
              >
                Eligible Families
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="flex items-start gap-4 p-4 rounded-xl border"
                  style={{
                    background: brand.surface,
                    borderColor: brand.hairline,
                  }}
                >
                  <div
                    className="flex size-10 items-center justify-center rounded-lg shrink-0"
                    style={{ background: brand.goldLight }}
                  >
                    <Users className="size-5" style={{ color: brand.gold }} />
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: brand.ink }}>
                      Panchayat Families
                    </h4>
                    <p className="text-sm" style={{ color: brand.inkMuted }}>
                      Families serving in local governance and rural development
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-4 p-4 rounded-xl border"
                  style={{
                    background: brand.surface,
                    borderColor: brand.hairline,
                  }}
                >
                  <div
                    className="flex size-10 items-center justify-center rounded-lg shrink-0"
                    style={{ background: brand.goldLight }}
                  >
                    <Heart className="size-5" style={{ color: brand.gold }} />
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: brand.ink }}>
                      Army Personnel Families
                    </h4>
                    <p className="text-sm" style={{ color: brand.inkMuted }}>
                      Families of Indian Army personnel serving the nation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefit */}
            <div
              className="mt-6 p-6 rounded-2xl border"
              style={{
                background: "rgba(34, 197, 94, 0.05)",
                borderColor: "rgba(34, 197, 94, 0.2)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-full"
                  style={{ background: "rgba(34, 197, 94, 0.1)" }}
                >
                  <ShieldCheck className="size-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-700">
                    Complete Waiver of Service Charges
                  </p>
                  <p className="text-sm text-emerald-600/80">
                    100% discount on all Shiksha International service fees
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual/Stats */}
          <div className="relative">
            <div
              className="rounded-2xl p-8 border"
              style={{
                background: brand.surface,
                borderColor: brand.hairline,
              }}
            >
              <h3
                className="text-lg font-bold mb-6"
                style={{ color: brand.ink }}
              >
                Initiative Highlights
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div
                    className="flex size-12 items-center justify-center rounded-full text-2xl font-bold"
                    style={{ background: brand.goldLight, color: brand.gold }}
                  >
                    0
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: brand.ink }}>
                      Zero Service Charges
                    </p>
                    <p className="text-sm" style={{ color: brand.inkMuted }}>
                      Complete waiver of all Shiksha fees
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="flex size-12 items-center justify-center rounded-full text-2xl font-bold"
                    style={{ background: brand.goldLight, color: brand.gold }}
                  >
                    2
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: brand.ink }}>
                      Eligible Categories
                    </p>
                    <p className="text-sm" style={{ color: brand.inkMuted }}>
                      Panchayat & Army families
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="flex size-12 items-center justify-center rounded-full text-2xl font-bold"
                    style={{ background: brand.goldLight, color: brand.gold }}
                  >
                    <Building2 className="size-6" />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: brand.ink }}>
                      Full Services Included
                    </p>
                    <p className="text-sm" style={{ color: brand.inkMuted }}>
                      All admission & support services
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="mt-6 pt-6 border-t"
                style={{ borderColor: brand.hairline }}
              >
                <p className="text-sm" style={{ color: brand.inkMuted }}>
                  Contact us to verify eligibility and apply under this
                  initiative. Our team will guide you through the documentation
                  process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
