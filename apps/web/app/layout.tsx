import "./globals.css";
import type { Metadata } from "next";
import { TooltipProvider } from "@repo/ui";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Providers } from "@/lib/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Shiksha | Medical Admission Platform",
  description:
    "Medical admission management platform for students, admins, and agents. Apply to top medical universities, track your applications, and manage your medical career.",
  icons: { icon: "/img/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <Providers>
          <AuthProvider>
            <TooltipProvider>
              <div className="bg-[#FAF9F6]">{children}</div>
            </TooltipProvider>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
