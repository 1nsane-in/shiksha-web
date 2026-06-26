import React from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

/**
 * Shared layout for all public-facing landing pages.
 * Wraps every landing page with Header + Footer so individual
 * pages don't need to import them.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAF9F6" }}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
