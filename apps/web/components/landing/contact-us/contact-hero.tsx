import React from "react";
import Image from "next/image";
import { brand, admissionYear } from "@/lib/brand";

/**
 * Full-width hero banner for the contact-us page.
 * Dark overlay with bg image, badge, headline, and description.
 */
export function ContactHero() {
  return (
    <section className="relative pb-20 pt-32 overflow-hidden bg-[#1A153A] h-[50vh] flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <Image
          alt="Medical counseling consultation"
          src="https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1920&q=80"
          fill
          className="object-cover select-none"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1A153A]/95" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p
          className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]"
          style={{ background: brand.goldLight, color: brand.gold }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ background: brand.gold }}
          />
          Admissions open {admissionYear()}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          Get Free{" "}
          <span style={{ color: brand.gold }}>MBBS Abroad Consultation</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base text-gray-300 leading-relaxed">
          Have questions about medical studies abroad? Submit your details below
          to receive personalized matching with top international medical
          universities in Kyrgyzstan, Uzbekistan, Kazakhstan, and Russia.
        </p>
      </div>
    </section>
  );
}
