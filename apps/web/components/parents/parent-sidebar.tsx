"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useLogout } from "@/domains/auth";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/parents/dashboard", icon: LayoutDashboard },
  { label: "My Children", href: "/parents/children", icon: Users },
  { label: "Documents", href: "/parents/documents", icon: FileText },
  { label: "Payments", href: "/parents/payments", icon: CreditCard },
  { label: "Profile", href: "/parents/profile", icon: User },
];

export function ParentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { open, close } = useSidebarStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PR";

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-56 shrink-0 flex-col border-r border-[#ECEAE6] bg-[#FAFAF8] transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-[#ECEAE6] px-4">
          <Image src="/img/logo.png" alt="" width={24} height={24} className="h-6 w-auto" />
          <span className="ml-auto rounded-full bg-[#F0FDF4] px-1.5 py-0.5 text-[10px] font-medium text-[#166534]">
            Parent
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {nav.map(({ label, href, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/parents/dashboard" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={close}
                    className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-[#166534] text-white"
                        : "text-[#4B5563] hover:bg-[#F0FDF4] hover:text-[#166534]"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[#9CA3AF] group-hover:text-[#166534]"}`}
                    />
                    <span className="truncate">{label}</span>
                    {active && (
                      <ChevronRight className="ml-auto h-3 w-3 opacity-60" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User */}
        <div className="border-t border-[#ECEAE6] p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0FDF4] text-xs font-semibold text-[#166534]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-[#111]">
                {user?.name || "Parent"}
              </p>
              <p className="truncate text-[10px] text-[#9CA3AF]">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="rounded-md p-1 text-[#9CA3AF] transition-colors hover:bg-[#F0FDF4] hover:text-[#166534] disabled:opacity-50"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
