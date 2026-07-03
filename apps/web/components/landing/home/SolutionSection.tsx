"use client";

import { brand } from "@/lib/brand";
import { Building2, ScrollText, BookOpen, Globe, Plane, ShieldCheck } from "lucide-react";

const solutions = [
  {
    icon: Building2,
    title: "Official University Collaborations",
    desc: "Direct partnerships with NMC/WHO approved universities. No middlemen. No fake promises.",
  },
  {
    icon: ScrollText,
    title: "Transparent & Legal Process",
    desc: "Every fee disclosed before admission. Every document notarized. Every step verifiable.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Hidden Charges",
    desc: "Only official university fees. No donation, no capitation. OTC initiative waives service charges for army & panchayat families.",
  },
  {
    icon: BookOpen,
    title: "Free FMGE/NEXT Coaching",
    desc: "Subject-wise coaching, mock tests, revision programs, and clinical discussions — included at no extra cost.",
  },
  {
    icon: Globe,
    title: "On-Ground International Support",
    desc: "Local representatives in every country. Secure hostels, Indian mess, CCTV, and 24/7 assistance.",
  },
  {
    icon: Plane,
    title: "Visa & Travel Assistance",
    desc: "Document translation, embassy liaison, flight coordination, and airport pickup — end to end.",
  },
];

export function SolutionSection() {
  return (
    <section className="py-20 sm:py-28" style={{ background: brand.ink }}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            The Solution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 leading-[1.15] text-white">
            That is why Shiksha exists.
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.5)" }}>
            Every problem on the left has a direct answer. Official partnerships. Transparent pricing.
            Real on-ground teams. Free licensing exam coaching.
          </p>
        </div>

        {/* Solution grid — mirrors ProblemSection layout, dark variant */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="rounded-xl p-6 transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="flex size-10 items-center justify-center rounded-lg mb-4"
                  style={{ background: brand.goldLight }}
                >
                  <Icon className="size-5" style={{ color: brand.gold }} />
                </div>
                <h3 className="text-sm font-extrabold leading-snug mb-2 text-white">
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
