"use client";

import { useLinkedChildren } from "@/domains/parents";
import { Card, Badge, Skeleton, Button } from "@repo/ui";
import { LinkByCode } from "@/components/parents/link-by-code";
import {
  GraduationCap,
  FileText,
  ChevronRight,
  Users,
  RefreshCw,
  Building2,
} from "lucide-react";
import Link from "next/link";

function ChildrenSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <Card key={i} className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
              <div className="space-y-1.5 mt-3">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex gap-4 mt-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ChildrenList() {
  const { data: children, isLoading, isError, refetch } = useLinkedChildren();

  if (isLoading) {
    return <ChildrenSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-sm text-gray-500">Failed to load children. Please try again.</p>
        <Button variant="secondary" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!children || children.length === 0) {
    return (
      <div className="space-y-6">
        {/* Empty state banner */}
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="w-16 h-16 rounded-full bg-[#4B2D8E]/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-[#4B2D8E]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">No children linked yet</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Link your child&apos;s account using their family code to track their admission progress.
              Ask them to share their code from their dashboard.
            </p>
          </div>
        </div>

        {/* Link by code component */}
        <LinkByCode />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {children.map((child) => (
        <ChildCard key={child.id} child={child} />
      ))}
    </div>
  );
}

function ChildCard({ child }: { child: import("@/domains/parents").ChildProgress }) {
  const stagePercent = child.totalStages > 0
    ? Math.round((child.currentStage / child.totalStages) * 100)
    : 0;

  const relationLabel =
    child.relation === "FATHER"
      ? "Father"
      : child.relation === "MOTHER"
        ? "Mother"
        : child.relation === "GUARDIAN"
          ? "Guardian"
          : child.relation;

  const statusColor =
    child.applicationStatus === "APPROVED" || child.applicationStatus === "COMPLETED"
      ? "bg-green-100 text-green-700"
      : child.applicationStatus === "REJECTED"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-700";

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header: Name + Relation */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-9 h-9 rounded-full bg-[#4B2D8E]/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[#4B2D8E]" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 truncate">{child.studentName}</h3>
              <p className="text-xs text-gray-500">{child.studentEmail}</p>
            </div>
            {relationLabel && (
              <Badge variant="secondary" className="ml-auto shrink-0">
                {relationLabel}
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Stage {child.currentStage}/{child.totalStages}
              </span>
              <span className="text-gray-700 font-medium">{stagePercent}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4B2D8E] rounded-full transition-all duration-500"
                style={{ width: `${stagePercent}%` }}
              />
            </div>
          </div>

          {/* Status + Stats */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
              {child.applicationStatus}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FileText className="w-3.5 h-3.5" />
              Documents: {child.documentProgress.uploaded}/{child.documentProgress.total}
            </span>
            {child.universityCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Building2 className="w-3.5 h-3.5" />
                {child.universityCount} {child.universityCount === 1 ? "University" : "Universities"}
              </span>
            )}
          </div>
        </div>

        {/* View link */}
        <Link
          href={`/parents/children/${child.studentId}`}
          className="shrink-0 flex items-center gap-1 text-sm font-medium text-[#4B2D8E] hover:text-[#3D2370] transition-colors mt-1"
        >
          View
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  );
}

export default function ParentDashboardPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#4B2D8E]/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-[#4B2D8E]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Children</h1>
          <p className="text-sm text-gray-500">Track your children&apos;s admission progress</p>
        </div>
      </div>

      {/* Children list with loading/empty/error states */}
      <ChildrenList />
    </div>
  );
}
