import type { Metadata } from "next";
import { ParentSidebar } from "@/components/parents/parent-sidebar";
import { AdminMobileToggle } from "@/components/admin/admin-mobile-toggle";

export const metadata: Metadata = {
  title: {
    template: "%s | Parents | Shiksha",
    default: "Parent Dashboard | Shiksha",
  },
  description: "Track your ward's medical admission application",
};

export default function ParentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F5F2]">
      <ParentSidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <AdminMobileToggle />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pt-14 md:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}

