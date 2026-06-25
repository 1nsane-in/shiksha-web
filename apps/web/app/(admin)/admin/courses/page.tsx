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
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

const durationColors: Record<string, string> = {
  "4 years": "bg-blue-50 text-blue-700 border-blue-200",
  "5 years": "bg-purple-50 text-purple-700 border-purple-200",
  "6 years": "bg-amber-50 text-amber-700 border-amber-200",
  "3 years": "bg-teal-50 text-teal-700 border-teal-200",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  INACTIVE: "bg-gray-50 text-gray-700 border-gray-200",
};

// Mock data - replace with actual API hook
const mockCourses = [
  {
    id: "1",
    name: "MBBS",
    fullName: "Bachelor of Medicine and Bachelor of Surgery",
    duration: "5 years",
    degreeType: "Undergraduate",
    status: "ACTIVE",
    universityCount: 12,
  },
  {
    id: "2",
    name: "BDS",
    fullName: "Bachelor of Dental Surgery",
    duration: "4 years",
    degreeType: "Undergraduate",
    status: "ACTIVE",
    universityCount: 8,
  },
  {
    id: "3",
    name: "BAMS",
    fullName: "Bachelor of Ayurvedic Medicine and Surgery",
    duration: "5 years",
    degreeType: "Undergraduate",
    status: "ACTIVE",
    universityCount: 6,
  },
  {
    id: "4",
    name: "MD",
    fullName: "Doctor of Medicine",
    duration: "3 years",
    degreeType: "Postgraduate",
    status: "ACTIVE",
    universityCount: 15,
  },
];

export default function CoursesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const isLoading = false;

  // Mock filtered data
  const courses = mockCourses.filter((course) => {
    if (search && !course.name.toLowerCase().includes(search.toLowerCase()) &&
        !course.fullName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "all" && course.status !== statusFilter) return false;
    if (degreeFilter !== "all" && course.degreeType !== degreeFilter) return false;
    return true;
  });

  const totalPages = 1;

  return (
    <div className="flex flex-1 flex-col gap-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#111]">
            Courses
          </h1>
          <p className="text-sm text-[#666]">
            Manage medical courses, degrees, and program offerings.
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/courses/new")}
          size="sm"
          className="bg-[#3730A3] hover:bg-[#2e288a] text-white font-medium cursor-pointer flex items-center gap-1.5 h-10 px-4"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-[#FAFAF8] border border-[#ECEAE6] rounded-xl p-4">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-white border-[#E5E7EB] text-sm h-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value ?? "all")}
            >
              <SelectTrigger className="w-full sm:w-[140px] bg-white border-[#E5E7EB] text-xs h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Degree Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Type</label>
            <Select
              value={degreeFilter}
              onValueChange={(value) => setDegreeFilter(value ?? "all")}
            >
              <SelectTrigger className="w-full sm:w-[140px] bg-white border-[#E5E7EB] text-xs h-9">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                <SelectItem value="Diploma">Diploma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Refresh Button */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-transparent uppercase tracking-wider">Action</label>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="h-9 px-3 border-[#E5E7EB] hover:bg-white"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="flex flex-col gap-3 md:hidden">
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="h-6 w-6 text-[#3730A3] animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-500 bg-white border border-[#ECEAE6] rounded-xl">
            No courses found.
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="cursor-pointer rounded-xl border border-[#ECEAE6] bg-white p-4 transition-all hover:shadow-md active:bg-[#FAFAF8]"
              onClick={() => router.push(`/admin/courses/${course.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#3730A3]" />
                    <h4 className="truncate text-base font-bold text-[#111]">
                      {course.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    {course.fullName}
                  </p>
                </div>
                <Badge
                  className={`shrink-0 text-[10px] uppercase font-bold py-0.5 px-2 border ${
                    statusColors[course.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {course.status}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 border-t pt-3 border-gray-100">
                <span className="flex items-center gap-1 font-semibold text-[10px] text-[#3730A3]">
                  <Clock className="h-3 w-3" /> {course.duration}
                </span>
                <span className="text-[10px]">{course.degreeType}</span>
                <span className="text-[10px]">{course.universityCount} universities</span>
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
                Course
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                Duration
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                Type
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4 text-center">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4 text-center">
                Universities
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
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-sm text-[#888]"
                >
                  No courses found matching current filters.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow
                  key={course.id}
                  className="cursor-pointer border-[#ECEAE6] hover:bg-[#F2F1ED] transition-colors"
                  onClick={() => router.push(`/admin/courses/${course.id}`)}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#3730A3]/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#3730A3]" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#111]">
                          {course.name}
                        </div>
                        <div className="text-xs text-gray-400 font-medium mt-0.5">
                          {course.fullName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border uppercase text-[10px] font-bold ${
                        durationColors[course.duration] || "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {course.duration}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-[#111]">{course.degreeType}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`uppercase text-[10px] font-bold py-0.5 px-2.5 rounded-full border ${
                        statusColors[course.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm text-[#111]">
                    {course.universityCount}
                  </TableCell>
                  <TableCell
                    className="text-right py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/courses/${course.id}`)
                      }
                      className="text-[#3730A3] hover:text-[#2e288a] font-semibold text-xs cursor-pointer"
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
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
