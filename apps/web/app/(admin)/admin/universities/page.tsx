"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import {
  Plus,
  Search,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldAlert,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useAdminUniversities,
  useUpdateUniversityStatus,
} from "@/domains/universities";

const typeColors: Record<string, string> = {
  GOVERNMENT: "bg-blue-50 text-blue-700 border-blue-200",
  PRIVATE: "bg-purple-50 text-purple-700 border-purple-200",
  DEEMED: "bg-amber-50 text-amber-700 border-amber-200",
  AUTONOMOUS: "bg-teal-50 text-teal-700 border-teal-200",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  DRAFT: "bg-gray-50 text-gray-700 border-gray-200",
  UNDER_REVIEW: "bg-yellow-50 text-yellow-700 border-yellow-200",
  INACTIVE: "bg-red-50 text-red-700 border-red-200",
  SUSPENDED: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function UniversitiesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filters = {
    page,
    limit: 50,
    ...(search.trim() && { search: search.trim() }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(typeFilter !== "all" && { type: typeFilter }),
  };

  const { data: universitiesData, isLoading } = useAdminUniversities(filters);
  const updateStatus = useUpdateUniversityStatus();
  const universities = universitiesData?.data ?? [];
  const totalPages = universitiesData?.meta?.totalPages ?? 1;

  const handleStatusToggle = (
    e: React.MouseEvent,
    uniId: string,
    currentStatus: string,
  ) => {
    e.stopPropagation();
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateStatus.mutate({ id: uniId, status: nextStatus });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#111]">
            Universities
          </h1>
          <p className="text-sm text-[#666]">
            Onboard and manage medical school information, academic courses, and
            admissions.
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/universities/new")}
          size="sm"
          className="bg-[#3730A3] hover:bg-[#2e288a] text-white font-medium cursor-pointer flex items-center gap-1.5 h-10 px-4"
        >
          <Plus className="h-4 w-4" />
          Add University
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-[#FAFAF8] border border-[#ECEAE6] rounded-xl p-4">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or abbreviation..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-white border-[#E5E7EB] text-sm h-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value ?? "all")}
          >
            <SelectTrigger className="w-full sm:w-[140px] bg-white border-[#E5E7EB] text-xs h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value ?? "all")}
          >
            <SelectTrigger className="w-full sm:w-[140px] bg-white border-[#E5E7EB] text-xs h-10">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="GOVERNMENT">Government</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
              <SelectItem value="DEEMED">Deemed</SelectItem>
              <SelectItem value="AUTONOMOUS">Autonomous</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="flex flex-col gap-3 md:hidden">
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="h-6 w-6 text-[#3730A3] animate-spin" />
          </div>
        ) : universities.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-500 bg-white border border-[#ECEAE6] rounded-xl">
            No universities matched your search.
          </div>
        ) : (
          universities.map((uni) => (
            <div
              key={uni.id}
              className="cursor-pointer rounded-xl border border-[#ECEAE6] bg-white p-4 transition-all hover:shadow-md active:bg-[#FAFAF8]"
              onClick={() => router.push(`/admin/universities/${uni.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-base font-bold text-[#111]">
                    {uni.name}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium">
                    {uni.shortName}
                  </p>
                </div>
                <Badge
                  className={`shrink-0 text-[10px] uppercase font-bold py-0.5 px-2 border ${
                    statusColors[uni.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {uni.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 border-t pt-3 border-gray-100">
                <span className="flex items-center gap-1 font-semibold text-[10px] text-[#3730A3]">
                  <Building2 className="h-3 w-3" /> {uni.type}
                </span>
                {uni.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {uni.location.city},{" "}
                    {uni.location.country}
                  </span>
                )}
                <span className="text-[10px] font-mono">
                  Est. {uni.establishedYear}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border p-2 border-[#ECEAE6] bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#FAFAF8] border-[#ECEAE6]">
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                University
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                Type
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                Location
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4 text-center">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4 text-center">
                Est.
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <Loader2 className="h-6 w-6 text-[#3730A3] animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : universities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-sm text-[#888]"
                >
                  No universities found matching current filters.
                </TableCell>
              </TableRow>
            ) : (
              universities.map((uni) => (
                <TableRow
                  key={uni.id}
                  className="cursor-pointer border-[#ECEAE6] hover:bg-[#F2F1ED] transition-colors"
                  onClick={() => router.push(`/admin/universities/${uni.id}`)}
                >
                  <TableCell className="py-4">
                    <div>
                      <div className="font-bold text-sm text-[#111]">
                        {uni.name}
                      </div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5">
                        {uni.shortName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border uppercase text-[10px] font-bold ${typeColors[uni.type] || "bg-gray-50 text-gray-700 border-gray-200"}`}
                    >
                      {uni.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {uni.location ? (
                      <div className="text-sm">
                        <div className="font-medium text-[#111]">
                          {uni.location.city}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {uni.location.country}
                        </div>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`uppercase text-[10px] font-bold py-0.5 px-2.5 rounded-full border ${
                        statusColors[uni.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {uni.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm font-medium text-[#111]">
                    {uni.establishedYear}
                  </TableCell>
                  <TableCell
                    className="text-right py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/universities/${uni.id}`)
                        }
                        className="text-[#3730A3] hover:text-[#2e288a] font-semibold text-xs cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`font-semibold text-xs cursor-pointer h-8 flex items-center gap-1 px-3 ${
                          uni.status === "ACTIVE"
                            ? "text-red-700 border-red-200 hover:bg-red-50 bg-white"
                            : "text-green-700 border-green-200 hover:bg-green-50 bg-white"
                        }`}
                        onClick={(e) =>
                          handleStatusToggle(e, uni.id, uni.status)
                        }
                        disabled={updateStatus.isPending}
                      >
                        {uni.status === "ACTIVE" ? (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5" /> Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" /> Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">
            Showing page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="cursor-pointer border-[#ECEAE6] hover:bg-[#FAFAF8] bg-white text-xs h-9"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="cursor-pointer border-[#ECEAE6] hover:bg-[#FAFAF8] bg-white text-xs h-9"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
