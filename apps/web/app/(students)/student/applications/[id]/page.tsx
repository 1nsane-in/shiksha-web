"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@repo/ui";
import { Loader2 } from "lucide-react";
import {
  User,
  MapPin,
  Languages,
  GraduationCap,
  Clock,
} from "lucide-react";

import { useMyApplicationById, useStageInfo } from "@/domains/student/student.queries";
import { useApplicationTimeline } from "@/domains/timeline";
import { useMyAdmissionLetter } from "@/domains/letters";
import { stageActions, stageNames } from "@/domains/student/student.constants";
import type { TimelineEvent } from "@/domains/timeline";
import type { SubmitApplicationFormData } from "@/domains/student/student.types";
import { formatDate, formatProgram } from "@/lib/utils";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { InfoField } from "@/components/shared/info-field";
import { LanguageRow } from "@/components/shared/language-row";
import { TimelineItem } from "@/components/shared/timeline-item";
import { StageActionCard, LockedStageCard } from "@/components/shared/stage-action-card";
import { LockedNextStepCard, NextStepCard } from "@/components/shared/next-step-card";
import { UniversityInfoCard } from "@/components/shared/university-info-card";

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: app, isLoading, error } = useMyApplicationById(id);
  const { data: stageInfo } = useStageInfo();
  const { data: timeline, isError: timelineError } = useApplicationTimeline(id);
  const { data: admissionLetter } = useMyAdmissionLetter();

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-6 animate-spin text-[#4B2D8E]" />
      </div>
    );
  }

  // ── Error state ──
  if (error || !app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-600">Application not found</p>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
        >
          Back to Applications
        </Button>
      </div>
    );
  }

  const formData = app.formData as SubmitApplicationFormData | null;
  const currentStage = stageInfo?.currentStage ?? 1;
  const isApproved = app.status === "approved";
  const currentAction = isApproved ? stageActions[currentStage] : undefined;
  const isStage2Locked = currentStage === 2 && admissionLetter?.isLocked;
  const fullName = [app.firstName, formData?.middleName, app.lastName]
    .filter(Boolean)
    .join(" ") || "N/A";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Application Details"
        subtitle={app.submittedAt ? `Submitted on ${formatDate(app.submittedAt)}` : undefined}
        backHref="/student/applications"
      />

      {/* Status Badge + Stage Indicator */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <StatusBadge status={app.status} />
        <StageIndicator stage={currentStage} />
      </div>

      {/* Stage Action Banner */}
      {currentAction && isStage2Locked ? (
        <div className="mb-6">
          <LockedStageCard />
        </div>
      ) : currentAction ? (
        <div className="mb-6">
          <StageActionCard action={currentAction} />
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="size-4 text-[#F0A030]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <InfoField label="Full Name" value={fullName} />
                <InfoField
                  label="Date of Birth"
                  value={formData?.dateOfBirth ? formatDate(formData.dateOfBirth) : "N/A"}
                />
                <InfoField label="Citizenship" value={formData?.citizenship || "N/A"} />
                <InfoField
                  label="Gender"
                  value={formData?.gender ? capitalize(formData.gender) : "N/A"}
                />
                <InfoField
                  label="Marital Status"
                  value={formData?.maritalStatus ? capitalize(formData.maritalStatus) : "N/A"}
                />
                <InfoField label="Email" value={formData?.email || app.email || "N/A"} />
                {formData?.placeOfBirth && (
                  <InfoField
                    label="Place of Birth"
                    value={[formData.placeOfBirth.city, formData.placeOfBirth.state, formData.placeOfBirth.country]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  />
                )}
                {formData?.embassyLocation && (
                  <InfoField label="Embassy Location" value={formData.embassyLocation} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          {formData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="size-4 text-[#F0A030]" />
                  Permanent Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <InfoField
                    label="Address"
                    value={formData.permanentAddress || "N/A"}
                    className="sm:col-span-2"
                  />
                  <InfoField label="City" value={formData.permanentCity || "N/A"} />
                  <InfoField label="State" value={formData.permanentState || "N/A"} />
                  <InfoField label="ZIP Code" value={formData.permanentZip || "N/A"} />
                  <InfoField label="Country" value={formData.permanentCountry || "N/A"} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Language Abilities */}
          {formData?.language1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Languages className="size-4 text-[#F0A030]" />
                  Language Abilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <LanguageRow language={formData.language1} />
                  {formData.language2 && <LanguageRow language={formData.language2} />}
                  {formData.otherLanguages && formData.otherLanguages.length > 0 && (
                    <div className="text-sm">
                      <span className="text-[#6B6B6B]">Other languages: </span>
                      <span className="font-medium text-[#2D2154]">
                        {formData.otherLanguages.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Program Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="size-4 text-[#F0A030]" />
                Program Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField
                  label="Selected Program"
                  value={
                    formData?.selectedProgram
                      ? formatProgram(formData.selectedProgram)
                      : app.selectedProgram || "N/A"
                  }
                />
                {formData?.postGraduateDetail && (
                  <InfoField label="Post-Graduate Detail" value={formData.postGraduateDetail} />
                )}
                {formData?.signature && (
                  <InfoField label="Signature" value={formData.signature} />
                )}
                {formData?.signatureDate && (
                  <InfoField
                    label="Signature Date"
                    value={formatDate(formData.signatureDate)}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          {!timelineError && timeline && (timeline as TimelineEvent[]).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="size-4 text-[#F0A030]" />
                  Application Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(timeline as TimelineEvent[])
                    .sort(
                      (a, b) =>
                        new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
                    )
                    .map((event) => (
                      <TimelineItem key={event.id} event={event} />
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          <UniversityInfoCard university={app.university} />

          {/* Next Step Card (sidebar) */}
          {currentAction && isStage2Locked ? (
            <LockedNextStepCard />
          ) : currentAction ? (
            <NextStepCard action={currentAction} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Helper Components ──

function StageIndicator({ stage }: { stage: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#F9F9F9] px-3 py-1 text-sm text-[#6B6B6B]">
      <span className="font-medium text-[#2D2154]">Stage {stage}</span>
      <span>•</span>
      <span>{stageNames[stage] || "Unknown"}</span>
    </div>
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
