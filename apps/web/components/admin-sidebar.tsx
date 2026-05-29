"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  CreditCard,
  Building2,
  GraduationCap,
  Mail,
  MessageSquare,
  Plane,
  LogOut,
  ChevronRight,
} from "lucide-react";

const nav = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Documents", href: "/admin/documents", icon: ClipboardCheck },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Universities", href: "/admin/universities", icon: Building2 },
  { label: "Exams", href: "/admin/exams", icon: GraduationCap },
  { label: "Letters", href: "/admin/letters", icon: Mail },
  { label: "Tickets", href: "/admin/tickets", icon: MessageSquare },
  { label: "Visa Support", href: "/admin/visa-support", icon: Plane },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-[#ECEAE6] bg-[#FAFAF8]">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-[#ECEAE6] px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3730A3]">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-[#111]">Shiksha</span>
        <span className="ml-auto rounded-full bg-[#EEF2FF] px-1.5 py-0.5 text-[10px] font-medium text-[#3730A3]">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-[#3730A3] text-white"
                      : "text-[#4B5563] hover:bg-[#F0EEF8] hover:text-[#111]"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[#9CA3AF] group-hover:text-[#3730A3]"}`} />
                  <span className="truncate">{label}</span>
                  {active && <ChevronRight className="ml-auto h-3 w-3 opacity-60" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-[#ECEAE6] p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-semibold text-[#3730A3]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[#111]">{user?.name || "Admin"}</p>
            <p className="truncate text-[10px] text-[#9CA3AF]">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-md p-1 text-[#9CA3AF] transition-colors hover:bg-[#F0EEF8] hover:text-[#3730A3]"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
