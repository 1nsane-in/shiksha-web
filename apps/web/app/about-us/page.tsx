import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import {
  Shield,
  Users,
  Heart,
  Plane,
  Home,
  ShieldCheck,
  FileCheck,
  ChevronRight,
  GraduationCap,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Shiksha - Medical Admission Platform",
  description:
    "WCIEC Organization is the most trusted overseas educational consultancy, guiding students to top medical universities abroad with integrity and excellence.",
};

const theme = {
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.10)",
  goldGlow: "rgba(196, 149, 59, 0.18)",
  canvas: "#FAF9F6",
  surface: "#FFFFFF",
  hairline: "rgba(26, 21, 58, 0.08)",
  purpleLight: "rgba(75, 45, 142, 0.06)",
};

const gradInk = "linear-gradient(135deg, " + theme.ink + " 0%, #2a2250 100%)";

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main>
        {/* ═══ HERO ═══ full-bleed, left-aligned, photo-backed */}
        <section className="relative grid min-h-[85vh] items-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <img
              alt="Medical students walking across a sunlit university campus"
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
              className="size-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, rgba(26,21,58,0.92) 0%, rgba(26,21,58,0.70) 50%, rgba(26,21,58,0.40) 100%)" }}
            />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-6 py-32 sm:px-8 lg:px-12">
            <div className="max-w-2xl">
              <p
                className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]"
                style={{ background: theme.goldLight, color: theme.gold }}
              >
                <span className="size-1.5 rounded-full" style={{ background: theme.gold }} />
                Established 2010
              </p>

              <h1
                className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.03em]"
                style={{ color: "#fff" }}
              >
                Your Trusted Bridge to{" "}
                <span style={{ color: theme.gold }}>Medical Excellence Abroad</span>
              </h1>

              <p
                className="mt-5 max-w-xl text-[clamp(1rem,1.8vw,1.125rem)] leading-relaxed"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                With 15 years of experience and 12,000+ successful admissions, WCIEC
                guides students to prestigious medical universities worldwide.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#story"
                  className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.97]"
                  style={{ background: theme.gold, color: theme.ink, borderRadius: 10 }}
                >
                  Explore Our Story
                  <ChevronRight className="size-4" />
                </a>
                <a
                  href="tel:+996556611890"
                  className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold transition-all duration-300"
                  style={{ border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: 10 }}
                >
                  Call +996 5566 11890
                </a>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <div className="flex animate-bounce flex-col items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              <span className="text-[10px] font-medium uppercase tracking-[0.15em]">Scroll</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </section>

        {/* ═══ STORY + IMPACT ═══ two-column, narrative-led */}
        <section id="story" className="py-24 sm:py-32" style={{ background: theme.canvas }}>
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
              <div>
                <p
                  className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: theme.gold }}
                >
                  <span className="inline-block size-1.5 rounded-full" style={{ background: theme.gold }} />
                  Who We Are
                </p>
                <h2
                  className="text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.12] tracking-[-0.03em]"
                  style={{ color: theme.ink }}
                >
                  More Than a Consultancy, A Trusted Guide
                </h2>
                <div className="mt-6 space-y-5 text-base leading-relaxed sm:text-lg" style={{ color: theme.inkMuted }}>
                  <p>
                    WCIEC Organization is the most trusted overseas educational consultancy. With quality
                    credentials and trustworthy service, we guide students to reach the best possible
                    academic heights based on their academic merit and financial capacity.
                  </p>
                  <p>
                    Committed to integrity and excellence, WCIEC is an acknowledged leader as an overseas
                    educational consultancy in India, Nepal, Bangladesh, UAE, and beyond.
                  </p>
                  <p>
                    We provide the best counselling and guidance to help you make the right decision with
                    confidence and clarity, removing queries and uncertainties that follow with career options.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl" style={{ background: gradInk }}>
                  <img
                    alt="Graduates celebrating with caps thrown in the air"
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c32b?auto=format&fit=crop&w=800&q=80"
                    className="w-full object-cover opacity-30"
                    style={{ aspectRatio: "4/5" }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: theme.gold }}>
                      Our Impact
                    </p>
                    <p className="mt-2 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none tracking-[-0.03em]" style={{ color: "#fff" }}>
                      <span style={{ color: theme.gold }}>4,500+</span>{" "}
                      <span className="text-lg font-normal sm:text-xl" style={{ color: "rgba(255,255,255,0.6)" }}>
                        students placed
                      </span>
                    </p>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                      in MCI and WHO recognized medical universities worldwide, growing every year.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ WHY CHOOSE WCIEC ═══ stepped layout, no card grid */}
        <section className="py-24 sm:py-32" style={{ background: theme.surface }}>
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <p
                className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: theme.gold }}
              >
                <span className="inline-block size-1.5 rounded-full" style={{ background: theme.gold }} />
                Why WCIEC
              </p>
              <h2
                className="text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.12] tracking-[-0.03em]"
                style={{ color: theme.ink }}
              >
                Everything You Need to Succeed
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg" style={{ color: theme.inkMuted }}>
                From your first counselling session to your final day on campus, we are with you
                every step of the way.
              </p>
            </div>

            <div className="mt-16 space-y-6">
              {[
                { num: "01", icon: Home, title: "Accommodation, Food & Fests", desc: "Authentic cuisine with native chefs, secure hostels, and vibrant student festivals that make you feel at home.", accent: theme.ink },
                { num: "02", icon: Heart, title: "Doing Good Scholarship Program", desc: "Merit-based scholarships for outstanding students. Over $100,000 awarded to deserving candidates.", accent: theme.gold },
                { num: "03", icon: BookOpen, title: "FMGE & Licensing Exam Coaching", desc: "Expert faculty, mock exams, and personalized coaching to help you ace your licensing exams with confidence.", accent: theme.ink },
                { num: "04", icon: Plane, title: "Visa & Travel Support", desc: "End-to-end visa processing, airport transfers, and travel guidance for a smooth transition abroad.", accent: theme.gold },
                { num: "05", icon: Shield, title: "24/7 Admission Support", desc: "Round-the-clock assistance with applications, document verification, and deadline management.", accent: theme.ink },
                { num: "06", icon: Users, title: "Consultancy & Advising", desc: "Personalized guidance based on your academic background, career goals, and financial capacity.", accent: theme.gold },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-5 rounded-2xl p-6 transition-all duration-300 sm:gap-7 sm:p-8"
                  style={{ background: i % 2 === 0 ? theme.canvas : "transparent", border: "1px solid " + (i % 2 === 0 ? theme.hairline : "transparent") }}
                >
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold tracking-tight sm:size-14 sm:text-xl"
                    style={{ background: item.accent === theme.gold ? theme.goldLight : theme.purpleLight, color: item.accent }}
                  >
                    {item.num}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <item.icon className="size-4 shrink-0" style={{ color: item.accent }} />
                      <h3 className="text-base font-bold sm:text-lg" style={{ color: theme.ink }}>
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed sm:text-base" style={{ color: theme.inkMuted }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PARTNER UNIVERSITIES ═══ clean visual directory */}
        <section className="py-24 sm:py-32" style={{ background: theme.canvas }}>
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <p
                className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: theme.gold }}
              >
                <span className="inline-block size-1.5 rounded-full" style={{ background: theme.gold }} />
                Our Network
              </p>
              <h2
                className="text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.12] tracking-[-0.03em]"
                style={{ color: theme.ink }}
              >
                Partner Medical Universities
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg" style={{ color: theme.inkMuted }}>
                We proudly serve students at these prestigious medical universities in Kyrgyzstan.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Jalal-Abad State University", flag: "KG" },
                { name: "Central Asian International Medical University", flag: "KG" },
                { name: "Osh International Medical University", flag: "KG" },
                { name: "Osh State University, International Medical Faculty", flag: "KG" },
                { name: "Jalal-Abad International Medical University", flag: "KG" },
              ].map((uni, i) => (
                <div
                  key={uni.name}
                  className="group flex items-center gap-4 rounded-xl p-5 transition-all duration-300"
                  style={{ background: theme.surface, border: "1px solid " + theme.hairline }}
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold tracking-tight"
                    style={{ background: theme.goldLight, color: theme.gold }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-snug sm:text-base" style={{ color: theme.ink }}>
                      {uni.name}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: theme.inkMuted }}>Kyrgyzstan</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ DOING GOOD FOUNDATION ═══ narrative with photo backdrop */}
        <section className="relative overflow-hidden py-24 sm:py-32" style={{ background: theme.ink }}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
            <img
              alt="Medical students studying together"
              src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1920&q=80"
              className="size-full object-cover"
            />
          </div>
          <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
            <div
              className="mx-auto mb-7 flex size-16 items-center justify-center rounded-full"
              style={{ background: theme.goldLight }}
            >
              <Heart className="size-7" style={{ color: theme.gold }} />
            </div>
            <p
              className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: theme.gold }}
            >
              <span className="inline-block size-1.5 rounded-full" style={{ background: theme.gold }} />
              Doing Good Charity Foundation
            </p>
            <h2
              className="text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.12] tracking-[-0.03em]"
              style={{ color: "#fff" }}
            >
              Empowering{" "}
              <span style={{ color: theme.gold }}>Tomorrow&apos;s Leaders</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "rgba(255,255,255,0.72)" }}>
              A heartfelt initiative by WCIEC Organization, dedicated to instilling the noble ethos
              of giving back within our student community. In collaboration with esteemed partners,
              Doing Good aims to cultivate a culture of philanthropy among aspiring medical professionals.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-8 sm:gap-16">
              <div className="text-center">
                <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none" style={{ color: theme.gold }}>
                  1,000+
                </p>
                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Students benefitted
                </p>
              </div>
              <div className="text-center">
                <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none" style={{ color: theme.gold }}>
                  $100k+
                </p>
                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Awarded in scholarships
                </p>
              </div>
              <div className="text-center">
                <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none" style={{ color: theme.gold }}>
                  5+
                </p>
                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Partner universities
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FULL SUPPORT ═══ two-card split, different treatments */}
        <section className="py-24 sm:py-32" style={{ background: theme.canvas }}>
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <p
                className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: theme.gold }}
              >
                <span className="inline-block size-1.5 rounded-full" style={{ background: theme.gold }} />
                Comprehensive Support
              </p>
              <h2
                className="text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.12] tracking-[-0.03em]"
                style={{ color: theme.ink }}
              >
                We Take Care of Everything
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg" style={{ color: theme.inkMuted }}>
                From exams and visas to housing and insurance, every detail is handled so you can focus
                on your studies.
              </p>
            </div>

            <div className="mt-14 grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl p-8 sm:p-10" style={{ background: theme.ink }}>
                <div className="flex size-12 items-center justify-center rounded-xl" style={{ background: theme.goldLight }}>
                  <GraduationCap className="size-6" style={{ color: theme.gold }} />
                </div>
                <h3 className="mt-5 text-xl font-bold sm:text-2xl" style={{ color: "#fff" }}>
                  Academic & Exam Support
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Our coaching program is designed by experienced educators well-versed in exam structure and content.
                  Interactive lectures, practice exams, and personalized feedback sessions ensure thorough preparation
                  for licensing exams.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Expert faculty with years of experience",
                    "Comprehensive study materials",
                    "Regular mock exams and assessments",
                    "Personalized feedback on performance",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                      <ChevronRight className="mt-0.5 size-4 shrink-0" style={{ color: theme.gold }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                {[
                  { icon: FileCheck, title: "Visa & Travel", desc: "Detailed information on visa requirements, documentation preparation, application filing, flight booking, and airport transfers." },
                  { icon: Home, title: "Housing & Daily Life", desc: "Secure hostels with 24/7 security, authentic Indian cuisine, and reliable transport between hostel and university." },
                  { icon: ShieldCheck, title: "Health & Insurance", desc: "Comprehensive health coverage and medical insurance to give you peace of mind throughout your studies." },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-xl p-5 sm:p-6"
                    style={{ background: theme.surface, border: "1px solid " + theme.hairline }}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg" style={{ background: theme.goldLight }}>
                      <item.icon className="size-5" style={{ color: theme.gold }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold sm:text-base" style={{ color: theme.ink }}>
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed" style={{ color: theme.inkMuted }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="py-24 sm:py-32" style={{ background: theme.surface }}>
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div
              className="relative overflow-hidden rounded-3xl p-10 text-center sm:p-16"
              style={{ background: gradInk }}
            >
              <div
                className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full opacity-[0.05]"
                style={{ background: theme.gold }}
              />
              <h2
                className="text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.12] tracking-[-0.03em]"
                style={{ color: "#fff" }}
              >
                Ready to Begin Your{" "}
                <span style={{ color: theme.gold }}>Medical Journey?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg" style={{ color: "rgba(255,255,255,0.72)" }}>
                Take the first step towards your dream of studying medicine abroad. Our team is here
                to guide you.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="tel:+996556611890"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold transition-all duration-300 active:scale-[0.97]"
                  style={{ background: theme.gold, color: theme.ink, borderRadius: 10 }}
                >
                  Call +996 5566 11890
                </a>
                <a
                  href="mailto:contact@wciecorganization.com"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold transition-all duration-300"
                  style={{ border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: 10 }}
                >
                  Email Us
                </a>
              </div>
              <p className="mt-6 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                Also reachable at: +91 9994 123 120 | +91 7845 823 549
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
