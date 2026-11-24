import "./globals.css";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Providers } from "@/lib/providers";

// Self-hosted fonts — removes render-blocking Google Fonts @import chain.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers>
          <AuthProvider>
            <div className="bg-background">{children}</div>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
