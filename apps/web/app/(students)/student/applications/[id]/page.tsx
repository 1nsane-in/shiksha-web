"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import {
  useMyApplicationById,
  useStageInfo,
} from "@/domains/student/student.queries";
import { useApplicationTimeline } from "@/domains/timeline";
import type { TimelineEvent } from "@/domains/timeline";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe,
  GraduationCap,
  Languages,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plane,
  User,
  XCircle,
} from "lucide-react";

// --- Status Configuration ---
const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending Review",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    icon: Clock,
  },
  in_review: {
    label: "In Review",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: FileText,
  },
  approved: {
    label: "Approved",
    color: "text-green-600 bg-green-50 border-green-200",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: XCircle,
  },
};

// --- Stage Actions Mapping ---
const stageActions: Record<
  number,
  { label: string; href: string; description: string; icon: React.ElementType }
> = {
  2: {
    label: "Pay Admission Fee",
    href: "/student/payments",
    description: "Pay ₹5,000 to proceed",
    icon: CreditCard,
  },
  3: {
    label: "View Exam Details",
    href: "/student/exams",
    description: "Check exam schedule & pay ₹10,000",
    icon: GraduationCap,
  },
  4: {
    label: "View Invitation Letter",
    href: "/student/letters",
    description: "Download your invitation letter",
    icon: FileText,
  },
  5: {
    label: "Visa Support",
    href: "/student/visa-support",
    description: "Get visa and travel assistance",
    icon: Plane,
  },
};

// --- Stage Names ---
const stageNames: Record<number, string> = {
  1: "Application",
  2: "Admission Fee",
  3: "Entrance Exam",
  4: "Invitation Letter",
  5: "Visa Support",
};

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: app, isLoading, error } = useMyApplicationById(id);
  const { data: stageInfo } = useStageInfo();
  const { data: timeline, isError: timelineError } = useApplicationTimeline(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-6 animate-spin text-[#4B2D8E]" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-600">Application not found</p>
        <Button
          variant="outline"
          onClick={() => router.push("/student/applications")}
        >
          Back to Applications
        </Button>
      </div>
    );
  }

  const status = statusConfig[app.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const formData = app.formData;
  const currentStage = stageInfo?.currentStage ?? 1;
  const currentAction =
    app.status === "approved" ? stageActions[currentStage] : undefined;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/student/applications")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#2D2154]">
            Application Details
          </h1>
          <p className="text-sm text-[#6B6B6B]">
            Submitted on{" "}
            {app.submittedAt
              ? new Date(app.submittedAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Status Badge + Stage Indicator */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${status.color}`}
        >
          <StatusIcon className="size-4" />
          {status.label}
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#F9F9F9] px-3 py-1 text-sm text-[#6B6B6B]">
          <span className="font-medium text-[#2D2154]">
            Stage {currentStage}
          </span>
          <span>•</span>
          <span>{stageNames[currentStage] || "Unknown"}</span>
        </div>
      </div>

      {/* Stage Action Card */}
      {currentAction && (
        <Card className="mb-6 border-[#4B2D8E]/20 bg-[#4B2D8E]/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#4B2D8E]/10 p-2">
                <currentAction.icon className="size-5 text-[#4B2D8E]" />
              </div>
              <div>
                <p className="font-medium text-[#2D2154]">
                  {currentAction.label}
                </p>
                <p className="text-sm text-[#6B6B6B]">
                  {currentAction.description}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => router.push(currentAction.href)}
              className="bg-[#4B2D8E] hover:bg-[#3D2475]"
            >
              Proceed
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
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
                <InfoField
                  label="Full Name"
                  value={
                    formData
                      ? [
                          formData.firstName,
                          formData.middleName,
                          formData.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ")
                      : `${app.firstName || ""} ${app.lastName || ""}`.trim() ||
                        "N/A"
                  }
                />
                <InfoField
                  label="Date of Birth"
                  value={
                    formData?.dateOfBirth
                      ? new Date(formData.dateOfBirth).toLocaleDateString()
                      : "N/A"
                  }
                />
                <InfoField
                  label="Citizenship"
                  value={formData?.citizenship || "N/A"}
                />
                <InfoField
                  label="Gender"
                  value={formData?.gender ? capitalize(formData.gender) : "N/A"}
                />
                <InfoField
                  label="Marital Status"
                  value={
                    formData?.maritalStatus
                      ? capitalize(formData.maritalStatus)
                      : "N/A"
                  }
                />
                <InfoField
                  label="Email"
                  value={formData?.email || app.email || "N/A"}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Section */}
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
                  <InfoField
                    label="City"
                    value={formData.permanentCity || "N/A"}
                  />
                  <InfoField
                    label="State"
                    value={formData.permanentState || "N/A"}
                  />
                  <InfoField
                    label="ZIP Code"
                    value={formData.permanentZip || "N/A"}
                  />
                  <InfoField
                    label="Country"
                    value={formData.permanentCountry || "N/A"}
                  />
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
                  {formData.language2 && (
                    <LanguageRow language={formData.language2} />
                  )}
                  {formData.otherLanguages &&
                    formData.otherLanguages.length > 0 && (
                      <div className="text-sm">
                        <span className="text-[#6B6B6B]">
                          Other languages:{" "}
                        </span>
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
              <InfoField
                label="Selected Program"
                value={
                  formData?.selectedProgram
                    ? formatProgram(formData.selectedProgram)
                    : app.selectedProgram || "N/A"
                }
              />
              {formData?.postGraduateDetail && (
                <div className="mt-3">
                  <InfoField
                    label="Post-Graduate Detail"
                    value={formData.postGraduateDetail}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline Section */}
          {!timelineError &&
            timeline &&
            (timeline as TimelineEvent[]).length > 0 && (
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
                          new Date(a.occurredAt).getTime() -
                          new Date(b.occurredAt).getTime(),
                      )
                      .map((event) => (
                        <TimelineItem key={event.id} event={event} />
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* University Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="size-4 text-[#F0A030]" />
                University
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-[#6B6B6B]">Name</p>
                <p className="font-medium text-[#2D2154]">
                  {app.university?.name}
                </p>
              </div>
              {app.university?.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="size-3.5 text-[#6B6B6B] mt-0.5" />
                  <p className="font-medium text-[#2D2154]">
                    {[
                      app.university.location.city,
                      app.university.location.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
              {app.university?.contact?.email && (
                <div className="flex items-start gap-2">
                  <Mail className="size-3.5 text-[#6B6B6B] mt-0.5" />
                  <p className="text-[#2D2154]">
                    {app.university.contact.email}
                  </p>
                </div>
              )}
              {app.university?.contact?.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="size-3.5 text-[#6B6B6B] mt-0.5" />
                  <p className="text-[#2D2154]">
                    {app.university.contact.phone}
                  </p>
                </div>
              )}
              {app.university?.slug && (
                <Link
                  href={`/student/university/${app.university.slug}`}
                  className="inline-flex items-center gap-1 text-[#4B2D8E] hover:underline text-sm mt-2"
                >
                  <Globe className="size-3.5" />
                  View University Page
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Next Step Card (sidebar) */}
          {currentAction && (
            <Card className="border-[#4B2D8E]/20">
              <CardHeader>
                <CardTitle className="text-base text-[#2D2154]">
                  Next Step
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <currentAction.icon className="size-4 text-[#4B2D8E]" />
                    <span className="font-medium text-sm">
                      {currentAction.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B6B6B]">
                    {currentAction.description}
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-[#4B2D8E] hover:bg-[#3D2475]"
                    onClick={() => router.push(currentAction.href)}
                  >
                    Proceed
                    <ArrowRight className="size-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function InfoField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[#6B6B6B]">{label}</p>
      <p className="font-medium text-[#2D2154]">{value}</p>
    </div>
  );
}

function LanguageRow({
  language,
}: {
  language: {
    name: string;
    speaking: string;
    reading: string;
    writing: string;
  };
}) {
  return (
    <div className="flex items-center gap-4 text-sm border-b border-[#F0F0F0] pb-2 last:border-0 last:pb-0 flex-wrap">
      <span className="font-medium text-[#2D2154] min-w-[80px]">
        {language.name}
      </span>
      <Badge variant="outline" className="text-xs">
        Speaking: {language.speaking}
      </Badge>
      <Badge variant="outline" className="text-xs">
        Reading: {language.reading}
      </Badge>
      <Badge variant="outline" className="text-xs">
        Writing: {language.writing}
      </Badge>
    </div>
  );
}

function TimelineItem({ event }: { event: TimelineEvent }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`size-3 rounded-full mt-1 ${
            event.isCompleted
              ? "bg-green-500"
              : event.isActive
                ? "bg-[#4B2D8E]"
                : "bg-[#E5E5E5]"
          }`}
        />
        <div className="w-px flex-1 bg-[#E5E5E5]" />
      </div>
      <div className="pb-4">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm text-[#2D2154]">{event.title}</p>
          <span className="text-xs text-[#6B6B6B] bg-[#F5F5F5] px-1.5 py-0.5 rounded">
            Stage {event.stage}
          </span>
        </div>
        {event.description && (
          <p className="text-sm text-[#6B6B6B] mt-0.5">{event.description}</p>
        )}
        <p className="text-xs text-[#999] mt-1">
          {new Date(event.occurredAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

// --- Utility Functions ---

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatProgram(program: string): string {
  const programNames: Record<string, string> = {
    "pre-medical": "Pre-Medical",
    "general-medicine": "General Medicine (MBBS)",
    dentistry: "Dentistry (BDS)",
    "post-graduate": "Post-Graduate",
  };
  return programNames[program] || program;
}
