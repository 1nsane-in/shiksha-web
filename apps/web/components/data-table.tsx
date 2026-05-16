"use client"

import * as React from "react"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

const statusStyles: Record<string, string> = {
  Done: "bg-primary text-primary-foreground",
  "In Process": "bg-muted text-foreground",
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageSize = 10

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return initialData
    return initialData.filter((item) =>
      item.header.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [initialData, searchQuery])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-foreground">Applications</h3>
            <Badge className="bg-muted text-muted-foreground font-normal text-xs rounded-md px-2 py-0.5 hover:bg-muted">
              {filteredData.length} items
            </Badge>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Header
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Type
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3 text-right">
                Target
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3 text-right">
                Limit
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Reviewer
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <TableCell className="px-5 py-3.5 text-sm text-foreground font-medium">
                  {item.header}
                </TableCell>
                <TableCell className="px-5 py-3.5 text-sm text-muted-foreground">
                  {item.type}
                </TableCell>
                <TableCell className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                      statusStyles[item.status] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-3.5 text-sm text-foreground text-right tabular-nums">
                  {item.target}
                </TableCell>
                <TableCell className="px-5 py-3.5 text-sm text-foreground text-right tabular-nums">
                  {item.limit}
                </TableCell>
                <TableCell className="px-5 py-3.5 text-sm text-muted-foreground">
                  {item.reviewer}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground/60">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
            {filteredData.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center size-8 rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="text-xs text-muted-foreground tabular-nums min-w-[4rem] text-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center size-8 rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
