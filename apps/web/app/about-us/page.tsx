"use client";

import React from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import {
  Heart,
  Plane,
  Home,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  BookOpen,
} from "lucide-react";

const theme = {
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.08)",
  goldGlow: "rgba(196, 149, 59, 0.15)",
  canvas: "#FAF9F6",
  surface: "#FFFFFF",
  hairline: "rgba(26, 21, 58, 0.08)",
  purpleLight: "rgba(75, 45, 142, 0.05)",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen" style={{ background: theme.canvas }}>
      <Header />
      <main>
        {/* ═══ HERO ═══ minimal, high-end typography */}
        <section className="relative flex min-h-[75vh] items-center overflow-hidden py-24">
          <div className="absolute inset-0 z-0">
            <img
              alt="Medical students walking across university campus"
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
              className="size-full object-cover select-none"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(26,21,58,0.96) 0%, rgba(26,21,58,0.85) 60%, rgba(26,21,58,0.70) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <span
                className="mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]"
                style={{ background: theme.goldLight, color: theme.gold }}
              >
                Established 2010
              </span>

              <h1
                className="text-[clamp(2.5rem,5.5vw,4rem)] font-extrabold leading-[1.1] tracking-tight"
                style={{ color: "#fff" }}
              >
                Your Trusted Bridge to{" "}
                <span style={{ color: theme.gold }}>Medical Excellence Abroad</span>
              </h1>

              <p
                className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg opacity-80"
                style={{ color: "#fff" }}
              >
                WCIEC guides ambitious students to prestigious medical universities worldwide with absolute transparency, legal compliance, and personalized mentorship.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#story"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-95"
                  style={{
                    background: theme.gold,
                    color: theme.ink,
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

        {/* ═══ NARRATIVE STORY ═══ clean editorial columns */}
        <section id="story" className="py-24 border-b" style={{ borderColor: theme.hairline }}>
          <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.gold }}>
                    Who We Are
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                    style={{ color: theme.ink }}
                  >
                    More Than a Consultancy, a Dedicated Life Guide
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: theme.inkMuted }}>
                  <p>
                    WCIEC Organization stands as a premier educational consultancy. Built on uncompromising transparency and reliable service, we guide medical aspirants toward world-class academic institutions based purely on merit and budget.
                  </p>
                  <p>
                    Acknowledged as a legal leader across India, Nepal, Bangladesh, and the UAE, WCIEC provides continuous local support, bridging the distance between home and international universities.
                  </p>
                  <p>
                    We provide professional advising to resolve queries and uncertainties, ensuring you proceed toward your future medical career with absolute clarity and complete safety.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-2xl p-8 border" style={{ borderColor: theme.hairline }}>
                <div className="space-y-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: theme.gold }}>
                    The Impact
                  </span>
                  <div className="space-y-1">
                    <p className="text-5xl font-black tracking-tight" style={{ color: theme.gold }}>
                      12,000+
                    </p>
                    <p className="text-sm font-semibold" style={{ color: theme.ink }}>
                      Successful Admissions
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.inkMuted }}>
                    Placed in WHO and MCI recognized medical universities globally, establishing a legal, safe path for students from diverse backgrounds.
                  </p>
                  <div className="border-t pt-4" style={{ borderColor: theme.hairline }}>
                    <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                      100% Legal & Verified Path
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ WHY CHOOSE WCIEC ═══ editorial grid, no standard templates */}
        <section className="py-24 bg-white border-b" style={{ borderColor: theme.hairline }}>
          <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.gold }}>
                Why WCIEC
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2"
                style={{ color: theme.ink }}
              >
                Comprehensive Ground Support
              </h2>
              <p className="text-sm sm:text-base mt-3" style={{ color: theme.inkMuted }}>
                Counselling is only step one. We maintain permanent on-ground offices near partner universities to secure your housing, meals, and safety daily.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Home,
                  title: "Accommodation & Culinary Comforts",
                  desc: "Fully secure hostels managed by native personnel, featuring clean Indian dining, custom dietary options, and traditional festivals.",
                },
                {
                  icon: Heart,
                  title: "Doing Good Scholarship Program",
                  desc: "Merit-focused financial awards for high achievers, providing essential tuition assistance to ease family financial stress.",
                },
                {
                  icon: BookOpen,
                  title: "FMGE & NExT Coaching Support",
                  desc: "Integrated tutoring and regular evaluations designed by expert medical educators to prepare students for domestic licensing tests.",
                },
                {
                  icon: Plane,
                  title: "Visa, Logistics & Travel Support",
                  desc: "Direct flight arrangements, secure visa application processing, and immediate airport reception to campus.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-5 p-6 rounded-xl transition-all hover:bg-[#FAF9F6] border border-transparent hover:border-gray-100"
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: theme.goldLight, color: theme.gold }}
                  >
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2D2154]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed" style={{ color: theme.inkMuted }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PARTNER UNIVERSITIES ═══ minimal directory listing */}
        <section className="py-24" style={{ background: theme.canvas }}>
          <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
            <div className="max-w-2xl mb-12">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.gold }}>
                Our Directory
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2"
                style={{ color: theme.ink }}
              >
                Partner Medical Universities
              </h2>
              <p className="text-sm sm:text-base mt-2" style={{ color: theme.inkMuted }}>
                We work exclusively with legal, government-approved medical faculties offering WHO-listed courses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Jalal-Abad State University",
                "Central Asian International Medical University",
                "Osh International Medical University",
                "Osh State University (International Faculty)",
                "Jalal-Abad International Medical University",
              ].map((uni, i) => (
                <div
                  key={uni}
                  className="flex items-center gap-4 rounded-xl p-5 bg-white border"
                  style={{ borderColor: theme.hairline }}
                >
                  <span className="text-xs font-bold text-gray-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#2D2154]">
                      {uni}
                    </p>
                    <p className="text-[10px] text-gray-400">Kyrgyzstan</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CHARITY FOUNDATION ═══ warm background story */}
        <section className="py-24 text-white" style={{ background: theme.ink }}>
          <div className="mx-auto max-w-5xl px-6 text-center sm:px-8 lg:px-12">
            <div
              className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full"
              style={{ background: theme.goldLight }}
            >
              <Heart className="size-6 text-gold" style={{ color: theme.gold }} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.gold }}>
              Doing Good Foundation
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3"
              style={{ color: "#fff" }}
            >
              Caring for Tomorrow&apos;s Doctors
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm leading-relaxed opacity-80">
              A charity program established by WCIEC to promote professional ethics and service within our students. We believe true medical excellence begins with empathy, so we fund local healthcare initiatives and provide medical scholarships to outstanding applicants.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-bold" style={{ color: theme.gold }}>
                  1,000+
                </p>
                <p className="text-[10px] opacity-60">Beneficiaries</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: theme.gold }}>
                  $100k+
                </p>
                <p className="text-[10px] opacity-60">Scholarships</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: theme.gold }}>
                  5+
                </p>
                <p className="text-[10px] opacity-60">Institutions</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ COMPREHENSIVE SERVICE split section ═══ */}
        <section className="py-24 bg-white border-b" style={{ borderColor: theme.hairline }}>
          <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.gold }}>
                  End-to-End Guarantees
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#2D2154]">
                  Zero Bureaucracy, Pure Guidance
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.inkMuted }}>
                  We coordinate with embassies, prepare legal translations, and manage S3-compliant secure document vaults so your files are completely protected and immediately processed.
                </p>
                <div className="space-y-3">
                  {[
                    "Verified document translation and notarization",
                    "Direct liaison with medical state boards",
                    "Guaranteed visa approval support",
                    "Secure on-campus student counselors",
                  ].map((service) => (
                    <div key={service} className="flex gap-2 text-xs font-semibold text-gray-700">
                      <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FAF9F6] border rounded-2xl p-8 space-y-6" style={{ borderColor: theme.hairline }}>
                <h3 className="font-bold text-sm text-[#2D2154] uppercase tracking-wider">
                  FMGE Exam Prep Coaching
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.inkMuted }}>
                  Every student gains access to structured exam coaching materials and licensing mock mock tests to clear major state licensing examinations with absolute ease.
                </p>
                <div className="rounded-lg bg-white p-4 border" style={{ borderColor: theme.hairline }}>
                  <p className="text-xs italic text-gray-500">
                    &quot;WCIEC provided incredible guidance during my visa phase, and the hostel staff ensured I had home-style Indian food from day one.&quot;
                  </p>
                  <p className="text-[10px] font-bold mt-2 text-[#2D2154]">- Medical Graduate, CAIMU</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CALL TO ACTION ═══ */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
            <div
              className="rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
              style={{ background: theme.ink }}
            >
              <h2
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
              >
                Begin Your Journey Toward Medical Excellence
              </h2>
              <p className="mt-4 max-w-lg mx-auto text-xs sm:text-sm opacity-80 text-white">
                Contact our consultants today to check your program eligibility and begin your international university application.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="tel:+996556611890"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-[#1A153A] bg-white rounded-lg transition-all hover:bg-white/95"
                >
                  Call +996 5566 11890
                </a>
                <a
                  href="mailto:contact@wciecorganization.com"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-white border border-white/20 rounded-lg transition-all hover:bg-white/10"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
