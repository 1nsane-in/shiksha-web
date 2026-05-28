const fs = require("fs");
const path = "apps/web/app/about-us/page.tsx";

const sections = [];

// Imports
sections.push(`import type { Metadata } from "next";
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

export const metadata = {
  title: "About Us | Shiksha - Medical Admission Platform",
  description: "WCIEC Organization is the most trusted overseas educational consultancy, guiding students to top medical universities abroad.",
};

const theme = {
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.10)",
  canvas: "#FAF9F6",
  surface: "#FFFFFF",
  hairline: "rgba(26, 21, 58, 0.08)",
};

function Eyebrow({ children }) {
  return React.createElement("p", {
    className: "mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]",
    style: { color: theme.gold }
  }, React.createElement("span", {
    className: "inline-block size-1.5 rounded-full",
    style: { background: theme.gold }
  }), children);
}

function Heading({ children }) {
  return React.createElement("h2", {
    className: "text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl",
    style: { color: theme.ink, letterSpacing: "-0.03em" }
  }, children);
}

function Subtext({ children }) {
  return React.createElement("p", {
    className: "mt-4 max-w-2xl text-base leading-relaxed sm:text-lg",
    style: { color: theme.inkMuted }
  }, children);
}
`);

// Page component
sections.push(`
export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main>
`);

// Hero
sections.push(`
        <section className="relative overflow-hidden" style={{background:theme.ink}}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{background: \`radial-gradient(ellipse 80% 60% at 50% 0%, \${theme.gold} 0%, transparent 70%)\`}} />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]" style={{background:theme.goldLight,color:theme.gold}}>
                <Sparkles className="size-3" />Established 2010
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl" style={{color:"#fff",letterShg:"-0.03em"}}>
                Your Trusted Bridge to <span style={{color:theme.gold}}>Medical Excellence Abroad</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{color:"rgba(255,255,255,0.7)"}}>
                With over 15 years of experience and 12,000+ successful admissions, WCIEC Organization is the most trusted overseas educational consultancy.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#story" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.97]" style={{background:theme.gold,color:theme.ink,borderRadius:10}}>Our Story <ChevronRight className="size-4" /></a>
                <a href="tel:+996556611890" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.97]" style={{border:"1px solid rgba(255,255,255,0.2)",color:"#fff",borderRadius:10}}>Call Us</a>
              </div>
            </div>
          </div>
        </section>
`);

// Story section
sections.push(`
        <section id="story" className="py-20 sm:py-28" style={{background:theme.canvas}}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
              <div className="lg:col-span-3">
                <Eyebrow>Who We Are</Eyebrow>
                <Heading>More Than a Consultancy - A Trusted Guide</Heading>
                <div className="mt-6 space-y-4 text-base leading-relaxed sm:text-lg" style={{color:theme.inkMuted}}>
                  <p>WCIEC Organization is the most trusted overseas educational consultancy. With quality credentials and trustworthy service, we guide students to the best possible academic heights based on merit and financial capacity.</p>
                  <p>Committed to integrity and excellence in educational and career advice, WCIEC is an acknowledged leader as an overseas educational consultancy in India, Nepal, Bangladesh, UAE, and beyond.</p>
                  <p>We provide the best counselling and guidance to help you make the right decision, removing queries and uncertainties that follow with career options.</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-8 lg:col-span-2" style={{background:\`linear-gradient(135deg,\${theme.ink} 0%,#2a2250 100%)\`}}>
                <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-10" style={{background:theme.gold}} />
                <p className="text-sm font-semibold uppercase tracking-[0.12em]" style={{color:theme.gold}}>Our Impact</p>
                <p className="mt-6 text-5xl font-bold sm:text-6xl" style={{color:"#fff"}}><span style={{color:theme.gold}}>4,500+</span></p>
                <p className="mt-2 text-lg" style={{color:"rgba(255,255,255,0.7)"}}>Students placed in top universities worldwide.</p>
                <div className="mt-6 flex items-center gap-3 text-sm" style={{color:"rgba(255,255,255,0.5)"}}><Shield className="size-4" style={{color:theme.gold}} /> MCI &amp; WHO Recognized Universities</div>
              </div>
            </div>
          </div>
        </section>
`);

fs.writeFileSync(path, sections.join(""), "utf-8");
console.log("File written: " + fs.statSync(path).size + " bytes");
