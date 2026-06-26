import React from "react";
import Image from "next/image";
import { brand } from "@/lib/brand";

/**
 * Full-viewport hero with background image, gradient overlay,
 * headline, subtext, and CTA buttons.
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden py-24">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Medical students walking across university campus"
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
          fill
          className="object-cover select-none"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,21,58,0.96) 0%, rgba(26,21,58,0.85) 60%, rgba(26,21,58,0.70) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <span
            className="mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            Established 2010
          </span>

          <h1 className="text-[clamp(2.5rem,5.5vw,4rem)] font-extrabold leading-[1.1] tracking-tight text-white">
            Your Trusted Bridge to{" "}
            <span style={{ color: brand.gold }}>Medical Excellence Abroad</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg text-white/80">
            WCIEC guides ambitious students to prestigious medical universities
            worldwide with absolute transparency, legal compliance, and
            personalized mentorship.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#story"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-95"
              style={{
                background: brand.gold,
                color: brand.ink,
                borderRadius: 8,
              }}
            >
              Our Story
            </a>
            <a
              href="tel:+996556611890"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition-all duration-200 hover:bg-white/10"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                borderRadius: 8,
              }}
            >
              Call Consultant
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
