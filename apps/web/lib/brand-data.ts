/**
 * Shared data used across landing page components.
 * Extracted here so components stay DRY and data is centralised.
 * Updated with Shiksha International brand info.
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
  // ponytail: hidden until payment/courses features ready
  // { name: "Online Payment", href: "#" },
  // { name: "Courses", href: "#courses" },
  { name: "Contact Us", href: "/contact-us" },
];

/* ─── Why Shiksha (features) ─── */

export interface WhyShikshaItem {
  icon: string; // lucide icon name
  title: string;
  desc: string;
}

export const whyShikshaItems: WhyShikshaItem[] = [
  {
    icon: "Building2",
    title: "Official University Collaborations",
    desc: "Direct partnerships with government-approved medical universities across Kyrgyzstan, Uzbekistan, Kazakhstan & Russia.",
  },
  {
    icon: "ScrollText",
    title: "Transparent & Legal Admission Process",
    desc: "Full fee disclosure before admission. No hidden charges, no donation or capitation fees — only official university fees.",
  },
  {
    icon: "Plane",
    title: "Visa & Travel Assistance",
    desc: "Direct flight arrangements, secure visa application processing, and on-ground reception at partner universities.",
  },
  {
    icon: "Globe",
    title: "On-Ground International Support",
    desc: "Local representatives and university support teams provide continuous assistance with housing, meals, and safety.",
  },
  {
    icon: "Users",
    title: "Parent-Oriented Guidance",
    desc: "Regular updates and transparent communication with families. Secure hostels with CCTV and Indian mess facilities.",
  },
  {
    icon: "BookOpen",
    title: "FMGE/NEXT Academic Support",
    desc: "Free FMGE/NEXT coaching, subject-wise classes, annual revision programs, mock tests, and clinical case discussions.",
  },
];

/* ─── Partner Universities ─── */

export interface PartnerUniversity {
  name: string;
  location: string;
  country: "Kyrgyzstan" | "Uzbekistan" | "Kazakhstan" | "Russia";
  established?: string;
  studentStrength?: string;
  features: string[];
  highlights?: string[];
  recognitions?: string[];
  approvals?: string[];
  tuition?: string;
  duration?: string;
  specialFocus?: string[];
  academicStructure?: string;
  /** Logo image filename in /img/universities/ */
  logo?: string;
}

const LOGO_DIR = "/img/universities";

export const partnerUniversities: PartnerUniversity[] = [
  // ─── Russia (8) ───
  {
    name: "Sevastopol State University (SevSU)",
    location: "Sevastopol, Russia",
    country: "Russia",
    logo: "sevastopol-state-university.png",
    established: "2014",
    tuition: "287,500 RUB/year",
    duration: "6 Years",
    features: ["Government Federal University", "Modern simulation laboratories", "English-medium MBBS"],
    approvals: ["NMC Approved", "WHO Approved"],
    highlights: ["Affordable tuition", "Modern campus infrastructure", "Research-oriented programs"],
    specialFocus: ["Maritime Studies", "Nuclear Energy", "Technical Research", "Underwater Archaeology", "Digital Cultural Heritage"],
  },
  {
    name: "Kemerovo State Medical University",
    location: "Kemerovo, Russia",
    country: "Russia",
    logo: "kemerovo-state-medical.svg",
    established: "1974",
    studentStrength: "21,000+",
    tuition: "335,000 RUB/year",
    duration: "6 Years",
    features: ["Government Medical University", "Multi-specialty hospital training", "Strong academic reputation"],
    approvals: ["NMC Approved", "WHO Approved"],
    highlights: ["English-medium MBBS", "Advanced clinical training", "Modern laboratories"],
  },
  {
    name: "North Caucasus Federal University (Stavropol)",
    location: "Stavropol, Russia",
    country: "Russia",
    logo: "north-caucasus-federal.svg",
    tuition: "300,000 RUB/year",
    duration: "6 Years",
    features: ["Federal University", "English-medium programs", "Modern research facilities"],
    approvals: ["NMC Approved"],
    highlights: ["Strategic location in Southern Russia", "Multi-disciplinary campus", "Affordable education"],
  },
  {
    name: "Nevinnomyssk Medical Institute",
    location: "Nevinnomyssk, Russia",
    country: "Russia",
    logo: "nevinnomyssk-medical.png",
    tuition: "270,000 RUB/year",
    duration: "6 Years",
    features: ["Specialized Medical Institute", "Affordable tuition", "Hands-on clinical training"],
    approvals: ["NMC Approved"],
    highlights: ["Budget-friendly fees", "Focused medical education", "Small batch sizes"],
  },
  {
    name: "Kirov State Medical University (KSMU)",
    location: "Kirov, Russia",
    country: "Russia",
    logo: "kirov-state-medical.png",
    established: "1987",
    studentStrength: "4,000+",
    tuition: "350,000 RUB/year",
    duration: "6 Years",
    features: ["Government Medical University", "Research-oriented education", "Strong Indian student community"],
    approvals: ["NMC Approved", "WHO Approved"],
    highlights: ["English-medium MBBS", "Modern technology-based labs", "Dedicated clinic", "Safe environment"],
  },
  {
    name: "Kazan State Medical University",
    location: "Kazan, Russia",
    country: "Russia",
    logo: "kazan-state-medical.png",
    established: "1814",
    tuition: "636,000 RUB/year",
    duration: "6 Years",
    features: ["One of Russia's oldest medical universities", "High academic standards", "Advanced research facilities"],
    approvals: ["NMC Approved", "WHO Approved"],
    highlights: ["Prestigious medical degree", "Strong clinical exposure", "International student community"],
  },
  {
    name: "Saint Petersburg Medical Social Institute",
    location: "Saint Petersburg, Russia",
    country: "Russia",
    logo: "saint-petersburg-medical.png",
    tuition: "460,000 RUB/year",
    duration: "6 Years",
    features: ["Located in cultural capital of Russia", "English-medium MBBS", "Modern teaching methods"],
    approvals: ["NMC Approved"],
    highlights: ["Excellent clinical training", "Cultural hub for students", "Well-equipped laboratories"],
  },
  {
    name: "Maikop State Technology University",
    location: "Maykop, Russia",
    country: "Russia",
    logo: "maikop-state-technology.png",
    tuition: "350,000 RUB/year",
    duration: "6 Years",
    features: ["Government University", "English-medium MBBS", "Affordable tuition", "Personalized academic support"],
    recognitions: ["Formerly Maykop State Medical Institute"],
    approvals: ["NMC Approved"],
    highlights: ["NMC Approved", "English-medium curriculum", "Strong clinical practice", "Modern infrastructure"],
  },
  // ─── Kyrgyzstan (4) ───
  {
    name: "Jalal-Abad State University",
    location: "Jalal-Abad, Kyrgyzstan",
    country: "Kyrgyzstan",
    logo: "jalalabad-state-university.png",
    duration: "6 Years",
    features: ["Government University", "Recognized Medical Faculty", "Budget-Friendly Fees"],
    highlights: ["Popular among Indian students", "English-medium instruction", "Globally recognized"],
  },
  {
    name: "Bishkek International Medical Institute (BIMI)",
    location: "Bishkek, Kyrgyzstan",
    country: "Kyrgyzstan",
    logo: "bishkek-international-medical.png",
    duration: "6 Years",
    features: ["English-medium MBBS", "Modern laboratories", "Affordable tuition", "Large Indian student community"],
    highlights: ["Focused on international students", "Affordable MBBS education"],
  },
  {
    name: "Jalalabad International University",
    location: "Jalalabad, Kyrgyzstan",
    country: "Kyrgyzstan",
    logo: "jalalabad-international.png",
    duration: "6 Years",
    recognitions: ["Ministry of Health & Science Education, Kyrgyzstan", "NMC Approved", "WDOMS Listed"],
    features: ["Modern infrastructure", "Updated medical curriculum"],
  },
  {
    name: "Osh State University",
    location: "Osh, Kyrgyzstan",
    country: "Kyrgyzstan",
    logo: "osh-state-university.png",
    established: "1939",
    studentStrength: "40,000+",
    duration: "6 Years",
    academicStructure: "18 Departments, 6 Colleges",
    features: ["Modern infrastructure", "Updated medical curriculum", "English-medium MBBS"],
  },
  // ─── Uzbekistan (1) ───
  {
    name: "Andijan State Medical Institute (ASMI)",
    location: "Andijan, Uzbekistan",
    country: "Uzbekistan",
    logo: "andijan-state-medical.png",
    established: "1955",
    tuition: "3,500 USD/year",
    duration: "6 Years",
    features: ["Government Medical Institute", "English-medium MBBS", "Advanced laboratory facilities", "Strong hospital training", "Growing international recognition"],
  },
  // ─── Kazakhstan (1) ───
  {
    name: "North Kazakhstan State Medical University (M. Kozybayev NKSU)",
    location: "Petropavl, Kazakhstan",
    country: "Kazakhstan",
    logo: "north-kazakhstan-medical.png",
    established: "1937",
    duration: "6 Years",
    features: ["Government University", "English-medium MBBS", "Advanced laboratories", "Strong hospital training", "Safe on-campus accommodation"],
    approvals: ["NMC Approved", "WHO Approved"],
    highlights: ["Affordable tuition", "Modern infrastructure", "Multidisciplinary programs"],
  },
];

/* ─── End-to-End Services ─── */

export const e2eServices: string[] = [
  "Verified document translation and notarization",
  "Direct liaison with medical state boards",
  "Guaranteed visa approval support",
  "Secure on-campus student counselors",
  "Free FMGE/NEXT coaching included",
];

/* ─── Contact Info ─── */

export interface ContactInfo {
  phone: string;
  phoneSecondary?: string;
  email: string;
  address: string;
}

export const contactInfo: ContactInfo = {
  phone: "+7 918 482-65-01",
  phoneSecondary: "+91 88264 27297",
  email: "info@shiksha.study",
  address: "India Office & International Support Offices",
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
  { value: "70%", label: "Scholarship Available" },
  { value: "4+", label: "Countries" },
  { value: "14+", label: "Partner Universities" },
];

/* ─── Impact Stats ─── */

export const impactStats: Stat[] = [
  { value: "12,000+", label: "Successful Admissions" },
];

/* ─── Why Study MBBS Abroad Benefits ─── */

export interface MBBSBenefit {
  title: string;
  description: string;
  icon: string;
}

export const mbbsBenefits: MBBSBenefit[] = [
  {
    icon: "Wallet",
    title: "Affordable Tuition Fees",
    description: "Cheaper than many private medical colleges in India.",
  },
  {
    icon: "Ban",
    title: "No Donation or Capitation Fees",
    description: "Students only pay official university fees. No hidden charges.",
  },
  {
    icon: "Languages",
    title: "English-Medium Programs",
    description: "Courses taught fully in English for international students.",
  },
  {
    icon: "Globe",
    title: "Globally Recognized Degrees",
    description: "Eligible for FMGE, NEXT, USMLE, PLAB exams worldwide.",
  },
  {
    icon: "Microscope",
    title: "Modern Laboratories & Hospitals",
    description: "Access to simulation centers, modern labs, and affiliated hospitals.",
  },
  {
    icon: "Stethoscope",
    title: "Strong Clinical Exposure",
    description: "Hands-on patient interaction and hospital training from early years.",
  },
  {
    icon: "Users",
    title: "International Learning Environment",
    description: "Exposure to students from various countries and cultures.",
  },
  {
    icon: "BookOpen",
    title: "FMGE/NEXT Preparation",
    description: "Includes coaching, mock tests, and revision programs.",
  },
];

import {
  Heart,
  Plane,
  Home,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Building2,
  ScrollText,
  Globe,
  Users,
  Wallet,
  Ban,
  Languages,
  Microscope,
  Stethoscope,
  Rocket,
  Award,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Heart,
  Plane,
  Home,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Building2,
  ScrollText,
  Globe,
  Users,
  Wallet,
  Ban,
  Languages,
  Microscope,
  Stethoscope,
  Rocket,
  Award,
} as const;

/* ─── Parents FAQ Data ─── */

export interface FAQItem {
  question: string;
  answer: string | string[];
}

export const parentsFAQ: FAQItem[] = [
  {
    question: "Is the degree valid in India?",
    answer: "Yes, students must qualify FMGE/NEXT according to NMC guidelines to practice in India. Our partner universities are NMC approved and WHO recognized.",
  },
  {
    question: "Is it safe for Indian students?",
    answer: [
      "Yes, universities provide:",
      "Secure hostels with 24/7 security",
      "CCTV monitoring across campus",
      "Local support teams and representatives",
      "Indian mess facilities for familiar food",
    ],
  },
  {
    question: "What about food?",
    answer: "Indian mess facilities are available at most partner universities. We ensure students have access to home-style Indian food throughout their stay.",
  },
  {
    question: "Are there hidden charges?",
    answer: "No. Fees are communicated transparently before admission. We provide complete fee breakdown including tuition, hostel, and living expenses. No donation or capitation fees.",
  },
  {
    question: "Who supports students abroad?",
    answer: [
      "Shiksha provides:",
      "Local representatives in each country",
      "University support teams",
      "24/7 emergency contact",
      "Regular parent updates",
      "On-ground assistance for accommodation and travel",
    ],
  },
];

/* ─── Admissions 2026 Benefits ─── */

export interface AdmissionBenefit {
  title: string;
  description: string;
  icon: string;
}

export const admissions2026Benefits: AdmissionBenefit[] = [
  {
    icon: "Users",
    title: "Limited Seats Available",
    description: "Apply early to secure your seat at top medical universities.",
  },
  {
    icon: "Rocket",
    title: "Early Application Advantage",
    description: "Better admission chances with priority processing.",
  },
  {
    icon: "Plane",
    title: "Priority Visa Processing",
    description: "Faster visa support for early applicants.",
  },
  {
    icon: "Building2",
    title: "Direct University Admission",
    description: "No unnecessary intermediaries — direct university partnerships.",
  },
  {
    icon: "Award",
    title: "Scholarship Eligibility",
    description: "Opportunity for scholarships based on performance.",
  },
];

/* ─── Country Comparison Data ─── */

export interface CountryComparison {
  country: string;
  duration: string;
  language: string;
  cost: string;
  livingCost: string;
}

export const countryComparison: CountryComparison[] = [
  {
    country: "Kyrgyzstan",
    duration: "6 Years",
    language: "English",
    cost: "Affordable",
    livingCost: "Low",
  },
  {
    country: "Uzbekistan",
    duration: "6 Years",
    language: "English",
    cost: "Moderate",
    livingCost: "Moderate",
  },
  {
    country: "Kazakhstan",
    duration: "6 Years",
    language: "English",
    cost: "Moderate-Premium",
    livingCost: "Moderate",
  },
  {
    country: "Russia",
    duration: "6 Years",
    language: "English",
    cost: "Moderate",
    livingCost: "Moderate",
  },
];

export const commonBenefits = [
  "No Donation Required",
  "Hostel Available",
  "Indian Mess Facility",
  "Transparent Fee Structure",
];
