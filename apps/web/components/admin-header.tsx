"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/applications": "Applications",
  "/admin/documents": "Documents",
  "/admin/payments": "Payments",
  "/admin/universities": "Universities",
  "/admin/exams": "Exams",
  "/admin/letters": "Letters",
  "/admin/tickets": "Tickets",
  "/admin/visa-support": "Visa Support",
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = Object.entries(pageTitles).find(([key]) => pathname === key || pathname.startsWith(key + "/"))?.[1] || "Admin";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#ECEAE6] bg-white px-6">
      <h1 className="text-sm font-semibold text-[#111] tracking-tight">{title}</h1>
      <div className="flex items-center gap-1">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-[#F5F4F2] hover:text-[#111]">
          <Search className="h-4 w-4" />
        </button>
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-[#F5F4F2] hover:text-[#111]">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#3730A3]" />
        </button>
      </div>
    </header>
  );
}
