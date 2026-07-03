"use client";

import { Button } from "@repo/ui";
import { Loader2, FileText } from "lucide-react";
import { useMyApplications } from "@/domains/student/student.queries";
import { PageHeader } from "@/components/shared/page-header";
import { ApplicationCard } from "@/components/shared/application-card";

export default function MyApplicationsPage() {
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
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const applications = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="My Applications"
        subtitle={
          applications.length > 0
            ? `You have submitted ${applications.length} application${applications.length > 1 ? "s" : ""}`
            : "No applications yet"
        }
      />

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <FileText className="size-12 text-[#D0C8E0]" />
          <p className="text-[#6B6B6B]">No applications submitted yet</p>
          <Button onClick={() => window.location.assign("/")}>
            Browse Universities
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
