import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { admissions2026Benefits } from "@/lib/brand-data";
import { admissionYear } from "@/lib/brand";
import { SectionHeader } from "@/components/landing/about-us/section-header";

/**
 * Early application benefits as a numbered strip, not a five-card grid.
 */
export function Admissions2026Section() {
  return (
    <section className="border-b border-brand-hairline bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow={`Applications ${admissionYear()}`}
          title="What changes when you start early"
          description="Five parts of the process that are easier to control when the file starts early"
        />

        <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {admissions2026Benefits.map((benefit, i) => (
            <li key={benefit.title} className="border-t border-brand-hairline pt-5">
              <p className="text-xs font-medium tabular-nums text-brand-ink-muted">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-base font-medium text-brand-ink">
                {benefit.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-brand-ink-muted">
                {benefit.description}
              </p>
            </li>
          ))}
        </ol>

        <Link
          href="#partner-register"
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-brand-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/30 focus-visible:ring-offset-2"
        >
          Browse the university register
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
