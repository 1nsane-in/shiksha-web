"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/ui";
import { motion, AnimatePresence } from "motion/react";
import { brand } from "@/lib/brand";
import { navLinks } from "@/lib/brand-data";

type MenuItem = { title: string; href: string };
type NavMenu = {
  eyebrow: string;
  title: string;
  description: string;
  items?: MenuItem[];
  groups?: { title: string; items: MenuItem[] }[];
};

const subjectHref = (name: string) =>
  `/shiksha-academy?subject=${encodeURIComponent(name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`;
const subject = (name: string): MenuItem => ({
  title: name,
  href: subjectHref(name),
});

const navMenus: Record<string, NavMenu> = {
  Universities: {
    eyebrow: "Partner Network",
    title: "Explore Universities",
    description:
      "Verified information and guided admissions across our partner network.",
    items: [
      { title: "All Universities", href: "/universities" },
      {
        title: "Government Universities",
        href: "/universities?type=GOVERNMENT",
      },
      { title: "Private Universities", href: "/universities?type=PRIVATE" },
      { title: "Featured Universities", href: "/universities" },
    ],
  },
  "Student Life": {
    eyebrow: "Beyond the Classroom",
    title: "Student Life",
    description:
      "Real experiences, campus moments, comfortable stays and travel support — from arrival to graduation.",
    items: [
      { title: "Student Experiences", href: "/#student-stories" },
      { title: "Gallery", href: "/gallery" },
      { title: "Accommodation", href: "/contact-us?subject=accommodation" },
      { title: "Travel Support", href: "/contact-us?subject=travel-support" },
    ],
  },
  "Shiksha Academy": {
    eyebrow: "FMGE / NExT Preparation",
    title: "Shiksha Academy",
    description:
      "Nineteen subjects, one focused revision path — from anatomy to community medicine.",
    groups: [
      {
        title: "Pre-clinical",
        items: [subject("Anatomy"), subject("Physiology"), subject("Biochemistry")],
      },
      {
        title: "Para-clinical",
        items: [
          subject("Pathology"),
          subject("Microbiology"),
          subject("Pharmacology"),
          subject("Forensic Medicine"),
          subject("Community Medicine (PSM)"),
        ],
      },
      {
        title: "Clinical",
        items: [
          subject("Medicine"),
          subject("General Surgery"),
          subject("Obstetrics & Gynaecology"),
          subject("Paediatrics"),
          subject("Ophthalmology"),
          subject("ENT"),
          subject("Dermatology"),
          subject("Psychiatry"),
          subject("Anaesthesiology"),
          subject("Radiology"),
          subject("Orthopaedics"),
        ],
      },
    ],
  },
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(name);
  };
  const scheduleCloseMenu = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };
  const activeMenu = openDropdown ? navMenus[openDropdown] : undefined;
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);
  const { isAuthenticated, user } = useAuth();
  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";
  const loginUrl = `/login${pathname !== "/" ? `?redirect=${encodeURIComponent(pathname)}` : ""}`;
  const isLinkActive = (href: string) =>
    pathname === href ||
    pathname.startsWith(href + "/") ||
    (href === "/universities" && pathname.startsWith("/student/university"));

  return (
    <header className="fixed inset-x-0 top-8 z-50">
      <div className="flex h-16 w-full items-center bg-brand-canvas px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl w-full items-center justify-between gap-8">
        {/* ─── Logo ─── */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/img/shiksha-logo.png"
            alt="Shiksha Logo"
            width={28}
            height={28}
            className="h-9 w-auto"
          />
          <span className="flex flex-col leading-none">
            <span
              className="text-[15px] font-bold tracking-tight"
              style={{ color: brand.ink }}
            >
              Siksha
            </span>
            <span
              className="mt-0.5 text-[10px] font-semibold tracking-wide"
              style={{ color: brand.gold }}
            >
              International
            </span>
          </span>
        </Link>

        {/* ─── Desktop nav ─── */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-5">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              const menu = navMenus[link.name];
              return (
                <li
                  key={link.name}
                  onMouseEnter={menu ? () => openMenu(link.name) : undefined}
                  onMouseLeave={menu ? scheduleCloseMenu : undefined}
                >
                  <Link
                    href={link.href}
                    onFocus={menu ? () => openMenu(link.name) : undefined}
                    onClick={menu ? () => setOpenDropdown(null) : undefined}
                    className="group relative inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium transition-colors duration-200"
                    style={{ color: active ? brand.ink : brand.inkMuted }}
                  >
                    {link.name}
                    {menu && (
                      <ChevronDown
                        className={`size-3.5 transition-transform duration-200 ${
                          openDropdown === link.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    <span
                      className="absolute -bottom-1 left-0 h-px bg-current transition-all duration-300"
                      style={{
                        color: brand.gold,
                        width: active ? "100%" : "0%",
                      }}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ─── Right: auth + mobile toggle ─── */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <Link
              href={
                user.role === "ADMIN" || user.role === "SUPER_ADMIN"
                  ? "/admin/dashboard"
                  : "/student/profile"
              }
            >
              <Avatar className="size-8 cursor-pointer transition-opacity hover:opacity-80">
                <AvatarFallback
                  style={{
                    background: brand.goldLight,
                    color: brand.gold,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <div className="hidden lg:block">
              <Link
                href="/universities"
                className="inline-flex items-center justify-center whitespace-nowrap px-5 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: brand.gold,
                  color: brand.ink,
                  borderRadius: 10,
                }}
              >
                Apply Now
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: brand.ink }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>

      {/* ─── Nav mega menu ─── */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            key={openDropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-x-0 top-full hidden overflow-hidden border-t shadow-2xl lg:block"
            style={{ background: brand.navy, borderColor: brand.goldBorder }}
            onMouseEnter={() => openDropdown && openMenu(openDropdown)}
            onMouseLeave={scheduleCloseMenu}
          >
            {/* Ambient gold + royal glow for depth on the navy panel */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 180% at 0% 0%, rgba(201,164,92,0.16), transparent 55%), radial-gradient(90% 140% at 100% 120%, rgba(36,91,150,0.55), transparent 60%)",
              }}
            />

            <div className="relative mx-auto grid max-w-7xl gap-10 px-8 py-9 lg:grid-cols-[1fr_1.35fr]">
              <div className="max-w-sm">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="h-px w-6"
                    style={{ background: brand.gold }}
                  />
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: brand.gold }}
                  >
                    {activeMenu.eyebrow}
                  </p>
                </div>
                <h3 className="mt-3 text-[26px] font-bold leading-tight tracking-tight text-white">
                  {activeMenu.title}
                </h3>
                <p
                  className="mt-2.5 text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.62)" }}
                >
                  {activeMenu.description}
                </p>
              </div>

              {activeMenu.groups ? (
                <div className="grid gap-6 sm:grid-cols-3 lg:border-l lg:border-white/10 lg:pl-10">
                  {activeMenu.groups.map((group, groupIndex) => (
                    <motion.div
                      key={group.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.04 + groupIndex * 0.05,
                        duration: 0.2,
                      }}
                    >
                      <p
                        className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
                        style={{ color: brand.gold }}
                      >
                        {group.title}
                      </p>
                      <ul className="space-y-0.5">
                        {group.items.map((item) => (
                          <li key={item.title}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenDropdown(null)}
                              className="group flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-white/70 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                            >
                              <span>{item.title}</span>
                              <ArrowRight className="size-3 shrink-0 text-brand-gold opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:border-l lg:border-white/10 lg:pl-10">
                  {(activeMenu.items ?? []).map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 + index * 0.05, duration: 0.2 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-gold/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                        style={{
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                        }}
                      >
                        <span>
                          <span className="block text-sm font-semibold text-white">
                            {item.title}
                          </span>
                          <span
                            className="mt-0.5 block text-xs"
                            style={{ color: "rgba(255,255,255,0.55)" }}
                          >
                            View details
                          </span>
                        </span>
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-colors duration-200 group-hover:border-brand-gold group-hover:bg-brand-gold">
                          <ArrowRight className="size-3.5 text-brand-gold transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-ink" />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    {/* ─── Mobile menu ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden lg:hidden"
            style={{ background: brand.ink }}
          >
            <nav className="max-h-[calc(100vh-6rem)] space-y-1 overflow-y-auto px-4 pb-6 pt-2">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                const menu = navMenus[link.name];
                const subItems =
                  menu?.items ?? menu?.groups?.flatMap((g) => g.items) ?? [];
                return (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      className="block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200"
                      style={{
                        color: active ? "#fff" : "rgba(255,255,255,0.7)",
                        background: active
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                    {menu && (
                      <div className="mb-1 ml-4 border-l border-white/10 pl-3">
                        {subItems.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="block rounded-lg px-4 py-2 text-[13px] transition-colors duration-200 hover:bg-white/5"
                            style={{ color: "rgba(255,255,255,0.6)" }}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {!isAuthenticated && (
                <div className="pt-3">
                  <Link
                    href="/universities"
                    className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium"
                    style={{
                      background: brand.gold,
                      color: brand.ink,
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Apply Now
                  </Link>
                </div>
              )}
              <div className="mt-4 border-t border-white/10 pt-4 text-[13px]">
                <a
                  href="tel:+919876543210"
                  className="block px-4 py-2 text-white/60 hover:text-white"
                >
                  +91 98765 43210
                </a>
                <a
                  href="mailto:info@shiksha.study"
                  className="block px-4 py-2 text-white/60 hover:text-white"
                >
                  info@shiksha.study
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
