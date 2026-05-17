import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";

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
      {children}
    </>
  );
}
