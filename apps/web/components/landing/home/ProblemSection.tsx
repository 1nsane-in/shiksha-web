"use client";

import { brand } from "@/lib/brand";
import { IndianRupee, GraduationCap, Globe, ShieldAlert, PhoneOff, FileQuestion } from "lucide-react";

const problems = [
  {
    icon: IndianRupee,
    title: "Soaring Costs in India",
    desc: "Private medical colleges charge ₹60 Lacs to ₹1.5 Cr. Government seats are vanishingly rare.",
  },
  {
    icon: ShieldAlert,
    title: "Scams & Unverified Agents",
    desc: "Fake consultancies take money and disappear. Students need a verified, legal pathway.",
  },
  {
    icon: Globe,
    title: "Which Country? Which University?",
    desc: "Kyrgyzstan? Uzbekistan? Russia? Without expert guidance, the options feel overwhelming.",
  },
  {
    icon: GraduationCap,
    title: "Degree Recognition Worries",
    desc: "Will my degree be valid in India? Is the university NMC/WHO approved? These doubts paralyze decisions.",
  },
  {
    icon: PhoneOff,
    title: "Zero Support Once Abroad",
    desc: "Many agents disappear after admission. Students are left alone with accommodation, food, and safety issues.",
  },
  {
    icon: FileQuestion,
    title: "Visa & Paperwork Maze",
    desc: "Document translation, notarization, embassy interviews — one mistake can derail your entire plan.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 sm:py-28" style={{ background: "#FAF9F6" }}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            The Reality
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 leading-[1.15]"
            style={{ color: brand.ink }}
          >
            MBBS in India is getting harder.
            <br />
            <span style={{ color: brand.gold }}>Every year.</span>
          </h2>
          <p
            className="mt-4 text-sm sm:text-base leading-relaxed max-w-xl"
            style={{ color: brand.inkMuted }}
          >
            Between skyrocketing fees, limited seats, and opaque agents — the path to becoming a
            doctor is littered with obstacles. Here is what students actually face.
          </p>
        </div>

        {/* Problem grid — 3x2 with alternating visual weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="rounded-xl p-6 transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  background: "#fff",
                  border: `1px solid ${brand.hairline}`,
                }}
              >
                <div
                  className="flex size-10 items-center justify-center rounded-lg mb-4"
                  style={{ background: brand.goldLight }}
                >
                  <Icon className="size-5" style={{ color: brand.gold }} />
                </div>
                <h3
                  className="text-sm font-extrabold leading-snug mb-2"
                  style={{ color: brand.ink }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: brand.inkMuted }}
                >
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
