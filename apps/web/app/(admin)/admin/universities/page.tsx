"use client";

import { useState } from "react";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
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
import { Badge } from "@repo/ui";
import {
  Plus,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminUniversities, useUpdateUniversityStatus } from "@/domains/universities";

interface University {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  type: string;
  status: string;
  establishedYear: number;
  location?: {
    country: string;
    city: string;
  };
  _count?: {
    courses: number;
    applications: number;
  };
  createdAt: string;
}

const typeColors: Record<string, string> = {
  GOVERNMENT: "bg-blue-50 text-blue-700 border-blue-200",
  PRIVATE: "bg-purple-50 text-purple-700 border-purple-200",
};

const statusColors = {
  DRAFT: "bg-gray-500",
  UNDER_REVIEW: "bg-yellow-500",
  ACTIVE: "bg-green-500",
  INACTIVE: "bg-red-500",
  SUSPENDED: "bg-orange-500",
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
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(typeFilter !== "all" && { type: typeFilter }),
  };

  const { data: universitiesData, isLoading } = useAdminUniversities(filters);
  const updateStatus = useUpdateUniversityStatus();
  const allUniversities = universitiesData?.data ?? [];
  const universities = search.trim()
    ? allUniversities.filter((uni) => {
        const q = search.trim().toLowerCase();
        return uni.name.toLowerCase().includes(q) || uni.shortName.toLowerCase().includes(q);
      })
    : allUniversities;
  const totalPages = universitiesData?.meta?.totalPages ?? 1;

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2D2154] sm:text-2xl">Universities</h1>
          <p className="text-xs text-[#6B6B6B] sm:text-sm">
            Manage university onboarding and information
          </p>
        </div>
        <Button onClick={() => router.push("/admin/universities/new")} size="sm" className="w-fit">
          <Plus className="mr-1.5 h-4 w-4" />
          Add University
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" />
          <Input
            placeholder="Search universities..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value ?? "all")}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="GOVERNMENT">Government</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="flex flex-col gap-2.5 md:hidden">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-[#6B6B6B]">Loading...</div>
        ) : universities.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#6B6B6B]">No universities found</div>
        ) : (
          universities.map((uni) => (
            <div
              key={uni.id}
              className="cursor-pointer rounded-lg border border-[#ECEAE6] bg-white p-3.5 transition-colors active:bg-[#F5F4F2] sm:p-4"
              onClick={() => router.push(`/admin/universities/${uni.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#2D2154]">{uni.name}</p>
                  <p className="text-xs text-[#6B6B6B]">{uni.shortName}</p>
                </div>
                <Badge
                  className={`shrink-0 text-[10px] ${
                    statusColors[uni.status as keyof typeof statusColors]
                  } text-white`}
                >
                  {uni.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B6B6B]">
                <span>{uni.type}</span>
                {uni.location && <span>{uni.location.city}, {uni.location.country}</span>}
                <span>Est. {uni.establishedYear}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-[#ECEAE6] bg-white md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#FAFAF8]">
              <TableHead className="text-xs font-medium text-[#6B6B6B]">University</TableHead>
              <TableHead className="text-xs font-medium text-[#6B6B6B]">Type</TableHead>
              <TableHead className="text-xs font-medium text-[#6B6B6B]">Location</TableHead>
              <TableHead className="text-xs font-medium text-[#6B6B6B]">Status</TableHead>
              <TableHead className="text-xs font-medium text-[#6B6B6B]">Est.</TableHead>
              <TableHead className="text-xs font-medium text-[#6B6B6B] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-sm text-[#6B6B6B]">
                  Loading...
                </TableCell>
              </TableRow>
            ) : universities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-sm text-[#6B6B6B]">
                  No universities found
                </TableCell>
              </TableRow>
            ) : (
              universities.map((uni) => (
                <TableRow
                  key={uni.id}
                  className="cursor-pointer transition-colors hover:bg-[#F9F8F6]"
                  onClick={() => router.push(`/admin/universities/${uni.id}`)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-[#2D2154]">
                        {uni.name}
                      </div>
                      <div className="text-sm text-[#6B6B6B]">
                        {uni.shortName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${typeColors[uni.type] || "bg-gray-50 text-gray-700 border-gray-200"}`}>{uni.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {uni.location ? (
                      <div className="text-sm">
                        <div>{uni.location.city}</div>
                        <div className="text-[#6B6B6B]">
                          {uni.location.country}
                        </div>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        statusColors[uni.status as keyof typeof statusColors]
                      } text-white`}
                    >
                      {uni.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{uni.establishedYear}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={uni.status === "ACTIVE" ? "outline" : "default"}
                      size="sm"
                      className={uni.status === "ACTIVE" ? "text-amber-700 border-amber-300 hover:bg-amber-50" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus.mutate({ id: uni.id, status: uni.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
                      }}
                      disabled={updateStatus.isPending}
                    >
                      {uni.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#6B6B6B] sm:text-sm">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

