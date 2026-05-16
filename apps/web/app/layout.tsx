import "./globals.css";
import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";

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
        <AuthProvider>
          <TooltipProvider>
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "calc(var(--spacing) * 72)",
                  "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
              }
            >
              <AppSidebar variant="inset" />
              <SidebarInset className="border h-[98vh] flex flex-col overflow-hidden">
                <SiteHeader />
                <div className="flex-1 overflow-y-auto">{children}</div>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
