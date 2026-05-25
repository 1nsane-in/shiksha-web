"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  FileBarChart,
  Building2,
  GraduationCap,
  MessageSquare,
  ClipboardCheck,
  FileBadge2,
} from "lucide-react";

const data = {
  user: {
    name: "Admin",
    email: "admin@shiksha.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboard />,
    },
    {
      title: "Applications",
      url: "/admin/applications",
      icon: <FileText />,
      items: [
        { title: "All Applications", url: "/admin/applications" },
        { title: "Pending Review", url: "/admin/applications?status=pending" },
      ],
    },
    {
      title: "Documents",
      url: "/admin/documents",
      icon: <ClipboardCheck />,
      items: [
        { title: "Document Verification", url: "/admin/documents" },
      ],
    },
    {
      title: "Payments",
      url: "/admin/payments",
      icon: <CreditCard />,
      items: [
        { title: "Pending Approvals", url: "/admin/payments" },
      ],
    },
    {
      title: "Universities",
      url: "/admin/universities",
      icon: <Building2 />,
      items: [
        { title: "All Universities", url: "/admin/universities" },
        { title: "Add New", url: "/admin/universities/new" },
      ],
    },
    {
      title: "Exams",
      url: "/admin/exams",
      icon: <GraduationCap />,
      items: [
        { title: "Manage Exams", url: "/admin/exams" },
      ],
    },
    {
      title: "Letters",
      url: "/admin/letters",
      icon: <FileText />,
      items: [
        { title: "Upload & Manage", url: "/admin/letters" },
      ],
    },
    {
      title: "Tickets",
      url: "/admin/tickets",
      icon: <MessageSquare />,
      items: [
        { title: "Support Tickets", url: "/admin/tickets" },
      ],
    },
    {
      title: "Visa Support",
      url: "/admin/visa-support",
      icon: <FileBadge2 />,
      items: [
        { title: "Visa Centers", url: "/admin/visa-support" },
        { title: "Applications", url: "/admin/visa-support?tab=applications" },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: <FileBarChart />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings />,
    },
  ],
  navSecondary: [{ title: "Get Help", url: "#", icon: <HelpCircle /> }],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/admin" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Shiksha</span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  Admin Dashboard
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}