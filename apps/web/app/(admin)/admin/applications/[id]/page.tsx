// @ts-nocheck
"use client";

import { use, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import {
  useApplication,
  useUpdateApplicationStatus,
} from "@/domains/applications/applications.queries";
import { useUploadAdmissionLetter } from "@/domains/admin/letters.queries";
import { useUploadFile } from "@/domains/documents/documents.queries";
import {
  ArrowLeft,
  Building2,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  MapPin,
  CreditCard,
  MessageSquare,
  History,
  GraduationCap,
  Globe,
  Upload,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; border: string; text: string; bg: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending Review",
    border: "border-amber-200",
    text: "text-amber-800",
    bg: "bg-amber-50/50",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    border: "border-emerald-200",
    text: "text-emerald-800",
    bg: "bg-emerald-50/50",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    border: "border-red-200",
    text: "text-red-800",
    bg: "bg-red-50/50",
    icon: XCircle,
  },
};

const theme = {
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.08)",
  canvas: "#FAF9F6",
  surface: "#FFFFFF",
  hairline: "rgba(26, 21, 58, 0.08)",
};

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#1A153A] break-words">{value || ":"}</p>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border bg-white p-6 transition-all"
      style={{ borderColor: theme.hairline }}
    >
      <div className="mb-5 flex items-center gap-2 border-b pb-3" style={{ borderColor: theme.hairline }}>
        <div className="rounded-lg bg-gray-50 p-1.5">
          <Icon className="h-4 w-4" style={{ color: theme.gold }} />
        </div>
        <h2 className="text-sm font-bold text-[#1A153A]">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
  );
}

export default function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: app, isLoading, error } = useApplication(id);
  const updateStatus = useUpdateApplicationStatus();

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: theme.gold }} />
      </div>
    );

  if (error || !app)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="size-10 text-red-500" />
        <p className="text-sm font-medium text-[#1A153A]">Application not found</p>
        <Button
          onClick={() => router.push("/admin/applications")}
          variant="outline"
        >
          Back to Applications
        </Button>
      </div>
    );

  const status = statusConfig[app.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const fd = app.formData as Record<string, any> | null;
  const student = app.student;
  const uni = app.university;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b pb-5" style={{ borderColor: theme.hairline }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/applications")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white text-gray-500 hover:bg-gray-50 transition-all"
            style={{ borderColor: theme.hairline }}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#1A153A]">
              {app.firstName} {app.lastName}
            </h1>
            <p className="text-xs text-gray-400">
              Application ID: <span className="font-mono text-gray-500">{id}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${status.bg} ${status.border} ${status.text}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </span>
          {app.status === "pending" && (
            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all disabled:opacity-50"
                onClick={() => updateStatus.mutate({ id, status: "approved" })}
                disabled={updateStatus.isPending}
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Approve
              </button>
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-all disabled:opacity-50"
                onClick={() => updateStatus.mutate({ id, status: "rejected" })}
                disabled={updateStatus.isPending}
              >
                <XCircle className="h-3.5 w-3.5" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Applicant info */}
          <Section title="Applicant Demographics" icon={User}>
            <Field
              label="Full Name"
              value={`${app.firstName} ${app.lastName}`}
            />
            <Field label="Email" value={app.email} />
            <Field label="Gender" value={fd?.gender} />
            <Field label="Date of Birth" value={fd?.dateOfBirth ? new Date(fd.dateOfBirth).toLocaleDateString() : null} />
            <Field label="Citizenship" value={fd?.citizenship} />
            <Field label="Marital Status" value={fd?.maritalStatus} />
            <Field label="Embassy Location" value={fd?.embassyLocation} />
            <Field label="Selected Program" value={app.selectedProgram} />
          </Section>

          {/* Place of Birth */}
          {fd?.placeOfBirth && (
            <Section title="Place of Birth" icon={MapPin}>
              <Field label="Birth City" value={fd.placeOfBirth.city} />
              <Field label="Birth State" value={fd.placeOfBirth.state} />
              <Field label="Birth Country" value={fd.placeOfBirth.country} />
            </Section>
          )}

          {/* Permanent Address */}
          {fd?.permanentAddress && (
            <Section title="Permanent Address" icon={MapPin}>
              <Field label="Address" value={fd.permanentAddress} />
              <Field label="City" value={fd.permanentCity} />
              <Field label="State" value={fd.permanentState} />
              <Field label="ZIP Code" value={fd.permanentZip} />
              <Field label="Country" value={fd.permanentCountry} />
            </Section>
          )}

          {/* Language prof */}
          {fd?.language1 && (
            <Section title="Language Proficiency" icon={Globe}>
              <Field label="Primary Language" value={fd.language1.name} />
              <Field label="Speaking Level" value={fd.language1.speaking} />
              <Field label="Reading Level" value={fd.language1.reading} />
              <Field label="Writing Level" value={fd.language1.writing} />
            </Section>
          )}

          {/* Documents Checklist Card */}
          <div
            className="rounded-xl border bg-white p-6"
            style={{ borderColor: theme.hairline }}
          >
            <div className="mb-5 flex items-center gap-2 border-b pb-3" style={{ borderColor: theme.hairline }}>
              <div className="rounded-lg bg-gray-50 p-1.5">
                <FileText className="h-4 w-4" style={{ color: theme.gold }} />
              </div>
              <h2 className="text-sm font-bold text-[#1A153A]">Submitted Documents</h2>
            </div>
            {student?.documents?.length ? (
              <div className="space-y-3">
                {student.documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 border border-gray-100"
                  >
                    <div>
                      <p className="font-semibold text-sm text-[#1A153A]">{doc.documentType?.name}</p>
                      <p className="text-[10px] text-gray-400">Code: {doc.documentType?.code}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        doc.status === "APPROVED"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : doc.status === "REJECTED"
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-amber-50 border-amber-200 text-amber-700"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-3 text-center">No documents uploaded yet</p>
            )}
          </div>

          {/* Conditional Admission Letter Upload Panel */}
          {app.status === "approved" && (
            <AdmissionLetterUpload applicationId={id} />
          )}

          {/* Payments checklist card */}
          <div
            className="rounded-xl border bg-white p-6"
            style={{ borderColor: theme.hairline }}
          >
            <div className="mb-5 flex items-center gap-2 border-b pb-3" style={{ borderColor: theme.hairline }}>
              <div className="rounded-lg bg-gray-50 p-1.5">
                <CreditCard className="h-4 w-4" style={{ color: theme.gold }} />
              </div>
              <h2 className="text-sm font-bold text-[#1A153A]">Payment Tracking</h2>
            </div>
            {student?.payments?.length ? (
              <div className="space-y-3">
                {student.payments.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 border border-gray-100"
                  >
                    <div>
                      <p className="font-semibold text-sm text-[#1A153A]">Stage {p.stage} Admission Fee</p>
                      <p className="text-xs text-gray-400">Amount: ₹{p.amount.toLocaleString("en-IN")}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        p.status === "SUCCESS"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-amber-50 border-amber-200 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-3 text-center">No payments recorded yet</p>
            )}
          </div>

          {/* Timeline Tracking Card */}
          <div
            className="rounded-xl border bg-white p-6"
            style={{ borderColor: theme.hairline }}
          >
            <div className="mb-5 flex items-center gap-2 border-b pb-3" style={{ borderColor: theme.hairline }}>
              <div className="rounded-lg bg-gray-50 p-1.5">
                <History className="h-4 w-4" style={{ color: theme.gold }} />
              </div>
              <h2 className="text-sm font-bold text-[#1A153A]">Application History</h2>
            </div>
            {app.timelineEvents?.length ? (
              <div className="relative pl-4 space-y-6 before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200">
                {app.timelineEvents.map((e: any) => (
                  <div key={e.id} className="relative space-y-1">
                    <div className="absolute -left-[16px] top-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1A153A]" />
                    <p className="text-sm font-bold text-[#1A153A]">{e.title}</p>
                    {e.description && (
                      <p className="text-xs text-gray-400">{e.description}</p>
                    )}
                    <p className="text-[10px] font-semibold text-gray-400 font-mono">
                      {new Date(e.occurredAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-3 text-center">No timeline events recorded yet</p>
            )}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* University details Card */}
          <div
            className="rounded-xl border bg-white p-6"
            style={{ borderColor: theme.hairline }}
          >
            <div className="mb-4 flex items-center gap-2 border-b pb-3" style={{ borderColor: theme.hairline }}>
              <div className="rounded-lg bg-gray-50 p-1.5">
                <Building2 className="h-4 w-4" style={{ color: theme.gold }} />
              </div>
              <h2 className="text-sm font-bold text-[#1A153A]">University Details</h2>
            </div>
            <div className="space-y-4">
              {uni?.logo && (
                <img
                  src={uni.logo}
                  alt={uni.name}
                  className="h-12 w-12 rounded-xl object-contain border p-1"
                />
              )}
              <div>
                <p className="font-bold text-sm text-[#1A153A] leading-snug">{uni?.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {uni?.shortName} : {uni?.type}
                </p>
                <p className="text-xs text-gray-400">Established {uni?.establishedYear}</p>
              </div>
              {uni?.website && (
                <a
                  href={uni.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline pt-2 border-t w-full"
                  style={{ borderColor: theme.hairline }}
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>

          {/* Full Student profile Card */}
          <div
            className="rounded-xl border bg-white p-6"
            style={{ borderColor: theme.hairline }}
          >
            <div className="mb-4 flex items-center gap-2 border-b pb-3" style={{ borderColor: theme.hairline }}>
              <div className="rounded-lg bg-gray-50 p-1.5">
                <GraduationCap className="h-4 w-4" style={{ color: theme.gold }} />
              </div>
              <h2 className="text-sm font-bold text-[#1A153A]">Full Student Profile</h2>
            </div>
            <div className="space-y-4">
              <Field label="Name" value={student?.user?.name} />
              <Field label="Email" value={student?.user?.email} />
              <Field label="Phone" value={student?.user?.phone} />
              <Field
                label="Stage"
                value={student?.currentStage ? `Stage ${student.currentStage}` : null}
              />
              <Field
                label="Status"
                value={student?.applicationStatus?.replace(/_/g, " ")}
              />
              <Field label="NEET Score" value={student?.neetScore} />
              <Field label="NEET Rank" value={student?.neetRank} />
              <Field label="12th %" value={student?.twelfthPercentage} />
              <Field label="10th %" value={student?.tenthPercentage} />
              <Field label="Passport Number" value={student?.passportNumber} />
              <Field
                label="Passport Expiry"
                value={
                  student?.passportExpiry
                    ? new Date(student.passportExpiry).toLocaleDateString()
                    : null
                }
              />
            </div>
          </div>

          {/* Submission metadata Card */}
          <div
            className="rounded-xl border bg-white p-6"
            style={{ borderColor: theme.hairline }}
          >
            <div className="mb-4 flex items-center gap-2 border-b pb-3" style={{ borderColor: theme.hairline }}>
              <div className="rounded-lg bg-gray-50 p-1.5">
                <Clock className="h-4 w-4" style={{ color: theme.gold }} />
              </div>
              <h2 className="text-sm font-bold text-[#1A153A]">Submission Metadata</h2>
            </div>
            <div className="space-y-4">
              <Field
                label="Submitted Date"
                value={app.submittedAt ? new Date(app.submittedAt).toLocaleString() : null}
              />
              <Field
                label="Created Date"
                value={new Date(app.createdAt).toLocaleString()}
              />
              <Field
                label="Last Updated Date"
                value={new Date(app.updatedAt).toLocaleString()}
              />
            </div>
          </div>

          {/* Tickets related Card */}
          {app.tickets?.length > 0 && (
            <div
              className="rounded-xl border bg-white p-6"
              style={{ borderColor: theme.hairline }}
            >
              <div className="mb-4 flex items-center gap-2 border-b pb-3" style={{ borderColor: theme.hairline }}>
                <div className="rounded-lg bg-gray-50 p-1.5">
                  <MessageSquare className="h-4 w-4" style={{ color: theme.gold }} />
                </div>
                <h2 className="text-sm font-bold text-[#1A153A]">Related Support Tickets</h2>
              </div>
              <div className="space-y-3">
                {app.tickets.map((t: any) => (
                  <div key={t.id} className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                    <p className="text-xs font-bold text-[#1A153A]">{t.subject}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 border-t pt-1">
                      <span>Status: {t.status}</span>
                      <span>Priority: {t.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Admission Letter Upload Component ─── */
function AdmissionLetterUpload({ applicationId }: { applicationId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const uploadFile = useUploadFile();
  const uploadLetter = useUploadAdmissionLetter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    setSuccess(false);

    try {
      const uploadResult = await uploadFile.mutateAsync(file);
      await uploadLetter.mutateAsync({
        applicationId,
        fileUrl: uploadResult.url,
        fileName: file.name,
      });
      setSuccess(true);
    } catch (err: any) {
      setUploadError(
        err?.response?.data?.message || err?.message || "Upload failed",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className="rounded-xl border bg-[#3730A3]/5 p-6"
      style={{ borderColor: "rgba(55,48,163,0.15)" }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Upload className="h-4 w-4 text-[#3730A3]" />
        <h2 className="text-sm font-bold text-[#1A153A]">Upload Admission Letter</h2>
      </div>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        Upload the official university admission letter PDF. This action will notify the student and automatically unlock Stage 2, enabling them to complete the initial payment of ₹5,000.
      </p>

      {success ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Admission letter uploaded. Student has been notified and advanced to Stage 2.
        </div>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#3730A3] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2D2880] transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                Choose PDF File
              </>
            )}
          </button>
          {uploadError && (
            <p className="mt-2 text-xs text-red-600 font-semibold">{uploadError}</p>
          )}
        </>
      )}
    </div>
  );
}
