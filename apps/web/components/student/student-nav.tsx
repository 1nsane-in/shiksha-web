"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  GraduationCap,
  MessageSquare,
  FolderOpen,
  Globe,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/student/documents", icon: FolderOpen },
  { name: "Letters", href: "/student/letters", icon: FileText },
  { name: "Payments", href: "/student/payments", icon: CreditCard },
  { name: "Exams", href: "/student/exams", icon: GraduationCap },
  { name: "Tickets", href: "/student/tickets", icon: MessageSquare },
  { name: "Visa", href: "/student/visa-support", icon: Globe },
];

export function StudentNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-white rounded-xl border border-[#E0D8F0] p-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#4B2D8E] text-white"
                  : "text-[#6B6B6B] hover:text-[#4B2D8E] hover:bg-[#F0A030]/10"
              }`}
            >
              <item.icon className="size-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-[#E0D8F0] safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg min-w-0 ${
                  isActive ? "text-[#4B2D8E]" : "text-[#6B6B6B]"
                }`}
              >
                <item.icon className="size-5" />
                <span className="text-[10px] font-medium truncate max-w-full">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

