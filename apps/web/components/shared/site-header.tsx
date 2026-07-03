"use client"

import { Button } from "@repo/ui"
import { Separator } from "@repo/ui"
import { SidebarTrigger } from "@repo/ui"
import { Bell, Search } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-muted-foreground" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto bg-border"
        />
        <h1 className="text-sm font-medium text-foreground">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
            <Search className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
            <Bell className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

