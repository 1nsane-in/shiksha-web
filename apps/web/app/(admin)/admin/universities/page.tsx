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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUniversities, useDeleteUniversity, useUpdateUniversityStatus } from "@/domains/universities";

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
    limit: 10,
    ...(search && { search }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(typeFilter !== "all" && { type: typeFilter }),
  };

  const { data: universitiesData, isLoading } = useUniversities(filters);
  const universities = universitiesData?.data ?? [];
  const totalPages = universitiesData?.totalPages ?? 1;

  const deleteMutation = useDeleteUniversity();
  const statusMutation = useUpdateUniversityStatus();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete university:", error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await statusMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D2154]">Universities</h1>
          <p className="text-sm text-[#6B6B6B]">
            Manage university onboarding and information
          </p>
        </div>
        <Button onClick={() => router.push("/admin/universities/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add University
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" />
          <Input
            placeholder="Search universities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
            <SelectTrigger className="w-[150px]">
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
            <SelectTrigger className="w-[150px]">
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

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>University</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Established</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : universities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No universities found
                </TableCell>
              </TableRow>
            ) : (
              universities.map((uni) => (
                <TableRow key={uni.id}>
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
                    <Badge variant="outline">{uni.type}</Badge>
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
                      "-"
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
                  <TableCell>{uni._count?.courses || 0}</TableCell>
                  <TableCell>{uni._count?.applications || 0}</TableCell>
                  <TableCell>{uni.establishedYear}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/universities/${uni.id}`)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/universities/${uni.id}/edit`)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/universities/${uni.id}/documents`)
                          }
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Documents
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {uni.status !== "ACTIVE" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(uni.id, "ACTIVE")}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        {uni.status === "ACTIVE" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(uni.id, "SUSPENDED")
                            }
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(uni.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6B6B6B]">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
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

