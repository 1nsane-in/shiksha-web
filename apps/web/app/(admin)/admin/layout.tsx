import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@repo/ui"

export const metadata: Metadata = {
  title: {
    template: "%s | Admin | Shiksha",
    default: "Admin Dashboard | Shiksha",
  },
  description: "Shiksha Medical Admission Platform - Admin Panel",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
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
  )
}

