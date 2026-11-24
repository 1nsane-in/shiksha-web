import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  FileText,
  GraduationCap,
  HeartHandshake,
  Info,
} from "lucide-react";
import { admissionYear, brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Scholarships | Shiksha International",
  description:
    "Scholarship and financial support guidance for medical study abroad with Shiksha International.",
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
  const year = admissionYear();

  return (
    <>
      <section
        className="px-4 pb-20 pt-32 sm:px-6 sm:pb-24 lg:px-8"
        style={{ background: brand.navy }}
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-medium text-white/60">
              Scholarships {year}
            </p>
            <h1 className="mt-5 max-w-2xl text-[clamp(2.5rem,5vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.02em] text-white">
              Scholarships for medical study abroad
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              We are preparing the full scholarship guide for the {year} intake.
              Review the support routes below, then ask our team what fits your
              profile.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact-us?subject=scholarship"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: brand.gold, color: brand.ink }}
              >
                Ask about scholarships
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </Link>
              <Link
                href="/universities"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                Explore universities
              </Link>
            </div>
          </div>

          <aside
            aria-label="Sample funding review"
            className="rounded-2xl bg-white p-6 text-brand-ink shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-brand-hairline pb-4">
              <div className="flex items-center gap-2">
                <FileText
                  className="size-4 text-brand-ink-muted"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-medium">Sample funding review</p>
              </div>
              <span className="text-xs text-brand-ink-muted">{year}</span>
            </div>

            <ul className="mt-2">
              {supportOptions.map(({ title, description }) => (
                <li
                  key={title}
                  className="border-b border-brand-hairline py-4 last:border-0"
                >
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-brand-ink-muted">
                    {description}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-brand-hairline pt-5">
              <p className="max-w-[13rem] text-xs leading-relaxed text-brand-ink-muted">
                Every route is checked against your admission file.
              </p>
              <span
                className="-rotate-3 border px-3 py-2 text-center text-xs font-medium leading-tight"
                style={{
                  borderColor: brand.goldBorder,
                  background: brand.goldLight,
                }}
              >
                Counsellor review
              </span>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium text-brand-ink-muted">
            Support categories
          </p>
          <h2
            className="mt-3 max-w-2xl text-3xl font-medium tracking-[-0.02em] sm:text-4xl"
            style={{ color: brand.ink }}
          >
            Three routes to funding your course
          </h2>
          <p
            className="mt-4 max-w-xl text-sm leading-relaxed"
            style={{ color: brand.inkMuted }}
          >
            Each route starts with your admission file. We help you see what you
            qualify for and what is missing.
          </p>

          <ul className="mt-10 border-t border-brand-hairline">
            {supportOptions.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex gap-4 border-b border-brand-hairline py-6"
              >
                <Icon
                  className="mt-0.5 size-4 shrink-0 text-brand-ink-muted"
                  strokeWidth={1.5}
                />
                <div className="sm:grid sm:grid-cols-[220px_1fr] sm:gap-6">
                  <h3
                    className="text-base font-medium"
                    style={{ color: brand.ink }}
                  >
                    {title}
                  </h3>
                  <p
                    className="mt-1 text-sm leading-relaxed sm:mt-0"
                    style={{ color: brand.inkMuted }}
                  >
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-brand-ink-muted">
            <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} />
            Final criteria, award amounts and deadlines will be published before
            the intake opens.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-24" style={{ background: brand.iceGrey }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium text-brand-ink/70">How it works</p>
          <h2
            className="mt-3 text-3xl font-medium tracking-[-0.02em] sm:text-4xl"
            style={{ color: brand.ink }}
          >
            Three steps to apply
          </h2>

          <ol className="mt-10 grid border-t border-brand-hairline sm:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="border-b border-brand-hairline py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
              >
                <span className="text-xs font-medium tabular-nums text-brand-ink/70">
                  Step {index + 1}
                </span>
                <h3
                  className="mt-3 text-base font-medium"
                  style={{ color: brand.ink }}
                >
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="px-4 py-16 text-white sm:px-6 lg:px-8"
        style={{ background: brand.navy }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
              Need help choosing the right support?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
              Our counsellors can walk you through the options for your course
              and country.
            </p>
          </div>
          <Link
            href="/contact-us?subject=scholarship"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: brand.gold, color: brand.ink }}
          >
            Talk to a counsellor
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </>
  );
}
