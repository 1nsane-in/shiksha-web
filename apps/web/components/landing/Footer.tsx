import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

const theme = {
  canvas: "#FAF9F6",
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.10)",
  hairline: "rgba(26, 21, 58, 0.08)",
};

export function Footer() {
  return (
    <footer
      className="border-t py-16 px-4 sm:px-6 lg:px-8"
      style={{
        background: theme.canvas,
        borderColor: theme.hairline,
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-12">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/img/shiksha-logo.png"
                alt="Shiksha Logo"
                width={36}
                height={36}
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold tracking-tight" style={{ color: theme.ink }}>
                Shiksha Global
              </span>
            </Link>
            
            <p className="text-sm leading-relaxed max-w-md" style={{ color: theme.inkMuted }}>
              Your premier gateway to world-class medical education abroad. We guide aspiring medical students from 
              comprehensive university matching through document validation, payment processing, and visa assistance.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white"
                style={{ border: "1px solid " + theme.hairline, color: theme.ink }}
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white"
                style={{ border: "1px solid " + theme.hairline, color: theme.ink }}
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white"
                style={{ border: "1px solid " + theme.hairline, color: theme.ink }}
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.ink }}>
              Quick Navigation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm hover:underline transition-colors" style={{ color: theme.inkMuted }}>
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-sm hover:underline transition-colors" style={{ color: theme.inkMuted }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm hover:underline transition-colors" style={{ color: theme.inkMuted }}>
                  University Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-sm hover:underline transition-colors" style={{ color: theme.inkMuted }}>
                  Contact & Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.ink }}>
              Contact Center
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm" style={{ color: theme.inkMuted }}>
                <Phone className="h-4 w-4 shrink-0 mt-0.5" style={{ color: theme.gold }} />
                <div>
                  <p className="font-medium">Call Advisors</p>
                  <p className="font-mono mt-0.5 text-xs">+996 5566 11890</p>
                  <p className="font-mono text-xs">+91 98765 43210</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-sm" style={{ color: theme.inkMuted }}>
                <Mail className="h-4 w-4 shrink-0 mt-0.5" style={{ color: theme.gold }} />
                <div>
                  <p className="font-medium">Email Queries</p>
                  <p className="mt-0.5 text-xs">admissions@shiksha-global.com</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-sm" style={{ color: theme.inkMuted }}>
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" style={{ color: theme.gold }} />
                <div>
                  <p className="font-medium">Noida HQ</p>
                  <p className="mt-0.5 text-xs leading-tight">Sector 62, Noida, NCR</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Callback Nudge Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.ink }}>
              Quick Consultation
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: theme.inkMuted }}>
              Request a free callback from our certified admissions panel.
            </p>
            <div className="pt-1">
              <Link
                href="/contact-us"
                className="inline-flex w-full items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all hover:brightness-95"
                style={{
                  background: theme.ink,
                  color: "#fff",
                }}
              >
                Submit Score Details
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Base */}
        <div
          className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderColor: theme.hairline,
            color: theme.inkMuted,
          }}
        >
          <p>© {new Date().getFullYear()} Shiksha Global. All rights reserved.</p>
          <p className="text-center md:text-right font-medium">
            Registered Partner & Approved Educational Consultancy of Premier Foreign Medical Universities.
          </p>
        </div>
      </div>
    </footer>
  );
}
