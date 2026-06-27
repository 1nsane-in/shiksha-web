import { Header } from "@/components/landing/home/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Student | Shiksha",
    default: "Student Dashboard | Shiksha",
  },
  description: "Track your medical admission application",
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20 md:pb-0">
      <Header />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <main>{children}</main>
      </div>
    </div>
  );
}
