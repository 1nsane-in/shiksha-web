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
  ExternalLink,
} from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; border: string; text: string; bg: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending Review",
    border: "border-[#d3cec6]",
    text: "text-amber-800",
    bg: "bg-amber-50/50",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    border: "border-[#d3cec6]",
    text: "text-emerald-800",
    bg: "bg-emerald-50/50",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    border: "border-[#d3cec6]",
    text: "text-red-800",
    bg: "bg-red-50/50",
    icon: XCircle,
  },
};

const theme = {
  ink: "#111111",
  inkMuted: "#626260",
  canvas: "#f5f1ec",
  surface: "#ffffff",
  hairline: "#d3cec6",
  hairlineSoft: "#ebe7e1",
};

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#626260]">
        {label}
      </span>
      <p className="text-sm font-normal text-[#111111] break-words">
        {value !== undefined && value !== null && value !== "" ? value : "—"}
      </p>
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
    <div className="rounded-xl border border-[#d3cec6] bg-white p-6 transition-all">
      <div className="mb-5 flex items-center gap-2 border-b border-[#ebe7e1] pb-3">
        <div className="rounded-lg bg-zinc-100 p-1.5">
          <Icon className="h-4 w-4 text-[#111111]" />
        </div>
        <h2 className="text-sm font-medium text-[#111111] tracking-tight">{title}</h2>
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

  // Integrated states for pre-approval PDF upload
  const [uploadedFile, setUploadedFile] = useState<{ url: string; fileName: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [actionError, setActionError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFileMutation = useUploadFile();
  const uploadLetterMutation = useUploadAdmissionLetter();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setActionError("");
    try {
      const result = await uploadFileMutation.mutateAsync({ file, folder: "admission-letters" });
      setUploadedFile({ url: result.url, fileName: file.name });
    } catch (err: any) {
      setActionError(err?.message || "File upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApproveCoordinated = async () => {
    if (!uploadedFile) return;
    setApproving(true);
    setActionError("");
    try {
      // 1. Approve status (advances student in DB)
      await updateStatus.mutateAsync({ id, status: "approved" });
      // 2. Upload Admission Letter
      await uploadLetterMutation.mutateAsync({
        applicationId: id,
        fileUrl: uploadedFile.url,
        fileName: uploadedFile.fileName,
      });
      setUploadedFile(null); // Clear local state
      router.refresh();
    } catch (err: any) {
      setActionError(err?.message || "Approval flow failed");
    } finally {
      setApproving(false);
    }
  };

  const handleRejectWithPrompt = async () => {
    const reason = window.prompt("Rejection reason (optional):");
    try {
      await updateStatus.mutateAsync({ id, status: "rejected" });
      router.refresh();
    } catch (err: any) {
      setActionError(err?.message || "Rejection failed");
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#111111]" />
      </div>
    );

  if (error || !app)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <AlertCircle className="size-10 text-red-500" />
        <p className="text-sm font-medium text-[#111111]">Application not found</p>
        <Button
          onClick={() => router.push("/admin/applications")}
          variant="outline"
          className="border-[#d3cec6] bg-white text-[#111111]"
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
    <div className="min-h-screen text-[#111111] font-sans antialiased pb-12">
      {/* Header Bar */}
      <div className="border-b border-[#d3cec6] bg-transparent">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/applications")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d3cec6] bg-white text-[#111111] hover:bg-zinc-50 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-medium tracking-tight text-[#111111]">
                  {app.firstName} {app.lastName}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border border-[#d3cec6] px-2.5 py-0.5 text-[11px] font-medium bg-white text-[#111111]`}
                >
                  <StatusIcon className="h-3 w-3 text-[#626260]" />
                  {status.label}
                </span>
              </div>
              <p className="text-[11px] text-[#626260] mt-0.5">
                ID: <span className="font-mono text-zinc-500">{id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {app.status === "pending" && (
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#111111] px-4 py-2 text-xs font-medium text-white hover:bg-black transition-all disabled:opacity-50 cursor-pointer"
                  onClick={handleApproveCoordinated}
                  disabled={!uploadedFile || updateStatus.isPending || uploading || approving}
                  title={!uploadedFile ? "Please upload an Admission Letter first" : "Click to Approve"}
                >
                  {approving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  Approve
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d3cec6] bg-white px-4 py-2 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all disabled:opacity-50 cursor-pointer"
                  onClick={handleRejectWithPrompt}
                  disabled={updateStatus.isPending || uploading || approving}
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Review Action Panel */}
            {app.status === "pending" && (
              <div className="rounded-xl border-2 border-[#111111] bg-white p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-[#111111]" />
                  <h2 className="text-sm font-medium text-[#111111] tracking-tight">
                    Action Required: Upload Admission Letter
                  </h2>
                </div>
                <p className="text-xs text-[#626260] leading-relaxed">
                  Redesign of administrative pipeline. To approve {app.firstName}'s medical admission application, upload the official university Admission Letter PDF. Upload enables the "Approve" workflow action.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || approving}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#d3cec6] bg-zinc-50 px-4 py-2 text-xs font-medium text-[#111111] hover:bg-zinc-100 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Uploading Letter...
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        Select Admission Letter (PDF)
                      </>
                    )}
                  </button>

                  {uploadedFile && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d3cec6] bg-zinc-50 px-3 py-1 text-xs font-medium text-[#111111]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        File Selected: {uploadedFile.fileName}
                      </span>
                      <a
                        href={uploadedFile.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#d3cec6] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Preview Document
                      </a>
                    </div>
                  )}
                </div>

                {actionError && (
                  <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {actionError}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-dashed border-[#ebe7e1]">
                  <button
                    onClick={handleApproveCoordinated}
                    disabled={!uploadedFile || approving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#111111] px-4 py-2 text-xs font-medium text-white hover:bg-black transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {approving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve & Notify Applicant
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleRejectWithPrompt}
                    disabled={approving}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#d3cec6] bg-white px-4 py-2 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject Application
                  </button>
                </div>
              </div>
            )}

            {/* Applicant Demographics */}
            <Section title="Applicant Demographics" icon={User}>
              <Field label="Full Name" value={`${app.firstName} ${app.lastName}`} />
              <Field label="Email Address" value={app.email} />
              <Field label="Gender" value={fd?.gender} />
              <Field
                label="Date of Birth"
                value={fd?.dateOfBirth ? new Date(fd.dateOfBirth).toLocaleDateString() : null}
              />
              <Field label="Citizenship" value={fd?.citizenship} />
              <Field label="Marital Status" value={fd?.maritalStatus} />
              <Field label="Embassy Location" value={fd?.embassyLocation} />
              <Field label="Selected Program" value={app.selectedProgram} />
            </Section>

            {/* Birthplace Info */}
            {fd?.placeOfBirth && (
              <Section title="Birth Details" icon={MapPin}>
                <Field label="City of Birth" value={fd.placeOfBirth.city} />
                <Field label="State/Province" value={fd.placeOfBirth.state} />
                <Field label="Country of Birth" value={fd.placeOfBirth.country} />
              </Section>
            )}

            {/* Permanent Address */}
            {fd?.permanentAddress && (
              <Section title="Permanent Address" icon={MapPin}>
                <Field label="Street Address" value={fd.permanentAddress} />
                <Field label="City" value={fd.permanentCity} />
                <Field label="State/Province" value={fd.permanentState} />
                <Field label="Postal/ZIP Code" value={fd.permanentZip} />
                <Field label="Country" value={fd.permanentCountry} />
              </Section>
            )}

            {/* Language Proficiency */}
            {fd?.language1 && (
              <Section title="Language Proficiency" icon={Globe}>
                <Field label="Primary Language" value={fd.language1.name} />
                <Field label="Speaking Level" value={fd.language1.speaking} />
                <Field label="Reading Level" value={fd.language1.reading} />
                <Field label="Writing Level" value={fd.language1.writing} />
              </Section>
            )}

            {/* Submitted Documents Checklist */}
            <div className="rounded-xl border border-[#d3cec6] bg-white p-6">
              <div className="mb-5 flex items-center gap-2 border-b border-[#ebe7e1] pb-3">
                <div className="rounded-lg bg-zinc-100 p-1.5">
                  <FileText className="h-4 w-4 text-[#111111]" />
                </div>
                <h2 className="text-sm font-medium text-[#111111] tracking-tight">Submitted Documents</h2>
              </div>
              {student?.documents?.length ? (
                <div className="divide-y divide-[#ebe7e1]">
                  {student.documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-sm text-[#111111]">{doc.documentType?.name}</p>
                        <p className="text-[10px] text-[#626260] mt-0.5">Code: {doc.documentType?.code}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-[#d3cec6] bg-white px-2.5 py-1 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </a>
                        )}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#626260] py-4 text-center">No documents uploaded yet</p>
              )}
            </div>

            {/* Post-Approval Letter Panel */}
            {app.status === "approved" && (
              <AdmissionLetterUpload applicationId={id} existingLetter={app.admissionLetter} />
            )}

            {/* Payments */}
            <div className="rounded-xl border border-[#d3cec6] bg-white p-6">
              <div className="mb-5 flex items-center gap-2 border-b border-[#ebe7e1] pb-3">
                <div className="rounded-lg bg-zinc-100 p-1.5">
                  <CreditCard className="h-4 w-4 text-[#111111]" />
                </div>
                <h2 className="text-sm font-medium text-[#111111] tracking-tight">Payment Ledger</h2>
              </div>
              {student?.payments?.length ? (
                <div className="divide-y divide-[#ebe7e1]">
                  {student.payments.map((p: any) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-sm text-[#111111]">Stage {p.stage} Admission Fee</p>
                        <p className="text-xs text-[#626260] mt-0.5">Amount: ₹{p.amount.toLocaleString("en-IN")}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
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
                <p className="text-xs text-[#626260] py-4 text-center">No payment records found</p>
              )}
            </div>

            {/* Timeline */}
            <div className="rounded-xl border border-[#d3cec6] bg-white p-6">
              <div className="mb-5 flex items-center gap-2 border-b border-[#ebe7e1] pb-3">
                <div className="rounded-lg bg-zinc-100 p-1.5">
                  <History className="h-4 w-4 text-[#111111]" />
                </div>
                <h2 className="text-sm font-medium text-[#111111] tracking-tight">Audit Trail & History</h2>
              </div>
              {app.timelineEvents?.length ? (
                <div className="relative pl-5 space-y-6 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[#d3cec6]">
                  {app.timelineEvents.map((e: any) => (
                    <div key={e.id} className="relative space-y-1">
                      <div className="absolute -left-[19px] top-1.5 h-2 w-2 shrink-0 rounded-full bg-[#111111]" />
                      <p className="text-sm font-medium text-[#111111]">{e.title}</p>
                      {e.description && (
                        <p className="text-xs text-[#626260] leading-relaxed">{e.description}</p>
                      )}
                      <p className="text-[10px] font-mono text-[#626260]">
                        {new Date(e.occurredAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#626260] py-4 text-center">No timeline history recorded yet</p>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* University Details */}
            <div className="rounded-xl border border-[#d3cec6] bg-white p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-[#ebe7e1] pb-3">
                <div className="rounded-lg bg-zinc-100 p-1.5">
                  <Building2 className="h-4 w-4 text-[#111111]" />
                </div>
                <h2 className="text-sm font-medium text-[#111111] tracking-tight">Selected Institution</h2>
              </div>
              <div className="space-y-4">
                {uni?.logo && (
                  <img
                    src={uni.logo}
                    alt={uni.name}
                    className="h-12 w-12 rounded-lg object-contain border border-[#d3cec6] p-1 bg-white"
                  />
                )}
                <div>
                  <p className="font-medium text-sm text-[#111111] leading-snug">{uni?.name}</p>
                  <p className="text-xs text-[#626260] mt-1.5">
                    {uni?.shortName} • {uni?.type}
                  </p>
                  <p className="text-xs text-[#626260] mt-0.5">Established {uni?.establishedYear}</p>
                </div>
                {uni?.website && (
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#111111] hover:underline pt-3 border-t border-[#ebe7e1] w-full"
                  >
                    Official website &rarr;
                  </a>
                )}
              </div>
            </div>

            {/* Academic profile */}
            <div className="rounded-xl border border-[#d3cec6] bg-white p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-[#ebe7e1] pb-3">
                <div className="rounded-lg bg-zinc-100 p-1.5">
                  <GraduationCap className="h-4 w-4 text-[#111111]" />
                </div>
                <h2 className="text-sm font-medium text-[#111111] tracking-tight">Academic History</h2>
              </div>
              <div className="space-y-4">
                <Field label="Full Name" value={student?.user?.name} />
                <Field label="Contact Phone" value={student?.user?.phone} />
                <Field
                  label="Admission Pipeline Stage"
                  value={student?.currentStage ? `Stage ${student.currentStage}` : "—"}
                />
                <Field
                  label="Student Pipeline Status"
                  value={student?.applicationStatus?.replace(/_/g, " ")}
                />
                <div className="grid grid-cols-2 gap-4 border-t border-[#ebe7e1] pt-4">
                  <Field label="NEET Score" value={student?.neetScore} />
                  <Field label="NEET Rank" value={student?.neetRank} />
                  <Field label="Class 12th %" value={student?.twelfthPercentage} />
                  <Field label="Class 10th %" value={student?.tenthPercentage} />
                </div>
                <div className="border-t border-[#ebe7e1] pt-4 space-y-4">
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
            </div>

            {/* Submission Dates */}
            <div className="rounded-xl border border-[#d3cec6] bg-white p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-[#ebe7e1] pb-3">
                <div className="rounded-lg bg-zinc-100 p-1.5">
                  <Clock className="h-4 w-4 text-[#111111]" />
                </div>
                <h2 className="text-sm font-medium text-[#111111] tracking-tight">Timeline Info</h2>
              </div>
              <div className="space-y-4">
                <Field
                  label="Application Submitted"
                  value={app.submittedAt ? new Date(app.submittedAt).toLocaleString() : null}
                />
                <Field
                  label="System Creation"
                  value={new Date(app.createdAt).toLocaleString()}
                />
                <Field
                  label="Last Record Mutation"
                  value={new Date(app.updatedAt).toLocaleString()}
                />
              </div>
            </div>

            {/* Support Tickets */}
            {app.tickets?.length > 0 && (
              <div className="rounded-xl border border-[#d3cec6] bg-white p-6">
                <div className="mb-4 flex items-center gap-2 border-b border-[#ebe7e1] pb-3">
                  <div className="rounded-lg bg-zinc-100 p-1.5">
                    <MessageSquare className="h-4 w-4 text-[#111111]" />
                  </div>
                  <h2 className="text-sm font-medium text-[#111111] tracking-tight">Related Support</h2>
                </div>
                <div className="space-y-3">
                  {app.tickets.map((t: any) => (
                    <div key={t.id} className="rounded-lg bg-zinc-50 p-3 border border-[#ebe7e1]">
                      <p className="text-xs font-semibold text-[#111111]">{t.subject}</p>
                      <div className="flex items-center justify-between text-[10px] text-[#626260] mt-2 border-t border-[#ebe7e1] pt-1.5">
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
    </div>
  );
}

/* ─── Admission Letter Upload Component ─── */
function AdmissionLetterUpload({
  applicationId,
  existingLetter,
}: {
  applicationId: string;
  existingLetter?: { fileUrl: string; fileName: string } | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [latestLetter, setLatestLetter] = useState<{ fileUrl: string; fileName: string } | null>(null);
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
      setLatestLetter({ fileUrl: uploadResult.url, fileName: file.name });
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

  const letterToDisplay = latestLetter || existingLetter;

  return (
    <div className="rounded-xl border border-[#d3cec6] bg-white p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Upload className="h-4 w-4 text-[#111111]" />
        <h2 className="text-sm font-medium text-[#111111] tracking-tight">Official Admission Letter</h2>
      </div>
      <p className="text-xs text-[#626260] leading-relaxed">
        Upload the official university admission letter PDF. This action notifies the student, automatically unlocks Stage 2, and prompts for payment of the admission letter processing fee.
      </p>

      {letterToDisplay && (
        <div className="flex items-center justify-between rounded-lg border border-[#d3cec6] bg-zinc-50 px-4 py-3 text-xs font-medium text-[#111111] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="truncate max-w-[280px]">Letter active: {letterToDisplay.fileName || "Admission_Letter.pdf"}</span>
          </div>
          <a
            href={letterToDisplay.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-[#d3cec6] bg-white px-2.5 py-1 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all"
          >
            <ExternalLink className="h-3 w-3" />
            View Letter
          </a>
        </div>
      )}

      {success ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          Admission letter uploaded successfully. Student has been transitioned to Stage 2.
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
            className="inline-flex items-center gap-2 rounded-lg border border-[#d3cec6] bg-zinc-50 px-4 py-2 text-xs font-medium text-[#111111] hover:bg-zinc-100 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                Upload New Letter PDF
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
