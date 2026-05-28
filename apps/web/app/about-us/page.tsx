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
  Stethoscope,
  Bus,
  ShieldCheck,
  FileCheck,
  Award,
  ChevronRight,
  Building2,
  Sparkles,
  BookOpen,
  UtensilsCrossed,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Shiksha - Medical Admission Platform",
  description: "WCIEC Organization is the most trusted overseas educational consultancy, guiding students to top medical universities abroad with integrity and excellence.",
};

const theme = {
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196,149,59,0.10)",
  canvas: "#FAF9F6",
  surface: "#FFFFFF",
  hairline: "rgba(26,21,58,0.08)",
};

const gradGoldRadial = "radial-gradient(ellipse 80% 60% at 50% 0%, " + theme.gold + " 0%, transparent 70%)";
const gradInk135 = "linear-gradient(135deg, " + theme.ink + " 0%, #2a2250 100%)";
const borderHairline = "1px solid " + theme.hairline;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return React.createElement("p", { className: "mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]", style: { color: theme.gold } }, React.createElement("span", { className: "inline-block size-1.5 rounded-full", style: { background: theme.gold } }), children);
}

function Heading({ children }: { children: React.ReactNode }) {
  return React.createElement("h2", { className: "text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl", style: { color: theme.ink, letterSpacing: "-0.03em" } }, children);
}

function Subtext({ children }: { children: React.ReactNode }) {
  return React.createElement("p", { className: "mt-4 max-w-2xl text-base leading-relaxed sm:text-lg", style: { color: theme.inkMuted } }, children);
}

export default function AboutUsPage() {
  const gp = { color: theme.gold };
  const white70 = { color: "rgba(255,255,255,0.7)" };
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden" style={{ background: theme.ink }}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ background: gradGoldRadial }} />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]" style={{ background: theme.goldLight, color: theme.gold }}>
                <Sparkles className="size-3" />Established 2010
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl" style={{ color: "#fff", letterSpacing: "-0.03em" }}>
                Your Trusted Bridge to <span style={gp}>Medical Excellence Abroad</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={white70}>
                With over 15 years of experience and 12,000+ successful admissions, WCIEC Organization is the most trusted overseas educational consultancy guiding students to prestigious medical universities worldwide.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#story" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.97]" style={{ background: theme.gold, color: theme.ink, borderRadius: 10 }}>Our Story <ChevronRight className="size-4" /></a>
                <a href="tel:+996556611890" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.97]" style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 10 }}>Call Us</a>
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="py-20 sm:py-28" style={{ background: theme.canvas }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
              <div className="lg:col-span-3">
                <Eyebrow>Who We Are</Eyebrow>
                <Heading>More Than a Consultancy - A Trusted Guide</Heading>
                <div className="mt-6 space-y-4 text-base leading-relaxed sm:text-lg" style={{ color: theme.inkMuted }}>
                  <p>WCIEC Organization is the most trusted overseas educational consultancy. With quality credentials and trustworthy service, we guide students to reach the best possible academic heights based on merit and financial capacity.</p>
                  <p>Committed to integrity and excellence, WCIEC is an acknowledged leader as an overseas educational consultancy in India, Nepal, Bangladesh, UAE, and beyond.</p>
                  <p>We provide the best counselling and guidance to help you make the right decision with confidence and clarity.</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-8 lg:col-span-2" style={{ background: gradInk135 }}>
                <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-10" style={{ background: theme.gold }} />
                <p className="text-sm font-semibold uppercase tracking-[0.12em]" style={gp}>Our Impact</p>
                <p className="mt-6 text-5xl font-bold sm:text-6xl" style={{ color: "#fff" }}><span style={gp}>4,500+</span></p>
                <p className="mt-2 text-lg" style={white70}>Students placed in top universities worldwide.</p>
                <div className="mt-6 flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}><Shield className="size-4" style={gp} /> MCI &amp; WHO Recognized Universities</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24" style={{ background: theme.ink }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Eyebrow>Milestones</Eyebrow>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl" style={{ color: "#fff", letterSpacing: "-0.03em" }}>Milestones <span style={gp}>We've Achieved</span></h2>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {[{ n: "15+", l: "Years of Experience", I: Award }, { n: "12k+", l: "Admissions", I: Users }, { n: "Top Govt.", l: "Universities of Kyrgyzstan", I: Building2 }, { n: "MCI & WHO", l: "Recognized Universities", I: FileCheck }].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl sm:size-16" style={{ background: theme.goldLight }}><s.I className="size-6 sm:size-7" style={gp} /></div>
                  <p className="mt-4 text-3xl font-bold sm:text-4xl" style={gp}>{s.n}</p>
                  <p className="mt-1 text-sm leading-snug sm:text-base" style={{ color: "rgba(255,255,255,0.65)" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28" style={{ background: theme.canvas }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Eyebrow>Why Choose WCIEC</Eyebrow>
              <Heading>Everything You Need to Succeed</Heading>
              <Subtext>From your first counselling session to your final day on campus, we're with you every step of the way.</Subtext>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[{ I: Home, t: "Accommodation, Food & Fests", d: "Authentic cuisine with native chefs, secure hostels, and vibrant student festivals." }, { I: Heart, t: "Doing Good - Scholarship Program", d: "Merit-based scholarships for outstanding students. Over $100,000 awarded." }, { I: BookOpen, t: "FMGE / Licensing Exam Coaching", d: "Expert faculty, mock exams, and personalized coaching for exam success." }, { I: Plane, t: "Visa & Travel Support", d: "End-to-end visa processing, airport transfers, and travel guidance." }, { I: Shield, t: "24/7 Admission Support", d: "Round-the-clock assistance with applications, documents, and deadlines." }, { I: Users, t: "Consultancy & Advising", d: "Personalized guidance based on your academic background and career goals." }].map((item) => (
                <div key={item.t} className="group rounded-2xl p-6 transition-all duration-300 sm:p-7 hover:-translate-y-0.5" style={{ background: theme.surface, border: borderHairline }}>
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl" style={{ background: theme.goldLight }}><item.I className="size-5" style={gp} /></div>
                  <h3 className="text-base font-bold sm:text-lg" style={{ color: theme.ink }}>{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.inkMuted }}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24" style={{ background: theme.surface }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Eyebrow>Our Network</Eyebrow>
              <Heading>Partner Medical Universities</Heading>
              <Subtext>We are proud to offer student services at prestigious medical universities in Kyrgyzstan.</Subtext>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {["Jalal-Abad State University", "Central Asian International Medical University", "Osh International Medical University", "Osh State University - International Medical Faculty", "Jalal-Abad International Medical University"].map((u, i) => (
                <div key={u} className="flex items-center gap-4 rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5" style={{ background: theme.canvas, border: borderHairline }}>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold" style={{ background: theme.goldLight, color: theme.gold }}>{String(i + 1).padStart(2, "0")}</div>
                  <p className="text-sm font-medium leading-snug sm:text-base" style={{ color: theme.ink }}>{u}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28" style={{ background: theme.canvas }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Eyebrow>Student Services</Eyebrow>
              <Heading>We Take Care of Everything</Heading>
              <Subtext>A wide range of services for a smooth student experience from arrival to graduation.</Subtext>
            </div>
            <div className="mt-14 space-y-6">
              {[{ I: Home, t: "Hostel Services", d: "Secure, well-equipped hostels with 24/7 security and clean facilities.", c: "#4B2D8E" }, { I: UtensilsCrossed, t: "Mess Services (Indian Food)", d: "Authentic Indian cuisine prepared by native chefs. Fresh, hygienic meals.", c: "#C4953B" }, { I: FileCheck, t: "Visa Extension Services", d: "We manage the entire visa renewal process so you can focus on your studies.", c: "#4B2D8E" }, { I: Bus, t: "Transportation Services", d: "Reliable transport between hostel, university, and other locations.", c: "#C4953B" }, { I: ShieldCheck, t: "Medical Insurance", d: "Comprehensive health coverage for peace of mind in case of illness or emergency.", c: "#4B2D8E" }, { I: Stethoscope, t: "FMGE Coaching Services", d: "Specialized coaching with expert faculty for the Foreign Medical Graduate Examination.", c: "#C4953B" }].map((s) => (
                <div key={s.t} className="flex flex-col gap-6 rounded-2xl p-6 sm:flex-row sm:items-start sm:p-8" style={{ background: theme.surface, border: borderHairline }}>
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl sm:size-14" style={{ background: theme.goldLight }}><s.I className="size-6" style={{ color: s.c }} /></div>
                  <div>
                    <h3 className="text-lg font-bold sm:text-xl" style={{ color: theme.ink }}>{s.t}</h3>
                    <p className="mt-2 leading-relaxed" style={{ color: theme.inkMuted }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28" style={{ background: theme.ink }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full" style={{ background: theme.goldLight }}><Heart className="size-7" style={gp} /></div>
              <Eyebrow>Doing Good Charity Foundation</Eyebrow>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl" style={{ color: "#fff", letterSpacing: "-0.03em" }}>Empowering <span style={gp}>Tomorrow's Leaders</span></h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed sm:text-lg" style={white70}>A heartfelt initiative by WCIEC Organization dedicated to cultivating a culture of philanthropy among aspiring medical professionals.</p>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              <div className="rounded-2xl p-6 text-center sm:p-8" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-4xl font-bold sm:text-5xl" style={gp}>1,000+</p>
                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Students benefitted</p>
              </div>
              <div className="rounded-2xl p-6 text-center sm:p-8" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-4xl font-bold sm:text-5xl" style={gp}>$100k+</p>
                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Awarded in scholarships</p>
              </div>
              <div className="rounded-2xl p-6 text-center sm:p-8" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-4xl font-bold sm:text-5xl" style={gp}>5+</p>
                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Partner universities</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28" style={{ background: theme.canvas }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Eyebrow>Exam Preparation</Eyebrow>
                <Heading>Licensing Exam Mastery</Heading>
                <div className="mt-6 space-y-4" style={{ color: theme.inkMuted }}>
                  <p className="leading-relaxed">We offer comprehensive coaching classes tailored to help students excel in licensing exams.</p>
                  <p className="leading-relaxed">Expert faculty, practice exams, personalized feedback, and effective test-taking strategies.</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-8 sm:p-10" style={{ background: gradInk135 }}>
                <div className="pointer-events-none absolute -bottom-10 -right-10 size-60 rounded-full opacity-[0.06]" style={{ background: theme.gold }} />
                <h3 className="text-lg font-bold sm:text-xl" style={gp}>Our Coaching Includes</h3>
                <ul className="mt-5 space-y-3">
                  {["Expert faculty", "Comprehensive study materials", "Regular mock exams", "Personalized feedback", "Student-centered approach", "Supportive environment"].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.8)" }}>
                      <ChevronRight className="mt-0.5 size-4 shrink-0" style={gp} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28" style={{ background: theme.surface }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>Visa & Travel</Eyebrow>
              <Heading>Seamless Transition</Heading>
              <Subtext>We make the visa process and travel arrangements effortless for international students.</Subtext>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {[{ I: FileCheck, t: "Visa Assistance", d: "Documentation, application filing, and appointment scheduling." }, { I: Plane, t: "Travel Guidance", d: "Flight booking, airport transfers, and pre-departure preparations." }, { I: ShieldCheck, t: "Ongoing Support", d: "Airport pickup, cultural adaptation, and health insurance." }].map((item) => (
                <div key={item.t} className="rounded-2xl p-6 sm:p-7" style={{ background: theme.canvas, border: borderHairline }}>
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl" style={{ background: theme.goldLight }}><item.I className="size-5" style={gp} /></div>
                  <h3 className="text-base font-bold sm:text-lg" style={{ color: theme.ink }}>{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.inkMuted }}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28" style={{ background: theme.canvas }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl p-8 text-center sm:p-16" style={{ background: gradInk135 }}>
              <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full opacity-[0.05]" style={{ background: theme.gold }} />
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl" style={{ color: "#fff", letterSpacing: "-0.03em" }}>Ready to Begin Your <span style={gp}>Medical Journey?</span></h2>
              <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg" style={white70}>Take the first step towards your dream of studying medicine abroad.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href="tel:+996556611890" className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold transition-all duration-300 active:scale-[0.97]" style={{ background: theme.gold, color: theme.ink, borderRadius: 10 }}>Call +996 5566 11890</a>
                <a href="mailto:contact@wciecorganization.com" className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold transition-all duration-300 active:scale-[0.97]" style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 10 }}>Email Us</a>
              </div>
              <p className="mt-6 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Also: +91 9994 123 120 | +91 7845 823 549</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
