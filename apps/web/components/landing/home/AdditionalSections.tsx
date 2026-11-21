"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brand } from "@/lib/brand";

const whyItems = [
  {
    title: "Official university collaborations",
    desc: "Direct partnerships with universities. You speak to the source, not a chain of agents.",
  },
  {
    title: "Transparent fees",
    desc: "Full fee breakdown before you apply. No surprise charges at admission.",
  },
  {
    title: "Document support",
    desc: "Every file checked before submission. Re-upload after rejection without losing your place.",
  },
  {
    title: "Licensing exam coaching",
    desc: "FMGE and NExT preparation included with your admission journey.",
  },
  {
    title: "On-ground support",
    desc: "Local teams help with housing, meals and daily life after arrival.",
  },
  {
    title: "Visa and travel",
    desc: "Embassy paperwork, flights and airport pickup handled in one place.",
  },
];

const offerFacts = [
  { label: "Eligibility", value: "Confirmed by the awarding body" },
  { label: "Benefit", value: "Published with the offer" },
  { label: "Deadline", value: "Tied to the intake" },
  { label: "Source", value: "University or scholarship authority" },
];

const testimonials = [
  {
    name: "Ananya S.",
    location: "Kyrgyzstan · 2024 batch",
    quote: "The document checklist saved me weeks of confusion. My counsellor caught a notarization error before the university did.",
  },
  {
    name: "Rohan M.",
    location: "Uzbekistan · 2024 batch",
    quote: "Free FMGE coaching was the real value. Mock tests every Sunday, subject-wise revision. It felt like a proper institute, not an agent.",
  },
  {
    name: "Priya K.",
    location: "Kazakhstan · 2023 batch",
    quote: "Airport pickup, hostel check-in, SIM card. Someone was there at every step. I never felt alone in a new country.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]"
      style={{ background: brand.goldLight, color: brand.gold }}
    >
      {children}
    </span>
  );
}

function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
      style={{ background: brand.ink, color: brand.canvas }}
    >
      {children}
      <ArrowRight className="size-4" />
    </Link>
  );
}

export function WhyShikshaSection() {
  return (
    <section className="py-20 sm:py-24" style={{ background: brand.ink }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Eyebrow>Why Shiksha</Eyebrow>
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Guidance that continues after admission.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
            Six commitments that shape every step, from the first shortlist to
            the first semester abroad.
          </p>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-0 sm:grid-cols-2">
          {whyItems.map((item, index) => (
            <div key={item.title} className="grid grid-cols-[48px_1fr] gap-4 border-t border-white/10 py-5">
              <span className="text-xs font-bold tracking-widest" style={{ color: brand.gold }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/about-us"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: brand.gold, color: brand.ink }}
          >
            Our approach
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ScholarshipsSection() {
  return (
    <section className="py-16 sm:py-20" style={{ background: brand.canvas }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl p-6 sm:p-8 lg:p-10"
          style={{ border: `1px solid ${brand.hairline}`, background: brand.purpleLight }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>Scholarships and offers</Eyebrow>
              <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl" style={{ color: brand.ink }}>
                Funding details, before you commit.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: brand.inkMuted }}>
                We share an opportunity only after the university or awarding body confirms it.
                Eligibility, benefit, deadline and terms travel together, so you can compare like for like.
              </p>
            </div>
            <div className="shrink-0">
              <SectionLink href="/contact-us?subject=scholarship">
                Request verified offers
              </SectionLink>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offerFacts.map((fact) => (
              <div key={fact.label} className="border-t pt-4" style={{ borderColor: brand.hairline }}>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: brand.inkMuted }}>
                  {fact.label}
                </p>
                <p className="mt-1.5 text-sm font-medium" style={{ color: brand.ink }}>
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StudentStoriesSection() {
  return (
    <section
      id="student-stories"
      className="scroll-mt-24 py-14 sm:py-16"
      style={{ background: brand.ink }}
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: brand.gold }}>
          Student stories
        </p>
        <h2 className="mt-3 text-2xl font-semibold leading-snug text-white sm:text-3xl">
          Real journeys, told with consent.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
          Names and cohorts are verified. Outcomes reflect individual experiences.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="rounded-2xl p-6 text-left"
              style={{
                border: `1px solid ${brand.hairline}`,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <p className="text-sm leading-relaxed text-white/80">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-2">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                  style={{ background: brand.goldLight, color: brand.gold }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{t.name}</p>
                  <p className="text-[11px] text-white/50">{t.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
