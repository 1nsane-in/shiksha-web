"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon } from "lucide-react"

const data = {
  user: {
    name: "Student",
    email: "student@medcareer.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/student/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Application Stages",
      url: "/student/stages",
      icon: (
        <ListIcon
        />
      ),
    },
    {
      title: "Analytics",
      url: "/student/analytics",
      icon: (
        <ChartBarIcon
        />
      ),
    },
    {
      title: "Documents",
      url: "/student/documents",
      icon: (
        <FolderIcon
        />
      ),
    },
    {
      title: "Payments",
      url: "/student/payments",
      icon: (
        <UsersIcon
        />
      ),
    },
  ],
  navClouds: [
    {
      title: "Admission",
      icon: (
        <CameraIcon
        />
      ),
      isActive: true,
      url: "#",
      items: [
        {
          title: "Application Status",
          url: "/student/stages",
        },
        {
          title: "Exam Dashboard",
          url: "/student/exam",
        },
      ],
    },
    {
      title: "Letters",
      icon: (
        <FileTextIcon
        />
      ),
      url: "#",
      items: [
        {
          title: "Admission Letter",
          url: "/student/letters/admission",
        },
        {
          title: "Invitation Letter",
          url: "/student/letters/invitation",
        },
      ],
    },
    {
      title: "Visa Support",
      icon: (
        <FileTextIcon
        />
      ),
      url: "/student/visa",
      items: [
        {
          title: "Visa Checklist",
          url: "/student/visa/checklist",
        },
        {
          title: "Application Status",
          url: "/student/visa/status",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "LMS Portal",
      url: "/student/lms",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
    {
      title: "Settings",
      url: "/student/settings",
      icon: (
        <SearchIcon
        />
      ),
    },
  ],
  documents: [
    {
      name: "Universities",
      url: "/student/universities",
      icon: (
        <DatabaseIcon
        />
      ),
    },
    {
      name: "Reports",
      url: "/student/reports",
      icon: (
        <FileChartColumnIcon
        />
      ),
    },
    {
      name: "Agent Contact",
      url: "/student/agent",
      icon: (
        <FileIcon
        />
      ),
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! bg-primary text-primary-foreground hover:bg-primary/90"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">MedCareer</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
