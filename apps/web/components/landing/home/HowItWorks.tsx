"use client";

import { brand } from "@/lib/brand";
import { Search, Route, Files, Plane, Building2 } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Apply & Get Matched",
    desc: "Submit your NEET score and academic details. We match you with the best-fit university across 4 countries.",
  },
  {
    icon: Route,
    title: "Personal Counseling",
    desc: "Our counselors guide you through university options, fee structures, and the complete admission roadmap.",
  },
  {
    icon: Files,
    title: "Documentation & Application",
    desc: "We handle your application, document translation, notarization, and direct submission to the university.",
  },
  {
    icon: Plane,
    title: "Visa & Travel",
    desc: "End-to-end visa processing, flight bookings, and airport pickup coordination at your destination.",
  },
  {
    icon: Building2,
    title: "On-Ground Settlement",
    desc: "Local representatives help with hostel check-in, Indian mess, SIM cards, and university orientation.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28" style={{ background: "#fff" }}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            The Process
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 leading-[1.15]"
            style={{ color: brand.ink }}
          >
            From application to arrival.
            <br />
            <span style={{ color: brand.gold }}>We handle everything.</span>
          </h2>
        </div>

        {/* Steps — horizontal timeline */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden lg:block absolute top-8 left-[calc(8.33%+20px)] right-[calc(8.33%+20px)] h-px"
            style={{ background: brand.hairline }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="relative">
                  {/* Step number + icon */}
                  <div className="flex lg:block items-center gap-5 lg:gap-0 mb-5">
                    <div
                      className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: brand.goldLight,
                        border: `2px solid ${brand.gold}`,
                      }}
                    >
                      <Icon className="size-7" style={{ color: brand.gold }} />
                    </div>
                    <span
                      className="lg:hidden text-xs font-bold uppercase tracking-wider"
                      style={{ color: brand.gold }}
                    >
                      Step {i + 1}
                    </span>
                  </div>

                  {/* Step label (desktop) */}
                  <span
                    className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                    style={{ color: brand.gold }}
                  >
                    Step {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Content */}
                  <h3
                    className="text-sm font-extrabold leading-snug mb-2"
                    style={{ color: brand.ink }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: brand.inkMuted }}
                  >
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
