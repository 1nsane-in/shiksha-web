"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Badge,
} from "@/ui";
import {
  Plus,
  Search,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const durationColors: Record<string, string> = {
  "4 years": "bg-blue-50 text-blue-700",
  "5 years": "bg-purple-50 text-purple-700",
  "6 years": "bg-amber-50 text-amber-700",
  "3 years": "bg-teal-50 text-teal-700",
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
  const [page, setPage] = useState(1);
  const isLoading = false;

  // Mock filtered data
  const courses = mockCourses.filter((course) => {
    if (search && !course.name.toLowerCase().includes(search.toLowerCase()) &&
        !course.fullName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalPages = 1;

  return (
    <div className="flex flex-1 flex-col gap-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-navy">
            Courses
          </h1>
          <p className="text-sm text-slate-500">
            Manage medical courses, degrees, and program offerings.
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/courses/new")}
          size="sm"
          className="bg-royal-blue hover:bg-navy-light text-white font-medium cursor-pointer flex items-center gap-1.5 h-10 px-4"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white border border-slate-200 rounded-xl p-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-white border-slate-200 text-sm h-10"
          />
        </div>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2 className="h-6 w-6 text-royal-blue animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-500 bg-white border border-slate-200 rounded-xl">
          No courses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md hover:border-royal-blue/20 group"
              onClick={() => router.push(`/admin/courses/${course.id}`)}
            >
              {/* Icon & Name */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-royal-blue/10 flex items-center justify-center shrink-0 group-hover:bg-royal-blue/20 transition-colors">
                  <GraduationCap className="h-6 w-6 text-royal-blue" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-lg text-navy truncate">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                    {course.fullName}
                  </p>
                </div>
              </div>

              {/* Duration Badge */}
              <div className="mb-4">
                <Badge
                  className={`${durationColors[course.duration] || "bg-gray-50 text-gray-700"} border-0 font-semibold text-xs`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {course.duration}
                </Badge>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{course.universityCount}</span>
                  <span className="text-gray-400">universities</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">{course.degreeType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
              className="cursor-pointer border-slate-200 hover:bg-white bg-white text-xs h-9"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="cursor-pointer border-slate-200 hover:bg-white bg-white text-xs h-9"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
