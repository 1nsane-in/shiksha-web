"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { Card } from "@repo/ui";
import { Input } from "@repo/ui";
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
  ExternalLink,
  Building2,
  User,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  approved: { label: "Approved", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-red-600 bg-red-50 border-red-200", icon: XCircle },
  in_review: { label: "In Review", color: "text-blue-600 bg-blue-50 border-blue-200", icon: AlertCircle },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and manage student applications</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Select onValueChange={(value: string | null) => handleStatusFilter(value ?? "all")} defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={handleSearch}>
            <Search className="size-4 mr-1" />
            Search
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <p className="text-destructive">Failed to load applications</p>
          <Button variant="outline" onClick={() => refetch()}>Retry</Button>
        </div>
      ) : !data?.data?.length ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <AlertCircle className="size-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No applications found</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.data.map((app) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <Card
                  key={app.id}
                  className="p-4 border-border hover:border-[#F0A030]/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="size-4 text-muted-foreground shrink-0" />
                        <h3 className="font-medium text-foreground truncate">
                          {app.university?.name || 'Unknown University'}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="size-3.5" />
                        <span>{app.firstName} {app.lastName}</span>
                        <span className="text-border">|</span>
                        <span>{app.email}</span>
                        <span className="text-border">|</span>
                        <span>{app.selectedProgram || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                        <StatusIcon className="size-3" />
                        {status.label}
                      </span>
                      {app.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700 h-7 text-xs"
                            onClick={() => handleApprove(app.id)}
                            disabled={updateStatus.isPending}
                          >
                            <CheckCircle2 className="size-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs"
                            onClick={() => handleReject(app.id)}
                            disabled={updateStatus.isPending}
                          >
                            <XCircle className="size-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/applications/${app.id}`)}
                      >
                        <ExternalLink className="size-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {data.meta && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.meta.page <= 1}
                  onClick={() => handlePage(data.meta.page - 1)}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.meta.page >= data.meta.totalPages}
                  onClick={() => handlePage(data.meta.page + 1)}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

