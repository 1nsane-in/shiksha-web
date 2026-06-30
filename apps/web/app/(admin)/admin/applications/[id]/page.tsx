// @ts-nocheck
"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { useApplication, useUpdateApplicationStatus } from "@/domains/applications/applications.queries";
import { AlertCircle, Loader2 } from "lucide-react";
import { ReviewActionPanel } from "@/components/admin/applications/detail/review-action-panel";
import { ApplicantDetails } from "@/components/admin/applications/detail/applicant-details";
import { SubmittedDocuments } from "@/components/admin/applications/detail/submitted-documents";
import { PaymentLedger } from "@/components/admin/applications/detail/payment-ledger";
import { ApplicationTimeline } from "@/components/admin/applications/detail/application-timeline";
import { ApplicationSidebar } from "@/components/admin/applications/detail/application-sidebar";
import { AdmissionLetterUpload } from "@/components/admin/applications/detail/admission-letter-upload";
import { ApplicationDetailHeader } from "@/components/admin/applications/detail/application-detail-header";

export default function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: app, isLoading, error } = useApplication(id);
  const updateStatus = useUpdateApplicationStatus();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#111111]" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <AlertCircle className="size-10 text-red-500" />
        <p className="text-sm font-medium text-[#111111]">Application not found</p>
        <Button onClick={() => router.push("/admin/applications")} variant="outline" className="border-[#d3cec6] bg-white text-[#111111]">
          Back to Applications
        </Button>
      </div>
    );
  }

  const handleApprove = async () => {
    await updateStatus.mutateAsync({ id, status: "approved" });
    router.refresh();
  };

  const handleReject = async () => {
    window.prompt("Rejection reason (optional):");
    try {
      await updateStatus.mutateAsync({ id, status: "rejected" });
      router.refresh();
    } catch {}
  };

  return (
    <div className="min-h-screen text-[#111111] font-sans antialiased pb-12">
      <ApplicationDetailHeader
        id={id}
        firstName={app.firstName}
        lastName={app.lastName}
        status={app.status}
        isPending={updateStatus.isPending}
        showActions={app.status === "pending"}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {app.status === "pending" && (
              <ReviewActionPanel
                applicationId={id}
                firstName={app.firstName}
                onApprove={handleApprove}
                onReject={handleReject}
                isPending={updateStatus.isPending}
              />
            )}

            <ApplicantDetails
              formData={app.formData as Record<string, any> | null}
              firstName={app.firstName}
              lastName={app.lastName}
              email={app.email}
              selectedProgram={app.selectedProgram}
            />

            <SubmittedDocuments documents={app.student?.documents || []} />

            {app.status === "approved" && (
              <AdmissionLetterUpload
                applicationId={id}
                existingLetter={app.admissionLetter}
              />
            )}

            <PaymentLedger payments={app.student?.payments || []} />

            <ApplicationTimeline events={app.timelineEvents || []} />
          </div>

          <div className="space-y-6">
            <ApplicationSidebar
              university={app.university}
              student={app.student}
              timelineEvents={app.timelineEvents}
              submittedAt={app.submittedAt}
              createdAt={app.createdAt}
              updatedAt={app.updatedAt}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
