"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";

/* ─── brand tokens (matching UniversityCards) ─── */
const theme = {
  canvas: "#FAF9F6",
  ink: "#1A153A",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.10)",
};

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=85",
    headline: "Your Gateway to Medical Education Abroad",
    subtitle:
      "Manage applications, documents, payments, and admission progress from one secure platform built for students, parents, agents, and admission teams.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=1920&q=85",
    headline: "World-Class Universities, One Platform",
    subtitle:
      "NMC, WHO, and ECFMG recognized medical programs across top universities with guided admission support at every stage.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=85",
    headline: "Your Journey, Simplified from Start to Finish",
    subtitle:
      "From application to visa support, track every step of your medical admission journey in one place with real-time updates.",
  },
];

/* ─── Ken Burns keyframes injected once ─── */
const kenBurnsStyleId = "sh-ken-burns";

function injectKenBurns() {
  if (typeof document === "undefined") return;
  if (document.getElementById(kenBurnsStyleId)) return;
  const style = document.createElement("style");
  style.id = kenBurnsStyleId;
  style.textContent = `
    @keyframes sh-ken-burns {
      0%   { transform: scale(1); }
      100% { transform: scale(1.08); }
    }
  `;
  document.head.appendChild(style);
}

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    injectKenBurns();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* ─── Background Image ─── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="absolute inset-0"
          >
            <div className="relative h-full w-full">
              <Image
                src={slides[current].image}
                alt=""
                fill
                priority
                unoptimized
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Gradient overlay ─── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, " +
            theme.ink +
            "dd 0%, " +
            theme.ink +
            "99 40%, transparent 100%)",
        }}
      />

      {/* ─── Content ─── */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={"content-" + current}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {/* Eyebrow */}
                <span
                  className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium tracking-wide uppercase"
                  style={{
                    background: theme.goldLight,
                    color: theme.gold,
                    border: "1px solid " + theme.gold + "33",
                  }}
                >
                  Admissions Open 2026
                </span>

                {/* Headline */}
                <h1
                  className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
                  style={{ color: "#fff" }}
                >
                  {slides[current].headline}
                </h1>

                {/* Subtitle */}
                <p
                  className="mt-4 max-w-xl text-balance text-base leading-relaxed md:text-lg"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {slides[current].subtitle}
                </p>

                {/* CTA */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
                    style={{
                      background: theme.gold,
                      color: theme.ink,
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
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Dots ─── */}
      <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            className="group relative h-2 transition-all duration-300"
            style={{
              width: index === current ? 28 : 8,
              borderRadius: 4,
              background:
                index === current ? theme.gold : "rgba(255,255,255,0.3)",
            }}
            aria-label={"Go to slide " + (index + 1)}
          />
        ))}
      </div>
    </section>
  );
}
