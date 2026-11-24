import React from "react";
import Link from "next/link";
import { ArrowRight, FileText, Phone } from "lucide-react";
import { admissionYear, brand } from "@/lib/brand";

/**
 * Contact page hero: a direct line to the counselling desk and a paper
 * request slip that previews the form below.
 */
export function ContactHero() {
  const year = admissionYear();
  const requestFields = ["Name", "Country", "NEET score", "Preferred intake"];

  return (
    <section
      className="px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-24"
      style={{ background: brand.navy }}
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs font-medium text-white/60">Admissions {year}</p>
          <h1 className="mt-5 max-w-2xl text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[1.04] tracking-[-0.02em] text-white">
            Talk to an admissions counsellor
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            Tell us where you are in the process. We help with university
            shortlisting, applications, documents and the next intake.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#contact-form"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-gold-dark"
            >
              Book a free consultation
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Link>
            <Link
              href="tel:+79184826501"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
            >
              <Phone className="size-4" strokeWidth={1.5} />
              Call +7 918 482-65-01
            </Link>
          </div>
        </div>

        <aside
          aria-label="Sample consultation request"
          className="relative mx-auto w-full max-w-sm pt-3"
        >
          <span
            className="absolute left-6 top-0 rounded-t-md px-2.5 py-1 text-xs font-medium"
            style={{ background: brand.gold, color: brand.ink }}
          >
            {year} intake
          </span>
          <div className="rounded-2xl bg-white p-6 text-brand-ink shadow-xl">
            <div className="flex items-center gap-2 border-b border-brand-hairline pb-4">
              <FileText
                className="size-4 text-brand-ink-muted"
                strokeWidth={1.5}
              />
              <p className="text-sm font-medium">Consultation request</p>
            </div>

            <dl>
              {requestFields.map((field) => (
                <div
                  key={field}
                  className="flex items-center justify-between gap-6 border-b border-brand-hairline py-3"
                >
                  <dt className="text-xs text-brand-ink-muted">{field}</dt>
                  <dd
                    aria-hidden
                    className="h-px w-28 shrink-0 bg-brand-hairline"
                  />
                </div>
              ))}
            </dl>

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-brand-hairline pt-5">
              <p className="max-w-[12rem] text-xs leading-relaxed text-brand-ink-muted">
                Reviewed by the counselling desk.
              </p>
              <span
                className="-rotate-2 border bg-brand-gold-light px-3 py-2 text-center text-xs font-medium leading-tight"
                style={{ borderColor: brand.goldBorder }}
              >
                Counselling desk
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
