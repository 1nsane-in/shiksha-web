"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { brand } from "@/lib/brand";

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  external?: boolean;
}

const contactItems: ContactItem[] = [
  {
    icon: <Phone className="size-4" />,
    label: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: <FaWhatsapp className="size-4" />,
    label: "WhatsApp",
    href: "https://wa.me/919876543210",
    external: true,
  },
  {
    icon: <Mail className="size-4" />,
    label: "admissions@shiksha.edu",
    href: "mailto:admissions@shiksha.edu",
  },
];

interface LoginLink {
  label: string;
  href: string;
}

const loginLinks: LoginLink[] = [
  { label: "Student Login", href: "/login?role=student" },
  { label: "Parent Login", href: "/login?role=parent" },
  { label: "Admin Login", href: "/login?role=admin" },
];

export function TopBar() {
  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-8 flex items-center justify-center bg-brand-navy text-white"
      style={{ background: brand.navy }}
    >
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-0">
          {/* ─── Left: Contact info ─── */}
          <div className="flex items-center gap-4 lg:gap-6 text-xs sm:text-sm">
            {contactItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-1.5 hover:text-brand-gold transition-colors duration-200"
              >
                {item.icon}
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* ─── Right: Login links ─── */}
          <div className="flex items-center gap-4 lg:gap-6 text-xs sm:text-sm">
            {loginLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-brand-gold transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
