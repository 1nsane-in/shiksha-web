"use client"

import {
  Card,
  CardContent,
} from "@repo/ui"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

const metrics = [
  {
    label: "Applications Approved",
    value: "24",
    change: "+12.5%",
    trend: "up",
    subtitle: "Approved for the last 6 months",
  },
  {
    label: "Active Students",
    value: "1,234",
    change: "-20%",
    trend: "down",
    subtitle: "Enrollment needs attention",
  },
  {
    label: "Universities",
    value: "45",
    change: "+12.5%",
    trend: "up",
    subtitle: "Partnerships exceed targets",
  },
  {
    label: "Revenue",
    value: "$125K",
    change: "+4.5%",
    trend: "up",
    subtitle: "Meets growth projections",
  },
]

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-6">
          <CardContent className="p-0">
            <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
            <div className="flex items-baseline justify-between">
              <p className="text-[32px] font-semibold text-foreground tracking-tight leading-none">
                {metric.value}
              </p>
              <span
                className={`inline-flex items-center gap-0.5 text-sm font-medium ${
                  metric.trend === "up"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {metric.change}
                {metric.trend === "up" ? (
                  <ArrowUpRight className="size-3.5" />
                ) : (
                  <ArrowDownRight className="size-3.5" />
                )}
              </span>
            </div>
            <p className="text-xs text-muted-foreground/60 mt-2">{metric.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

