import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/landing/Header";
import { StudentNav } from "@/components/student/student-nav";

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
    <>
      <Header />
      <div className="min-h-screen bg-[#F8F6FC] pb-20 md:pb-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <Suspense fallback={<div className="h-10" />}>
            <StudentNav />
          </Suspense>
          <main className="mt-6">{children}</main>
        </div>
      </div>
    </>
  );
}
