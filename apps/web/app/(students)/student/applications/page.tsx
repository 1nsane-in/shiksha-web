"use client";

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { Card } from "@repo/ui";
import { useMyApplications } from "@/domains/student/student.queries";
import {
  FileText,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Building2,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending Review", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  approved: { label: "Approved", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-red-600 bg-red-50 border-red-200", icon: XCircle },
  in_review: { label: "In Review", color: "text-blue-600 bg-blue-50 border-blue-200", icon: AlertCircle },
};

export default function MyApplicationsPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useMyApplications(1, 50);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-6 animate-spin text-[#4B2D8E]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-600">Failed to load applications</p>
        <Button variant="outline" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const applications = data?.data ?? [];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-[#2D2154]">My Applications</h1>
          <p className="text-sm text-[#6B6B6B]">
            {applications.length > 0
              ? `You have submitted ${applications.length} application${applications.length > 1 ? 's' : ''}`
              : 'No applications yet'}
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <FileText className="size-12 text-[#D0C8E0]" />
          <p className="text-[#6B6B6B]">No applications submitted yet</p>
          <Button onClick={() => router.push('/')}>
            Browse Universities
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const status = statusConfig[app.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <Card
                key={app.id}
                className="p-5 border border-[#E0D8F0] hover:border-[#F0A030]/50 transition-all cursor-pointer"
                onClick={() => router.push(`/student/applications/${app.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="size-4 text-[#8B7FAD] shrink-0" />
                      <h3 className="font-semibold text-[#2D2154] truncate">
                        {app.university?.name || 'University'}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#6B6B6B]">
                      <span>{app.firstName} {app.lastName}</span>
                      {app.selectedProgram && (
                        <>
                          <span className="text-[#D0C8E0]">|</span>
                          <span>{app.selectedProgram}</span>
                        </>
                      )}
                      <span className="text-[#D0C8E0]">|</span>
                      <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                      <StatusIcon className="size-3" />
                      {status.label}
                    </span>
                    <ExternalLink className="size-4 text-[#8B7FAD]" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

