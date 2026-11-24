import React from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { admissionYear } from "@/lib/brand";

/**
 * Closing CTA: one primary action, one phone line, no glow.
 */
export function CtaSection() {
  return (
    <section className="bg-navy py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium text-white/70">
              Admissions {admissionYear()}
            </p>
            <h2 className="mt-3 text-3xl font-medium leading-[1.1] tracking-[-0.01em] text-white sm:text-4xl">
              Start the file
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              Tell us your NEET score, budget and preferred country. We will
              send a shortlist and the document checklist.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
            <Link
              href="/contact-us"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gold px-5 text-sm font-medium text-brand-ink transition-colors hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              Talk to an admissions counsellor
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Link>
            <a
              href="tel:+79184826501"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              <Phone className="size-4" strokeWidth={1.5} />
              Call +7 918 482-65-01
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
