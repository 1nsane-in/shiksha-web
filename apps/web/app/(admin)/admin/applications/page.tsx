"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { Card } from "@repo/ui";
import { Input } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useApplications, useUpdateApplicationStatus } from "@/domains/applications/applications.queries";
import type { ApplicationFilters } from "@/domains/applications/applications.types";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Calendar,
  Mail,
} from "lucide-react";

const statusConfig: Record<string, { label: string; bg: string; border: string; text: string; icon: React.ElementType }> = {
  pending: { label: "Pending", bg: "bg-amber-50/50", border: "border-amber-200", text: "text-amber-800", icon: Clock },
  approved: { label: "Approved", bg: "bg-emerald-50/50", border: "border-emerald-200", text: "text-emerald-800", icon: CheckCircle2 },
  rejected: { label: "Rejected", bg: "bg-red-50/50", border: "border-red-200", text: "text-red-800", icon: XCircle },
  in_review: { label: "In Review", bg: "bg-blue-50/50", border: "border-blue-200", text: "text-blue-800", icon: AlertCircle },
};

const theme = {
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.08)",
  canvas: "#FAF9F6",
  surface: "#FFFFFF",
  hairline: "rgba(26, 21, 58, 0.08)",
};

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ApplicationFilters>({ page: 1, limit: 10 });
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useApplications(filters);
  const updateStatus = useUpdateApplicationStatus();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setFilters((prev) => ({ ...prev, search: val, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status: status === "all" ? undefined : status, page: 1 }));
  };

  const handlePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleApprove = (id: string) => {
    updateStatus.mutate({ id, status: "approved" });
  };

  const handleReject = (id: string) => {
    const reason = window.prompt("Rejection reason (optional):");
    updateStatus.mutate({ id, status: "rejected" });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
      {/* Advanced Filters */}
      <Card
        className="p-4 bg-white border"
        style={{ borderColor: theme.hairline }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search student by name or email..."
              className="pl-9 text-xs bg-white border-gray-200 h-10 w-full"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <Select onValueChange={(value: string | null) => handleStatusFilter(value ?? "all")} defaultValue="all">
            <SelectTrigger className="w-[150px] text-xs h-10 border-gray-200 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-gray-150 rounded-xl bg-white shadow-md p-1.5 min-w-[150px]">
              <SelectItem value="all" className="text-xs py-2.5 px-4 rounded-lg cursor-pointer hover:bg-gray-50">All Statuses</SelectItem>
              <SelectItem value="pending" className="text-xs py-2.5 px-4 rounded-lg cursor-pointer hover:bg-gray-50">Pending</SelectItem>
              <SelectItem value="approved" className="text-xs py-2.5 px-4 rounded-lg cursor-pointer hover:bg-gray-50">Approved</SelectItem>
              <SelectItem value="rejected" className="text-xs py-2.5 px-4 rounded-lg cursor-pointer hover:bg-gray-50">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Main applications listing */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto">
          <AlertCircle className="size-10 text-red-500 mb-3" />
          <p className="text-sm font-bold text-[#1A153A]">Failed to load applications</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3 cursor-pointer">Retry</Button>
        </div>
      ) : !data?.data?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 rounded-xl bg-white border border-dashed border-gray-200">
          <AlertCircle className="size-10 text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-[#1A153A]">No university applications found</p>
          <p className="text-xs text-gray-400 mt-0.5">Please check again later or adjust search terms.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="border p-1" style={{ borderColor: theme.hairline }}>
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="border-b" style={{ borderColor: theme.hairline }}>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider py-3 px-4">Student</TableHead>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider py-3 px-4">University & Program</TableHead>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider py-3 px-4">Submitted Date</TableHead>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider text-center py-3 px-4">Status</TableHead>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider text-right py-3 px-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((app) => {
                  const status = statusConfig[app.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <TableRow
                      key={app.id}
                      className="hover:bg-gray-50/50 transition-colors border-b cursor-pointer"
                      style={{ borderColor: theme.hairline }}
                      onClick={() => router.push(`/admin/applications/${app.id}`)}
                    >
                      {/* Student Info */}
                      <TableCell className="py-3 px-4">
                        <div>
                          <p className="font-bold text-sm text-[#1A153A]">
                            {app.firstName} {app.lastName}
                          </p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{app.email}</p>
                        </div>
                      </TableCell>

                      {/* University and Program */}
                      <TableCell className="py-3 px-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm text-[#1A153A] leading-tight">
                            {app.university?.name || "Unknown University"}
                          </p>
                          <span className="inline-block font-bold text-gray-500 bg-gray-50 border rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider">
                            {app.selectedProgram || "Unknown program"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Submitted Date */}
                      <TableCell className="py-3 px-4 text-xs text-gray-400 font-semibold uppercase">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "Pending"}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${status.bg} ${status.border} ${status.text}`}
                        >
                          <StatusIcon className="size-3.5" />
                          {status.label}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {app.status === "pending" ? (
                              <>
                                <button
                                  className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-emerald-700 cursor-pointer"
                                  onClick={() => handleApprove(app.id)}
                                  disabled={updateStatus.isPending}
                                >
                                  Approve
                                </button>
                                <button
                                  className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition-all hover:bg-red-100 cursor-pointer"
                                  onClick={() => handleReject(app.id)}
                                  disabled={updateStatus.isPending}
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => router.push(`/admin/applications/${app.id}`)}
                              >
                                View
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

          {data.meta && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: theme.hairline }}>
              <p className="text-xs text-gray-400 font-semibold">
                Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total applications)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.meta.page <= 1}
                  onClick={() => handlePage(data.meta.page - 1)}
                  className="text-xs cursor-pointer gap-1"
                >
                  <ChevronLeft className="size-3.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.meta.page >= data.meta.totalPages}
                  onClick={() => handlePage(data.meta.page + 1)}
                  className="text-xs cursor-pointer gap-1"
                >
                  Next
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
