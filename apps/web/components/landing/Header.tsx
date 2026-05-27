"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@repo/ui";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/domains/auth";
import { Avatar, AvatarFallback } from "@repo/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
} from "@repo/ui";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "#" },
  { name: "Our Universities", href: "#" },
  { name: "Gallery", href: "#" },
  { name: "Online Payment", href: "#" },
  { name: "Courses", href: "#courses" },
  { name: "Contact Us", href: "#contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const logoutMutation = useLogout();
  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header>
      <div className=" w-full  bg-white ">
        <div className="flex items-center gap-12 container mx-auto justify-between py-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/img/shiksha-logo.png"
              alt="Shiksha Logo"
              width={28}
              height={28}
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden md:block">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Separator orientation="vertical" className={"mr-5"} />

            <div className="flex items-center gap-2">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        className="flex items-center gap-2 cursor-pointer"
                      />
                    }
                  >
                    <Avatar className="size-8">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="hidden md:block size-4 text-white/70" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={8}>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                      <LogOut className="size-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:block">
                  <Button
                    variant="secondary"
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/login" />}
                  >
                    Login
                  </Button>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
            </div>
          </div>
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
                {!isAuthenticated && (
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
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
