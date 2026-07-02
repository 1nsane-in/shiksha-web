"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@repo/ui";
import { motion, AnimatePresence } from "motion/react";
import { brand } from "@/lib/brand";
import { navLinks } from "@/lib/brand-data";

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
        background: brand.canvas,
        borderBottom: `1px solid ${brand.hairline}`,
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
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group relative text-sm font-medium transition-colors duration-200"
                    style={{ color: isActive ? brand.ink : brand.inkMuted }}
                  >
                    {link.name}
                    <span
                      className="absolute -bottom-1 left-0 h-px bg-current transition-all duration-300"
                      style={{
                        color: brand.gold,
                        width: isActive ? "100%" : "0%",
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
                  ? "/admin/profile"
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
                href={loginUrl}
                className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: brand.ink,
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
            className="flex size-10 items-center justify-center rounded-lg lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: brand.ink }}
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
            className="overflow-hidden lg:hidden"
            style={{ background: brand.ink }}
          >
            <nav className="space-y-1 px-4 pb-6 pt-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200"
                    style={{
                      color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                      background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {!isAuthenticated && (
                <div className="pt-3">
                  <Link
                    href={loginUrl}
                    className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium"
                    style={{
                      background: brand.gold,
                      color: brand.ink,
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
