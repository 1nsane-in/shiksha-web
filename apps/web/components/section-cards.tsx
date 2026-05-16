"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, FileCheckIcon, UsersIcon, GraduationCapIcon, DollarSignIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <FileCheckIcon className="size-4" />
            </div>
            <CardDescription className="text-sm font-medium">Applications Approved</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            24
          </CardTitle>
          <CardAction>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-emerald-700">
            Trending up this month{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Approved for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <UsersIcon className="size-4" />
            </div>
            <CardDescription className="text-sm font-medium">Active Students</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon className="size-3" />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period{" "}
            <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Enrollment needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="border-l-4 border-l-violet-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              <GraduationCapIcon className="size-4" />
            </div>
            <CardDescription className="text-sm font-medium">Universities</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45
          </CardTitle>
          <CardAction>
            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-violet-700">
            Strong partner network{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Partnerships exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <DollarSignIcon className="size-4" />
            </div>
            <CardDescription className="text-sm font-medium">Revenue</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $125K
          </CardTitle>
          <CardAction>
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
              <TrendingUpIcon className="size-3" />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-amber-700">
            Steady performance increase{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
