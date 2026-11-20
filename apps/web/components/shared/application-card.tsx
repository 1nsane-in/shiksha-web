"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/ui";
import { Building2, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import type { StudentApplication } from "@/domains/student/student.types";
import { formatDate } from "@/lib/utils";

interface ApplicationCardProps {
  application: StudentApplication;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();

  return (
    <Card
      className="p-5 border border-border hover:border-royal-blue/50 transition-all cursor-pointer"
      onClick={() => router.push(`/student/applications/${application.id}`)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="size-4 text-slate-400 shrink-0" />
            <h3 className="font-semibold text-navy truncate">
              {application.university?.name || "University"}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>
              {application.firstName} {application.lastName}
            </span>
            {application.selectedProgram && (
              <>
                <span className="text-slate-300">|</span>
                <span>{application.selectedProgram}</span>
              </>
            )}
            <span className="text-slate-300">|</span>
            <span>{formatDate(application.submittedAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={application.status} />
          <ExternalLink className="size-4 text-slate-400" />
        </div>
      </div>
    </Card>
  );
}
