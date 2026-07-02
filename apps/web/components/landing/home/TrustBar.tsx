"use client";

import { brand } from "@/lib/brand";
import {
  Building2,
  ScrollText,
  Plane,
  GraduationCap,
  Users,
  Award,
} from "lucide-react";

const trustSignals = [
  { icon: Building2, label: "Official University Collaborations" },
  { icon: ScrollText, label: "Transparent & Legal Process" },
  { icon: Plane, label: "Visa & Travel Assistance" },
  { icon: GraduationCap, label: "Free FMGE/NEXT Coaching" },
  { icon: Users, label: "On-Ground Support" },
  { icon: Award, label: "No Hidden Charges" },
];

export function TrustBar() {
  return (
    <section className="py-10" style={{ background: brand.ink }}>
      {/* ── Metric row ── */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "12,000+", label: "Successful Admissions" },
              { value: "10+", label: "Partner Universities" },
              { value: "4", label: "Countries" },
              { value: "70%", label: "Scholarship Available" },
            ].map((s) => (
              <div key={s.label}>
                <p
                  className="text-3xl sm:text-4xl font-black tracking-tight"
                  style={{ color: brand.gold }}
                >
                  {s.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/50 font-semibold">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust signals 3x3 grid ── */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {trustSignals.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: brand.goldLight }}
                >
                  <Icon className="size-4" style={{ color: brand.gold }} />
                </div>
                <span
                  className="text-xs font-semibold leading-snug"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
