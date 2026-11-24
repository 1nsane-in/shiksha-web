import Link from "next/link";
import Image from "next/image";

import { brand } from "@/lib/brand";
import { HERO_OG_BANNER } from "@/shared/api/constants";

// ponytail: no entrance animation — the LCP h1 must paint at FCP, not after JS hydration.
export function HeroCarousel() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* ─── Background Image ─── */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <Image
            src={HERO_OG_BANNER}
            alt="Medical students studying abroad"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      {/* ─── Gradient overlay ─── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, " +
            brand.ink +
            "dd 0%, " +
            brand.ink +
            "99 40%, transparent 100%)",
        }}
      />

      {/* ─── Content ─── */}
      <div className="absolute inset-0 z-10 flex items-center pb-8 pt-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <span
              className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium tracking-wide uppercase"
              style={{
                background: brand.goldLight,
                color: brand.gold,
                border: "1px solid " + brand.gold + "33",
              }}
            >
              Admissions Open 2026
            </span>

            {/* Headline */}
            <h1
              className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
              style={{ color: "#fff" }}
            >
              Your Future. Your World. Your Opportunity.
            </h1>

            {/* Subtitle */}
            <p
              className="mt-4 max-w-xl text-balance text-base leading-relaxed md:text-lg"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              Study Medicine Abroad with Shiksha International.
            </p>

            {/* Description */}
            <p
              className="mt-4 max-w-2xl text-balance text-base leading-relaxed md:text-lg"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Discover international medical universities, transparent admissions
              and complete student support from application to graduation and
              beyond.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: brand.gold,
                  color: brand.ink,
                  borderRadius: 10,
                }}
              >
                Start Your Application
              </Link>
              <Link
                href="#courses"
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  borderRadius: 10,
                  backdropFilter: "blur(4px)",
                }}
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
