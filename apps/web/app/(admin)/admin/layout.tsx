import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin | Shiksha",
    default: "Admin Dashboard | Shiksha",
  },
  description: "Shiksha Medical Admission Platform - Admin Panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F5F2]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
