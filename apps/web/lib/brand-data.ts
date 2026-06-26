/**
 * Shared data used across landing page components.
 * Extracted here so components stay DRY and data is centralised.
 */

/* ─── Navigation ─── */

export interface NavLink {
  name: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Our Universities", href: "/universities" },
  { name: "Gallery", href: "/gallery" },
  { name: "Online Payment", href: "#" },
  { name: "Courses", href: "#courses" },
  { name: "Contact Us", href: "/contact-us" },
];

/* ─── Why WCIEC (features) ─── */

export interface WhyWciecItem {
  icon: string; // lucide icon name
  title: string;
  desc: string;
}

export const whyWciecItems: WhyWciecItem[] = [
  {
    icon: "Home",
    title: "Accommodation & Culinary Comforts",
    desc: "Fully secure hostels managed by native personnel, featuring clean Indian dining, custom dietary options, and traditional festivals.",
  },
  {
    icon: "Heart",
    title: "Doing Good Scholarship Program",
    desc: "Merit-focused financial awards for high achievers, providing essential tuition assistance to ease family financial stress.",
  },
  {
    icon: "BookOpen",
    title: "FMGE & NExT Coaching Support",
    desc: "Integrated tutoring and regular evaluations designed by expert medical educators to prepare students for domestic licensing tests.",
  },
  {
    icon: "Plane",
    title: "Visa, Logistics & Travel Support",
    desc: "Direct flight arrangements, secure visa application processing, and immediate airport reception to campus.",
  },
];

/* ─── Partner Universities ─── */

export interface PartnerUniversity {
  name: string;
  location: string;
}

export const partnerUniversities: PartnerUniversity[] = [
  { name: "Jalal-Abad State University", location: "Kyrgyzstan" },
  { name: "Central Asian International Medical University", location: "Kyrgyzstan" },
  { name: "Osh International Medical University", location: "Kyrgyzstan" },
  { name: "Osh State University (International Faculty)", location: "Kyrgyzstan" },
  { name: "Jalal-Abad International Medical University", location: "Kyrgyzstan" },
];

/* ─── End-to-End Services ─── */

export const e2eServices: string[] = [
  "Verified document translation and notarization",
  "Direct liaison with medical state boards",
  "Guaranteed visa approval support",
  "Secure on-campus student counselors",
];

/* ─── Contact Info ─── */

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export const contactInfo: ContactInfo = {
  phone: "+7 918 482-65-01",
  email: "siksha.sabkaadhikaar@gmail.com",
  address: "Sector 62, Noida, NCR",
};

/* ─── Social Links ─── */

export interface SocialLink {
  name: string;
  href: string;
  /** Inline SVG path data (fill-rule="evenodd" compatible) */
  path: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
];

/* ─── Footer Quick Links ─── */

export const footerQuickLinks: NavLink[] = [
  { name: "Home Page", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "University Gallery", href: "/gallery" },
  { name: "Contact & Consultation", href: "/contact-us" },
];

/* ─── Foundation Stats ─── */

export interface Stat {
  value: string;
  label: string;
}

export const foundationStats: Stat[] = [
  { value: "1,000+", label: "Beneficiaries" },
  { value: "$100k+", label: "Scholarships" },
  { value: "5+", label: "Institutions" },
];

/* ─── Impact Stats ─── */

export const impactStats: Stat[] = [
  { value: "12,000+", label: "Successful Admissions" },
];

/* ─── Icon map (for dynamic icon rendering) ─── */

import {
  Heart,
  Plane,
  Home,
  ShieldCheck,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Heart,
  Plane,
  Home,
  ShieldCheck,
  BookOpen,
  GraduationCap,
} as const;
