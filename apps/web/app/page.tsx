import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Shiksha International | MBBS Abroad Admissions 2026",
  description:
    "Shiksha International — your trusted global education ally. MBBS admissions in Kyrgyzstan, Uzbekistan, Kazakhstan & Russia. Official university collaborations, free FMGE/NEXT coaching, and transparent admissions.",
};

// Critical above-the-fold components - load immediately
import { Header } from "@/components/landing/home/Header";
import { TopBar } from "@/components/landing/home/TopBar";
import { HeroCarousel } from "@/components/landing/home/HeroCarousel";
import { CountrySection } from "@/components/landing/home/CountrySection";

// Below-the-fold components - lazy loaded via client component
import { LazySections } from "@/components/landing/home/LazySections";

function decodeToken(token: string): { role?: string } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default async function Home() {
  // Redirect logged-in PARENT/ADMIN away from landing page
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (token) {
    const payload = decodeToken(token);
    const role = payload?.role?.toLowerCase();
    if (role && role !== "student") {
      const dest =
        role === "admin" || role === "super_admin"
          ? "/admin/dashboard"
          : "/parents/dashboard";
      redirect(dest);
    }
  }

  return (
    <>
      <TopBar />
      <Header />
      <HeroCarousel />
      <CountrySection />
      {/* Rest of the page - lazy loaded below the fold */}
      <LazySections />
    </>
  );
}
