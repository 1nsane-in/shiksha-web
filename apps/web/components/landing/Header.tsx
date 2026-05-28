"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@repo/ui";
import { motion, AnimatePresence } from "motion/react";

/* ─── brand tokens (matching UniversityCards) ─── */
const theme = {
  canvas: "#FAF9F6",
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.10)",
  hairline: "rgba(26, 21, 58, 0.08)",
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Our Universities", href: "#" },
  { name: "Gallery", href: "#" },
  { name: "Online Payment", href: "#" },
  { name: "Courses", href: "#courses" },
  { name: "Contact Us", href: "#contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";
  const loginUrl = `/login${pathname !== "/" ? `?redirect=${encodeURIComponent(pathname)}` : ""}`;

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: theme.canvas,
        borderBottom: "1px solid " + theme.hairline,
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ─── Logo ─── */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/img/shiksha-logo.png"
            alt="Shiksha Logo"
            width={28}
            height={28}
            className="h-9 w-auto"
          />
        </Link>

        {/* ─── Desktop nav ─── */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="group relative text-sm font-medium transition-colors duration-200"
                  style={{ color: theme.inkMuted }}
                >
                  {link.name}
                  <span
                    className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full"
                    style={{ color: theme.gold }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ─── Right: auth + mobile toggle ─── */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <Link
              href={user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "/admin/profile" : "/student/profile"}
            >
              <Avatar className="size-8 cursor-pointer transition-opacity hover:opacity-80">
                <AvatarFallback
                  style={{
                    background: theme.goldLight,
                    color: theme.gold,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <div className="hidden md:block">
              <Link
                href={loginUrl}
                className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: theme.ink,
                  color: "#fff",
                  borderRadius: 10,
                }}
              >
                Login
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: theme.ink }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile menu ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden md:hidden"
            style={{ background: theme.ink }}
          >
            <nav className="space-y-1 px-4 pb-6 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-3">
                  <Link
                    href={loginUrl}
                    className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium"
                    style={{
                      background: theme.gold,
                      color: theme.ink,
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
