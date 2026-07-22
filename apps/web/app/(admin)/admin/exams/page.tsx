"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Badge } from "@repo/ui";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Building2,
  MoreHorizontal,
  Filter,
  CheckCircle2,
  Circle,
  Archive,
} from "lucide-react";
import { useExams } from "@/domains/exams/exams.queries";
import { ExamStatus } from "@/domains/exams/exams.types";
import Link from "next/link";

const STATUS_BADGES: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  [ExamStatus.DRAFT]: {
    label: "Draft",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Circle className="h-3 w-3" />,
  },
  [ExamStatus.SCHEDULED]: {
    label: "Scheduled",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Calendar className="h-3 w-3" />,
  },
  [ExamStatus.ACTIVE]: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  [ExamStatus.COMPLETED]: {
    label: "Completed",
    className: "bg-gray-50 text-gray-700 border-gray-200",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  [ExamStatus.ARCHIVED]: {
    label: "Archived",
    className: "bg-slate-50 text-slate-700 border-slate-200",
    icon: <Archive className="h-3 w-3" />,
  },
};

export default function AdminExamsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ExamStatus | "ALL">("ALL");

  const {
    data: examsData,
    isLoading,
    error,
  } = useExams({
    page: 1,
    limit: 50,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const exams = examsData?.data ?? [];

  const filteredExams = exams.filter(
    (exam) =>
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.university?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-[#111111] tracking-tight">
              Online Exams
            </h1>
            <p className="text-sm text-[#626260] mt-1">
              Create and manage entrance exams for university admissions
            </p>
          </div>
          <Link href="/admin/exams/create">
            <Button className="bg-[#111111] hover:bg-[#313130] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Online Exam
            </Button>
          </Link>
        </div>
      </div>
      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9c9fa5]" />
            <Input
              placeholder="Search exams by name or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#d3cec6] bg-white focus:border-[#111111] focus:ring-[#111111]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#626260]" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ExamStatus | "ALL")
              }
              className="h-10 rounded-md border border-[#d3cec6] bg-white px-3 text-sm focus:border-[#111111] focus:ring-[#111111]"
            >
              <option value="ALL">All Status</option>
              <option value={ExamStatus.DRAFT}>Draft</option>
              <option value={ExamStatus.SCHEDULED}>Scheduled</option>
              <option value={ExamStatus.ACTIVE}>Active</option>
              <option value={ExamStatus.COMPLETED}>Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#d3cec6] p-6 animate-pulse"
              >
                <div className="h-6 bg-[#ebe7e1] rounded w-1/3 mb-4" />
                <div className="h-4 bg-[#ebe7e1] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-[#d3cec6] p-12 text-center">
            <p className="text-[#626260]">Failed to load exams</p>
            <Button
              variant="outline"
              className="mt-4 border-[#d3cec6]"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#d3cec6] p-12 text-center">
            <div className="w-16 h-16 bg-[#f5f1ec] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-[#9c9fa5]" />
            </div>
            <h3 className="text-lg font-medium text-[#111111] mb-2">
              {searchQuery ? "No exams found" : "No exams created yet"}
            </h3>
            <p className="text-sm text-[#626260] mb-6 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Create your first online exam to get started with entrance examinations"}
            </p>
            {!searchQuery && (
              <Link href="/admin/exams/create">
                <Button className="bg-[#111111] hover:bg-[#313130] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Online Exam
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExams.map((exam) => {
              const statusBadge =
                STATUS_BADGES[exam.status] || STATUS_BADGES[ExamStatus.DRAFT];

              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-xl border border-[#d3cec6] p-6 hover:border-[#111111] transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/exams/${exam.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-[#111111] truncate">
                          {exam.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`${statusBadge.className} flex items-center gap-1`}
                        >
                          {statusBadge.icon}
                          {statusBadge.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-[#626260] mb-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {exam.university?.name || "Unknown University"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(exam.dateWindowStart).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}{" "}
                          -{" "}
                          {new Date(exam.dateWindowEnd).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {exam.durationMinutes} mins
                        </span>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-[#626260]">
                          <span className="font-medium text-[#111111]">
                            {exam._count?.questions || 0}
                          </span>{" "}
                          questions
                        </span>
                        <span className="text-[#626260]">
                          <span className="font-medium text-[#111111]">
                            {exam._count?.registrations || 0}
                          </span>{" "}
                          registrations
                        </span>
                        <span className="text-[#626260]">
                          Pass:{" "}
                          <span className="font-medium text-[#111111]">
                            {exam.passingPercentage}%
                          </span>
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-[#626260]"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Open actions menu
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
