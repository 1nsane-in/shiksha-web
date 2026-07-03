"use client";

import { useSidebarStore } from "@/stores/sidebar-store";
import { Menu, X } from "lucide-react";

export function AdminMobileToggle() {
  const { open, toggle } = useSidebarStore();

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed left-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-md border border-[#ECEAE6] bg-white shadow-sm text-[#4B5563] transition-colors hover:bg-gray-50 md:hidden"
      aria-label={open ? "Close sidebar" : "Open sidebar"}
    >
      {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
