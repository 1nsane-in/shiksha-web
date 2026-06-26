import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { brand } from "@/lib/brand";
import {
  partnerUniversities,
  whyWciecItems,
  e2eServices,
  foundationStats,
  iconMap,
  type WhyWciecItem,
  type PartnerUniversity,
} from "@/lib/brand-data";
import { ShieldCheck, ChevronRight, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Metadata ─── */

export const metadata: Metadata = {
  title: "About Us | Shiksha Global — Trusted Medical Education Abroad",
  description:
    "WCIEC guides ambitious students to prestigious medical universities worldwide with absolute transparency, legal compliance, and personalized mentorship since 2010.",
  openGraph: {
    title: "About Shiksha Global | Medical Education Consultants",
    description:
      "12,000+ successful admissions. 100% legal & verified path to medical universities abroad.",
  },
};

/* ─── Sub-components (single responsibility) ─── */

function Eyebrow({ label }: { label: string }) {
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-[0.2em]"
      style={{ color: brand.gold }}
    >
      {label}
    </span>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold" style={{ color: brand.gold }}>
        {value}
      </p>
      <p className="text-[10px] opacity-60">{label}</p>
    </div>
  );
}

function WhyWciecCard({ icon, title, desc }: WhyWciecItem) {
  const Icon: LucideIcon = iconMap[icon] ?? GraduationCap;
  return (
    <div className="flex gap-5 p-6 rounded-xl transition-all hover:bg-[#FAF9F6] border border-transparent hover:border-gray-100">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: brand.goldLight, color: brand.gold }}
      >
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="font-bold text-base text-[#2D2154]">{title}</h3>
        <p
          className="mt-2 text-xs sm:text-sm leading-relaxed"
          style={{ color: brand.inkMuted }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

function UniversityCard({ name, location, index }: PartnerUniversity & { index: number }) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl p-5 bg-white border"
      style={{ borderColor: brand.hairline }}
    >
      <span className="text-xs font-bold text-gray-300">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <p className="text-xs sm:text-sm font-bold text-[#2D2154]">{name}</p>
        <p className="text-[10px] text-gray-400">{location}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function AboutUsPage() {
  return (
    <div className="min-h-screen" style={{ background: brand.canvas }}>
      <Header />
      <main>
        {/* ═══ HERO ═══ */}
        <HeroSection />

        {/* ═══ NARRATIVE STORY ═══ */}
        <StorySection />

        {/* ═══ WHY CHOOSE WCIEC ═══ */}
        <WhyWciecSection />

        {/* ═══ PARTNER UNIVERSITIES ═══ */}
        <PartnerSection />

        {/* ═══ CHARITY FOUNDATION ═══ */}
        <FoundationSection />

        {/* ═══ END-TO-END SERVICES ═══ */}
        <ServicesSection />

        {/* ═══ CALL TO ACTION ═══ */}
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

/* ═══════════════ Section Components ═══════════════ */

function HeroSection() {
  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden py-24">
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

function StorySection() {
  return (
    <section
      id="story"
      className="py-24 border-b"
      style={{ borderColor: brand.hairline }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <Eyebrow label="Who We Are" />
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: brand.ink }}
              >
                More Than a Consultancy, a Dedicated Life Guide
              </h2>
            </div>
            <div
              className="space-y-4 text-sm sm:text-base leading-relaxed"
              style={{ color: brand.inkMuted }}
            >
              <p>
                WCIEC Organization stands as a premier educational consultancy.
                Built on uncompromising transparency and reliable service, we
                guide medical aspirants toward world-class academic institutions
                based purely on merit and budget.
              </p>
              <p>
                Acknowledged as a legal leader across India, Nepal, Bangladesh,
                and the UAE, WCIEC provides continuous local support, bridging
                the distance between home and international universities.
              </p>
              <p>
                We provide professional advising to resolve queries and
                uncertainties, ensuring you proceed toward your future medical
                career with absolute clarity and complete safety.
              </p>
            </div>
          </div>

          <div
            className="lg:col-span-5 bg-white rounded-2xl p-8 border"
            style={{ borderColor: brand.hairline }}
          >
            <div className="space-y-6">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{ color: brand.gold }}
              >
                The Impact
              </span>
              <div className="space-y-1">
                <p
                  className="text-5xl font-black tracking-tight"
                  style={{ color: brand.gold }}
                >
                  12,000+
                </p>
                <p className="text-sm font-semibold" style={{ color: brand.ink }}>
                  Successful Admissions
                </p>
              </div>
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: brand.inkMuted }}
              >
                Placed in WHO and MCI recognized medical universities globally,
                establishing a legal, safe path for students from diverse
                backgrounds.
              </p>
              <div
                className="border-t pt-4"
                style={{ borderColor: brand.hairline }}
              >
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                  100% Legal & Verified Path
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyWciecSection() {
  return (
    <section
      className="py-24 bg-white border-b"
      style={{ borderColor: brand.hairline }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl mb-16">
          <Eyebrow label="Why WCIEC" />
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2"
            style={{ color: brand.ink }}
          >
            Comprehensive Ground Support
          </h2>
          <p
            className="text-sm sm:text-base mt-3"
            style={{ color: brand.inkMuted }}
          >
            Counselling is only step one. We maintain permanent on-ground
            offices near partner universities to secure your housing, meals, and
            safety daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {whyWciecItems.map((item) => (
            <WhyWciecCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerSection() {
  return (
    <section className="py-24" style={{ background: brand.canvas }}>
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl mb-12">
          <Eyebrow label="Our Directory" />
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2"
            style={{ color: brand.ink }}
          >
            Partner Medical Universities
          </h2>
          <p
            className="text-sm sm:text-base mt-2"
            style={{ color: brand.inkMuted }}
          >
            We work exclusively with legal, government-approved medical faculties
            offering WHO-listed courses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partnerUniversities.map((uni, i) => (
            <UniversityCard key={uni.name} {...uni} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FoundationSection() {
  return (
    <section className="py-24 text-white" style={{ background: brand.ink }}>
      <div className="mx-auto max-w-5xl px-6 text-center sm:px-8 lg:px-12">
        <div
          className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full"
          style={{ background: brand.goldLight }}
        >
          <HeartIcon />
        </div>
        <Eyebrow label="Doing Good Foundation" />
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
          Caring for Tomorrow&apos;s Doctors
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm leading-relaxed opacity-80">
          A charity program established by WCIEC to promote professional ethics
          and service within our students. We believe true medical excellence
          begins with empathy, so we fund local healthcare initiatives and
          provide medical scholarships to outstanding applicants.
        </p>

        <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-white/10 pt-8">
          {foundationStats.map((stat) => (
            <StatBadge key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section
      className="py-24 bg-white border-b"
      style={{ borderColor: brand.hairline }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Eyebrow label="End-to-End Guarantees" />
            <h2
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: brand.ink }}
            >
              Zero Bureaucracy, Pure Guidance
            </h2>
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: brand.inkMuted }}
            >
              We coordinate with embassies, prepare legal translations, and
              manage S3-compliant secure document vaults so your files are
              completely protected and immediately processed.
            </p>
            <div className="space-y-3">
              {e2eServices.map((service) => (
                <div
                  key={service}
                  className="flex gap-2 text-xs font-semibold text-gray-700"
                >
                  <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-[#FAF9F6] border rounded-2xl p-8 space-y-6"
            style={{ borderColor: brand.hairline }}
          >
            <h3 className="font-bold text-sm text-[#2D2154] uppercase tracking-wider">
              FMGE Exam Prep Coaching
            </h3>
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: brand.inkMuted }}
            >
              Every student gains access to structured exam coaching materials
              and licensing mock tests to clear major state licensing
              examinations with absolute ease.
            </p>
            <div
              className="rounded-lg bg-white p-4 border"
              style={{ borderColor: brand.hairline }}
            >
              <p className="text-xs italic text-gray-500">
                &quot;WCIEC provided incredible guidance during my visa phase,
                and the hostel staff ensured I had home-style Indian food from
                day one.&quot;
              </p>
              <p className="text-[10px] font-bold mt-2 text-[#2D2154]">
                - Medical Graduate, CAIMU
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <div
          className="rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: brand.ink }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Begin Your Journey Toward Medical Excellence
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-xs sm:text-sm opacity-80 text-white">
            Contact our consultants today to check your program eligibility and
            begin your international university application.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+996556611890"
              className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-[#1A153A] bg-white rounded-lg transition-all hover:bg-white/95"
            >
              Call +7 918 482-65-01
            </a>
            <a
              href="mailto:siksha.sabkaadhikaar@gmail.com"
              className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-white border border-white/20 rounded-lg transition-all hover:bg-white/10"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ Icon helper ═══════════════ */

function HeartIcon() {
  return (
    <svg
      className="size-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: brand.gold }}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
