"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatedHeading } from "./AnimatedHeading";
import { FadeIn } from "./FadeIn";

/* ─── Brand tokens ─── */
const theme = {
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.10)",
  canvas: "#FAF9F6",
  surface: "#FFFFFF",
};

const navLinks = [
  { name: "Students", href: "#" },
  { name: "Universities", href: "#" },
  { name: "Applications", href: "#" },
  { name: "Support", href: "#" },
];

/**
 * Curated Unsplash photos — medical/education themed.
 * Replace with your own CDN-hosted video or images when ready.
 */
const backgroundSlides = [
  {
    src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1920&q=85",
    alt: "Medical graduate in white coat",
  },
  {
    src: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=1920&q=85",
    alt: "Medical student with stethoscope",
  },
  {
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=85",
    alt: "Modern hospital corridor",
  },
  {
    src: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=85",
    alt: "University campus",
  },
  {
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=85",
    alt: "Doctor consulting patient",
  },
  {
    src: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=1920&q=85",
    alt: "Medical students studying",
  },
  {
    src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920&q=85",
    alt: "Medical education anatomy",
  },
  {
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=1920&q=85",
    alt: "Graduation ceremony caps",
  },
  {
    src: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&q=85",
    alt: "Medical laboratory research",
  },
  {
    src: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1920&q=85",
    alt: "Doctor with clipboard",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [btnHovered, setBtnHovered] = useState(false);
  const [fading, setFading] = useState(false);

  const goToNext = useCallback(() => {
    setFading(true);
    setPrevSlide(currentSlide);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length);
      setFading(false);
      setPrevSlide(null);
    }, 600);
  }, [currentSlide]);

  useEffect(() => {
    const timer = setInterval(goToNext, 7000);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#1A153A]">
      {/* ─── Rotating Background Images ─── */}
      <div className="absolute inset-0">
        {prevSlide !== null && (
          <div
            className="absolute inset-0 transition-opacity duration-[600ms]"
            style={{ opacity: fading ? 0 : 1 }}
          >
            <Image
              src={backgroundSlides[prevSlide].src}
              alt=""
              fill
              priority
              unoptimized
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
        <div
          className="absolute inset-0 transition-opacity duration-[1000ms]"
          style={{ opacity: 1 }}
        >
          <Image
            src={backgroundSlides[currentSlide].src}
            alt={backgroundSlides[currentSlide].alt}
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      {/* ─── Readability gradient ───
           A soft dark-to-transparent overlay that fans from the bottom-left corner
           toward the top-right. This ensures text stays legible on any background
           image without imposing a blanket dark filter over the whole viewport. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(26, 21, 58, 0.92) 0%,
              rgba(26, 21, 58, 0.60) 25%,
              rgba(26, 21, 58, 0.20) 50%,
              transparent 70%
            )
          `,
        }}
      />

      {/* ─── Content Stack ─── */}
      <div className="relative z-10 flex h-full flex-col">
        {/* ─── Navbar ─── */}
        <nav className="px-6 pt-6 md:px-12 lg:px-16">
          <div className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
            {/* Logo — using the existing Shiksha logo */}
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src="/img/shiksha-logo.png"
                alt="Shiksha"
                width={100}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[#C4953B]"
                    style={{ color: theme.inkMuted }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/register"
              className="rounded-lg px-6 py-2 text-sm font-medium transition-colors duration-200 hover:bg-[#FAF9F6]"
              style={{
                background: theme.surface,
                color: theme.ink,
              }}
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* ─── Hero Content (pushed to bottom) ─── */}
        <div className="flex flex-1 flex-col justify-end px-6 pb-12 md:px-12 lg:px-16 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end">
            {/* ─── Left Column ─── */}
            <div>
              {/* Heading — text-shadow ensures legibility on any bg */}
              <AnimatedHeading
                text="From application\n to white coat."
                className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl"
                charDelay={30}
                initialDelay={200}
                duration={500}
                letterSpacing="-0.04em"
                style={{
                  color: "#FAF9F6",
                  textShadow:
                    "0 2px 16px rgba(26,21,58,0.35), 0 1px 4px rgba(26,21,58,0.20)",
                }}
              />

              {/* Subheading */}
              <FadeIn delay={800} duration={1000}>
                <p
                  className="mb-5 max-w-prose text-base md:text-lg"
                  style={{ color: theme.canvas, opacity: 0.8 }}
                >
                  We simplify medical admissions so you can focus on what
                  matters &mdash; becoming a doctor.
                </p>
              </FadeIn>

              {/* Buttons */}
              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="rounded-lg px-8 py-3 font-medium transition-colors duration-200 hover:bg-[#FAF9F6]"
                    style={{
                      background: theme.surface,
                      color: theme.ink,
                    }}
                  >
                    Explore Programs
                  </Link>

                  <button
                    type="button"
                    className="rounded-lg border border-white/10 px-8 py-3 font-medium transition-all duration-300"
                    style={{
                      background: btnHovered
                        ? theme.gold
                        : "rgba(255,255,255,0.04)",
                      color: btnHovered ? theme.ink : theme.canvas,
                      backdropFilter: btnHovered ? "none" : "blur(6px)",
                      WebkitBackdropFilter: btnHovered
                        ? "none"
                        : "blur(6px)",
                    }}
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => setBtnHovered(false)}
                  >
                    Get Started
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* ─── Right Column — Tag Card ─── */}
            <FadeIn delay={1400} duration={1000}>
              <div className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end">
                <div className="liquid-glass rounded-xl border border-white/10 px-6 py-3">
                  <p
                    className="text-lg font-light md:text-xl lg:text-2xl"
                    style={{ color: theme.canvas }}
                  >
                    Admissions. Guidance. Excellence.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* ─── Slide indicators ─── */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
        {backgroundSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            className="rounded-full transition-all duration-500"
            style={{
              width: index === currentSlide ? 24 : 6,
              height: 6,
              background:
                index === currentSlide
                  ? theme.gold
                  : "rgba(255,255,255,0.25)",
            }}
            onClick={() => {
              setPrevSlide(currentSlide);
              setFading(true);
              setTimeout(() => {
                setCurrentSlide(index);
                setFading(false);
                setPrevSlide(null);
              }, 600);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
