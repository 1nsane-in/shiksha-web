import "./globals.css";
import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "MedCareer | Your Journey to Medical Excellence",
  description:
    "Medical admission management platform for students, admins, and agents. Apply to top medical universities, track your applications, and manage your medical career.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}