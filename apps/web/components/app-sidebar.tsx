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
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Applications",
      url: "/applications",
      icon: <FileText />,
      items: [
        { title: "All Applications", url: "/applications" },
        { title: "Pending Review", url: "/applications?status=pending" },
      ],
    },
    {
      title: "Students",
      url: "#",
      icon: <Users />,
      items: [
        { title: "All Students", url: "#" },
        { title: "Document Verification", url: "#" },
      ],
    },
    {
      title: "Payments",
      url: "#",
      icon: <CreditCard />,
      items: [
        { title: "Transactions", url: "#" },
        { title: "Pending Approvals", url: "#" },
      ],
    },
    {
      title: "Universities",
      url: "#",
      icon: <Building2 />,
      items: [
        { title: "Manage Universities", url: "#" },
        { title: "Courses", url: "#" },
      ],
    },
    {
      title: "Admissions",
      url: "#",
      icon: <GraduationCap />,
      items: [
        { title: "Stages", url: "#" },
        { title: "Letters", url: "#" },
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
            <SidebarMenuButton size="lg" render={<a href="/dashboard" />}>
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
