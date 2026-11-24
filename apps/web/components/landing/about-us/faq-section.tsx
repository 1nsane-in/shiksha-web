import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { parentsFAQ } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";

function Answer({ answer }: { answer: string | string[] }) {
  if (typeof answer === "string") {
    return <p>{answer}</p>;
  }

  const [lead, ...items] = answer;

  return (
    <>
      <p>{lead}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-brand-ink-muted" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * Parents' questions as native details rows. No icon tiles, no custom ARIA.
 */
export function FAQSection() {
  return (
    <section className="border-b border-brand-hairline bg-white py-24">
      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Parents' questions"
          title="Questions families ask before the file opens"
          description="Safety, degree validity, fees and support, answered plainly"
        />

        <div className="border-t border-brand-hairline">
          {parentsFAQ.map((faq) => (
            <details
              key={faq.question}
              className="group border-b border-brand-hairline"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 pr-2 transition-colors hover:bg-ice-grey/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/30 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                <span className="text-base font-medium text-brand-ink">
                  {faq.question}
                </span>
                <ChevronDown
                  className="mt-0.5 size-4 shrink-0 text-brand-ink-muted transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={1.5}
                />
              </summary>
              <div className="pb-5 pr-10 text-sm leading-relaxed text-brand-ink-muted">
                <Answer answer={faq.answer} />
              </div>
            </details>
          ))}
        </div>

        <p className="mt-10 text-sm text-brand-ink-muted">
          Still have questions?{" "}
          <Link
            href="/contact-us"
            className="font-medium text-brand-ink underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/30 focus-visible:ring-offset-2"
          >
            Contact the admissions desk
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
