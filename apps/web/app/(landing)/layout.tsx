import React from "react";
import { Header } from "@/components/landing/home/Header";
import { TopBar } from "@/components/landing/home/TopBar";
import { Footer } from "@/components/landing/home/Footer";

/**
 * Shared layout for all public-facing landing pages.
 * Wraps every landing page with TopBar + Header + Footer so individual
 * pages don't need to import them.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--pure-white)" }}>
      <TopBar />
      <Header />
      <main className="flex-1 pt-8">{children}</main>
      <Footer />
    </div>
  );
}
