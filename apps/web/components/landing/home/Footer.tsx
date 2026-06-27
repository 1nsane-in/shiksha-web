import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { brand } from "@/lib/brand";
import {
  contactInfo,
  footerQuickLinks,
  socialLinks,
} from "@/lib/brand-data";

/* ─── Sub-components ─── */

function SocialIcon({ href, label, path }: { href: string; label: string; path: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white"
      style={{ border: `1px solid ${brand.hairline}`, color: brand.ink }}
      aria-label={label}
    >
      <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </a>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-2.5 text-sm" style={{ color: brand.inkMuted }}>
      <Icon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: brand.gold }} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="font-mono mt-0.5 text-xs">{value}</p>
      </div>
    </li>
  );
}

/* ─── Main Component ─── */

export function Footer() {
  return (
    <footer
      className="border-t py-16 px-4 sm:px-6 lg:px-8"
      style={{
        background: brand.canvas,
        borderColor: brand.hairline,
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
              <span className="text-xl font-bold tracking-tight" style={{ color: brand.ink }}>
                Shiksha Global
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-md" style={{ color: brand.inkMuted }}>
              Your premier gateway to world-class medical education abroad. We guide aspiring
              medical students from comprehensive university matching through document validation,
              payment processing, and visa assistance.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((s) => (
                <SocialIcon key={s.name} href={s.href} label={s.name} path={s.path} />
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: brand.ink }}>
              Quick Navigation
            </h4>
            <ul className="space-y-2.5">
              {footerQuickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:underline transition-colors"
                    style={{ color: brand.inkMuted }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: brand.ink }}>
              Contact Center
            </h4>
            <ul className="space-y-3">
              <ContactRow icon={Phone} label="Call Advisors" value={contactInfo.phone} />
              <ContactRow icon={Mail} label="Email Queries" value={contactInfo.email} />
              <ContactRow icon={MapPin} label="Noida HQ" value={contactInfo.address} />
            </ul>
          </div>

          {/* Quick Consultation Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: brand.ink }}>
              Quick Consultation
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: brand.inkMuted }}>
              Request a free callback from our certified admissions panel.
            </p>
            <div className="pt-1">
              <Link
                href="/contact-us"
                className="inline-flex w-full items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all hover:brightness-95"
                style={{
                  background: brand.ink,
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
            borderColor: brand.hairline,
            color: brand.inkMuted,
          }}
        >
          <p>© {new Date().getFullYear()} Shiksha Global. All rights reserved.</p>
          <p className="text-center md:text-right font-medium">
            Registered Partner & Approved Educational Consultancy of Premier Foreign Medical
            Universities.
          </p>
        </div>
      </div>
    </footer>
  );
}
