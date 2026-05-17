"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Universities", href: "#universities" },
  { name: "Documents", href: "#documents" },
  { name: "Pricing", href: "#pricing" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-5 flex h-14 max-w-6xl items-center justify-between rounded-md bg-white/20 px-4 backdrop-blur-sm">
          <Link href="/" className="flex shrink-0 items-center">
            <Image src="/img/logo.png" alt="Shiksha Logo" width={28} height={28} className="h-7 w-auto" />
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden md:block">
            <Button variant="secondary" size="sm" nativeButton={false} render={<Link href="/login" />}>
              Login
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="mx-auto mt-1 max-w-6xl rounded-md bg-[#2D2154] px-4 py-3">
            <nav>
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Button
                    variant="secondary"
                    className="w-full bg-white/10 text-white"
                    nativeButton={false}
                    render={<Link href="/login" />}
                  >
                    Login
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
