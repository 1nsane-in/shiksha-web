"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Skeleton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Label,
} from "@repo/ui";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Link2,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import {
  useAdminParentLinks,
  useCreateAdminParentLink,
  useUpdateAdminParentLinkStatus,
  useDeleteAdminParentLink,
} from "@/domains/parents";
import type {
  CreateParentLinkRequest,
} from "@/domains/parents";

const statusConfig: Record<
  string,
  { label: string; dot: string; cls: string }
> = {
  PENDING: {
    label: "Pending",
    dot: "bg-amber-500",
    cls: "text-amber-700 bg-amber-50 border-amber-200",
  },
  APPROVED: {
    label: "Approved",
    dot: "bg-emerald-500",
    cls: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    dot: "bg-red-500",
    cls: "text-red-700 bg-red-50 border-red-200",
  },
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function AdminParentLinksPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const search = useDebounce(searchInput, 300);

  const { data, isLoading, isError, refetch } = useAdminParentLinks({
    page,
    limit: 10,
    status: statusFilter || undefined,
    search: search || undefined,
  });

  const updateStatusMutation = useUpdateAdminParentLinkStatus();
  const deleteMutation = useDeleteAdminParentLink();

  const links = data?.data ?? [];

  const handleUpdateStatus = useCallback(
    async (id: string, status: "APPROVED" | "REJECTED") => {
      try {
        await updateStatusMutation.mutateAsync({ id, data: { status } });
        toast.success(
          `Link ${status === "APPROVED" ? "approved" : "rejected"} successfully`
        );
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || `Failed to ${status.toLowerCase()} link`
        );
      }
    },
    [updateStatusMutation]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this parent-student link?"))
        return;
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Parent-student link deleted successfully");
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Failed to delete link"
        );
      }
    },
    [deleteMutation]
  );

  const handleStatusFilterChange = useCallback((val: string | null) => {
    setStatusFilter(val === "all" || val === null ? "" : val);
    setPage(1);
  }, []);

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#111]">
          Failed to load parent-student links
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Something went wrong while fetching data.
        </p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="size-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">
          Parent-Student Links
        </h1>
        <p className="text-sm text-[#666]">
          View, create, approve, reject, and manage parent-student
          relationships.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="rounded-lg bg-indigo-100 p-2.5">
              <Link2 className="size-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Total Links
              </p>
              <p className="text-xl font-bold text-[#111] mt-0.5">
                {data?.total ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="rounded-lg bg-emerald-100 p-2.5">
              <UserCheck className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Approved
              </p>
              <p className="text-xl font-bold text-[#111] mt-0.5">
                {data?.total
                  ? links.filter((l) => l.status === "APPROVED").length
                  : 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="rounded-lg bg-amber-100 p-2.5">
              <Clock className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Pending
              </p>
              <p className="text-xl font-bold text-[#111] mt-0.5">
                {data?.total
                  ? links.filter((l) => l.status === "PENDING").length
                  : 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Create button */}
      <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
        <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-2">
          <div>
            <CardTitle className="text-base font-semibold">
              All Parent-Student Links
            </CardTitle>
          </div>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="bg-[#3730A3] hover:bg-[#2e288a] text-white gap-1.5 cursor-pointer"
          >
            <Plus className="size-4" /> Create Link
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search + Status filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search by parent or student name/email..."
                className="pl-9 bg-white border-[#E5E7EB]"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={statusFilter || "all"}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[140px] bg-white border-[#E5E7EB] text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : links.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center text-gray-500">
              <UserX className="size-10 text-gray-300 mb-2" />
              <p className="text-sm font-medium">No parent-student links found</p>
              <p className="text-xs text-gray-400 mt-1">
                {search || statusFilter
                  ? "Try adjusting your search or filters."
                  : 'Click "Create Link" to add the first one.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#ECEAE6]">
                      <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">
                        Parent
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">
                        Student
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">
                        Relation
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">
                        Created
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {links.map((link) => (
                      <TableRow
                        key={link.id}
                        className="hover:bg-[#F2F1ED] border-[#ECEAE6] transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-semibold text-sm text-[#111]">
                              {link.parentName}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                              {link.parentEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-sm text-[#111]">
                              {link.studentName}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                              {link.studentEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-[#555]">
                            {link.relation ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase font-bold py-0.5 px-2 gap-1 ${
                              statusConfig[link.status]?.cls ??
                              "text-gray-600 bg-gray-50"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                statusConfig[link.status]?.dot ??
                                "bg-gray-400"
                              }`}
                            />
                            {statusConfig[link.status]?.label ?? link.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-400">
                          {new Date(link.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {link.status === "PENDING" ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 px-2 cursor-pointer"
                                onClick={() =>
                                  handleUpdateStatus(link.id, "APPROVED")
                                }
                                disabled={updateStatusMutation.isPending}
                                title="Approve"
                              >
                                <CheckCircle2 className="size-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2 cursor-pointer"
                                onClick={() =>
                                  handleUpdateStatus(link.id, "REJECTED")
                                }
                                disabled={updateStatusMutation.isPending}
                                title="Reject"
                              >
                                <XCircle className="size-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 px-2 cursor-pointer"
                                onClick={() => handleDelete(link.id)}
                                disabled={deleteMutation.isPending}
                                title="Delete"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 px-2 cursor-pointer"
                              onClick={() => handleDelete(link.id)}
                              disabled={deleteMutation.isPending}
                              title="Delete"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#ECEAE6]">
                  <p className="text-xs text-gray-400">
                    Showing page {data.page} of {data.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className="cursor-pointer"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page >= data.totalPages}
                      onClick={() => setPage((p) => Math.min(p + 1, data.totalPages))}
                      className="cursor-pointer"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Link Sheet */}
      <CreateLinkSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => {
          setCreateOpen(false);
          refetch();
        }}
      />
    </div>
  );
}

/* ─── Create Link Sheet ─── */

function CreateLinkSheet({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [parentEmail, setParentEmail] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [relation, setRelation] = useState("");

  const createMutation = useCreateAdminParentLink();

  const reset = useCallback(() => {
    setParentEmail("");
    setStudentEmail("");
    setRelation("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parentEmail || !studentEmail) {
      toast.error("Please enter both parent and student email addresses");
      return;
    }

    const payload: CreateParentLinkRequest = {
      parentEmail,
      studentEmail,
      relation: relation || undefined,
    };

    try {
      await createMutation.mutateAsync(payload);
      toast.success("Parent-student link created successfully");
      reset();
      onSuccess();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to create parent-student link"
      );
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create Parent-Student Link</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="space-y-2">
            <Label htmlFor="parent-email">Parent Email</Label>
            <Input
              id="parent-email"
              type="email"
              placeholder="parent@example.com"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              required
            />
            <p className="text-[10px] text-gray-400">
              Enter the registered email of the parent account.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-email">Student Email</Label>
            <Input
              id="student-email"
              type="email"
              placeholder="student@example.com"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
            />
            <p className="text-[10px] text-gray-400">
              Enter the registered email of the student account.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relation">Relation (optional)</Label>
            <Select value={relation} onValueChange={(val) => setRelation(val ?? "")}>
              <SelectTrigger id="relation" className="w-full">
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FATHER">Father</SelectItem>
                <SelectItem value="MOTHER">Mother</SelectItem>
                <SelectItem value="GUARDIAN">Guardian</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-[#3730A3] hover:bg-[#2e288a] text-white cursor-pointer"
            >
              {createMutation.isPending ? "Creating..." : "Create Link"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
