import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, GraduationCap, HeartHandshake } from "lucide-react";
import { admissionYear, brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Scholarships | Shiksha International",
  description:
    "Explore scholarship and financial support options for medical studies abroad with Shiksha International.",
};

const supportOptions = [
  {
    icon: GraduationCap,
    title: "Merit-based awards",
    description:
      "For students with strong academic records and entrance performance.",
  },
  {
    icon: HeartHandshake,
    title: "Need-based assistance",
    description:
      "For students who need help with tuition fees and living costs abroad.",
  },
  {
    icon: Award,
    title: "Partner university awards",
    description:
      "Awards offered by our university partners for each intake and course.",
  },
];

const steps = [
  {
    title: "Check eligibility",
    description:
      "Review the criteria for each scholarship and shortlist the ones that fit.",
  },
  {
    title: "Prepare documents",
    description:
      "Keep academic records, identity documents and admission proof ready.",
  },
  {
    title: "Apply with guidance",
    description:
      "Our counsellors help you submit the application with your admission file.",
  },
];

export default function ScholarshipPage() {
  return (
    <>
      <section
        className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8"
        style={{ background: brand.navy }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(90% 130% at 85% -10%, ${brand.goldGlow}, transparent 60%)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl text-white">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            Scholarships {admissionYear()}
          </span>
          <h1 className="mt-6 max-w-3xl text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight">
            Scholarships and financial support
          </h1>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: "rgba(255,255,255,0.68)" }}
          >
            We are preparing the full scholarship guide for the upcoming intake.
            Explore the support categories below, then contact our team for
            current eligibility.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact-us?subject=scholarship"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: brand.gold, color: brand.ink }}
            >
              Ask about scholarships
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore universities
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: brand.gold }}
          >
            Support categories
          </p>
          <h2
            className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: brand.ink }}
          >
            Ways we help students fund their course
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {supportOptions.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border p-6"
                style={{ borderColor: brand.hairline }}
              >
                <span
                  className="flex size-11 items-center justify-center rounded-xl"
                  style={{ background: brand.goldLight, color: brand.gold }}
                >
                  <Icon className="size-5" />
                </span>
                <h3
                  className="mt-4 text-lg font-bold"
                  style={{ color: brand.ink }}
                >
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: brand.inkMuted }}>
                  {description}
                </p>
              </div>
            ))}
          </div>

          <p
            className="mt-8 rounded-lg px-4 py-3 text-sm"
            style={{ background: brand.goldLight, color: brand.ink }}
          >
            This page is a placeholder. Final criteria, award amounts and
            deadlines will be published before the intake opens.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ background: brand.canvas }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: brand.gold }}
          >
            How it works
          </p>
          <h2
            className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: brand.ink }}
          >
            Three steps to apply
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title}>
                <span
                  className="text-3xl font-black"
                  style={{ color: brand.gold }}
                >
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-base font-bold" style={{ color: brand.ink }}>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: brand.inkMuted }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 py-16 text-white sm:px-6 lg:px-8"
        style={{ background: brand.navy }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Need help choosing the right support?
            </h2>
            <p className="mt-2 text-sm text-white/65">
              Our counsellors can walk you through the options for your course
              and country.
            </p>
          </div>
          <Link
            href="/contact-us?subject=scholarship"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: brand.gold, color: brand.ink }}
          >
            Talk to a counsellor
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
