"use client";

import React, { useState } from "react";
import { brand } from "@/lib/brand";
import { parentsFAQ } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";
import { ChevronDown, HelpCircle } from "lucide-react";

/**
 * Parents FAQ section with accordion-style questions and answers.
 */
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="py-24 border-b"
      style={{ borderColor: brand.hairline, background: brand.canvas }}
    >
      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Parents FAQ"
          title="Frequently Asked Questions"
          description="Common questions from parents about safety, degree validity, fees, and student support."
        />

        <div className="space-y-4">
          {parentsFAQ.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden transition-all duration-200"
              style={{
                background: brand.surface,
                borderColor: brand.hairline,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex size-10 items-center justify-center rounded-lg shrink-0"
                    style={{ background: brand.goldLight }}
                  >
                    <HelpCircle
                      className="size-5"
                      style={{ color: brand.gold }}
                    />
                  </div>
                  <span
                    className="font-semibold text-base"
                    style={{ color: brand.ink }}
                  >
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`size-5 shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  style={{ color: brand.inkMuted }}
                />
              </button>

              {openIndex === i && (
                <div
                  className="px-6 pb-6 pt-0"
                  style={{ borderTop: "1px solid " + brand.hairline }}
                >
                  <div className="pt-4 pl-14">
                    {Array.isArray(faq.answer) ? (
                      <ul className="space-y-2">
                          {/* ponytail: inline style for gold bullets */}
                          {faq.answer.map((item, j) =>
                            j === 0 ? (
                              <p
                                key={j}
                                className="text-sm leading-relaxed"
                                style={{ color: brand.inkMuted }}
                              >
                                {item}
                              </p>
                            ) : (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm"
                                style={{ color: brand.inkMuted }}
                              >
                                <span
                                  className="mt-1.5 size-1.5 rounded-full shrink-0"
                                  style={{ background: brand.gold }}
                                />
                                {item}
                              </li>
                            )
                          )}
                        </ul>
                    ) : (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: brand.inkMuted }}
                      >
                        {faq.answer}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm" style={{ color: brand.inkMuted }}>
            Still have questions?{" "}
            <a
              href="/contact-us"
              className="font-semibold hover:underline"
              style={{ color: brand.gold }}
            >
              Contact our team
            </a>{" "}
            for personalized assistance.
          </p>
        </div>
      </div>
    </section>
  );
}
