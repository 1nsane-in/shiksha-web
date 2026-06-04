"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { Card } from "@repo/ui";
import { Input } from "@repo/ui";
import { Skeleton } from "@repo/ui";
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

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
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
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6" style={{ background: theme.canvas }}>
      {/* Title Header */}
      <div className="border-b pb-5" style={{ borderColor: theme.hairline }}>
        <h1 className="text-xl font-bold tracking-tight text-[#1A153A]">University Applications</h1>
        <p className="text-sm text-gray-500">Assess, verify, and manage stage 1 admissions submitted by overseas applicants.</p>
      </div>

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
              className="pl-9 text-xs bg-gray-50/30 border-gray-200 py-2.5"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Select onValueChange={(value: string | null) => handleStatusFilter(value ?? "all")} defaultValue="all">
            <SelectTrigger className="w-[150px] text-xs h-10 border-gray-200 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-gray-150 rounded-xl bg-white shadow-md">
              <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
              <SelectItem value="pending" className="text-xs">Pending</SelectItem>
              <SelectItem value="approved" className="text-xs">Approved</SelectItem>
              <SelectItem value="rejected" className="text-xs">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSearch}
            className="text-xs font-semibold text-white cursor-pointer px-5 py-2.5 rounded-lg h-10 flex items-center justify-center gap-1"
            style={{ background: theme.ink }}
          >
            <Search className="size-3.5" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Main applications listing */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
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
          <div className="space-y-3">
            {data.data.map((app) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div
                  key={app.id}
                  className="cursor-pointer p-5 bg-white border rounded-xl hover:shadow-sm hover:border-[#1A153A]/20 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  style={{ borderColor: theme.hairline }}
                  onClick={() => router.push(`/admin/applications/${app.id}`)}
                >
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-gray-50 p-1 shrink-0">
                        <Building2 className="size-4" style={{ color: theme.gold }} />
                      </div>
                      <h3 className="font-bold text-[#1A153A] truncate text-sm sm:text-base leading-snug">
                        {app.university?.name || "Unknown University"}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="size-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-700">{app.firstName} {app.lastName}</span>
                      </div>
                      <span className="text-gray-300 hidden sm:inline">|</span>
                      <div className="flex items-center gap-1">
                        <Mail className="size-3.5 text-gray-400" />
                        <span className="font-mono">{app.email}</span>
                      </div>
                      <span className="text-gray-300 hidden sm:inline">|</span>
                      <span className="font-semibold text-gray-600 bg-gray-50 border rounded px-2 py-0.5 text-[10px] uppercase tracking-wide">
                        {app.selectedProgram || "Unknown program"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                      <Calendar className="size-3 text-gray-300" />
                      <span>Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "Pending"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${status.bg} ${status.border} ${status.text}`}
                    >
                      <StatusIcon className="size-3.5" />
                      {status.label}
                    </span>

                    {app.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-emerald-700 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(app.id);
                          }}
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle2 className="size-3.5" />
                          Approve
                        </button>
                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-700 transition-all hover:bg-red-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(app.id);
                          }}
                          disabled={updateStatus.isPending}
                        >
                          <XCircle className="size-3.5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

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
