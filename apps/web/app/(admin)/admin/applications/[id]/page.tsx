// @ts-nocheck
"use client";

import { use, useState, useRef, useEffect } from "react";
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

/* ─── Document Preview Dialog Overlay ─── */
function PreviewDialog({
  isOpen,
  onClose,
  fileUrl,
  fileName,
}: {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
  fileName?: string | null;
}) {
  if (!isOpen || !fileUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-xl border border-[#d3cec6] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ebe7e1] px-6 py-4 bg-zinc-50">
          <div>
            <h3 className="text-sm font-semibold text-[#111111] tracking-tight">Document Preview</h3>
            {fileName && <p className="text-xs text-[#626260] mt-0.5 truncate max-w-[500px]">{fileName}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-[#d3cec6] bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 bg-zinc-100 min-h-[500px] flex items-center justify-center">
          <iframe
            src={fileUrl}
            title="Document Preview"
            className="w-full h-[65vh] border border-[#d3cec6] rounded-lg bg-white shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}

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

function KeyValueRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 last:border-0 text-sm">
      <span className="text-[#626260] font-normal">{label}</span>
      <span className="text-[#111111] font-medium text-right break-all pl-4">{value || "—"}</span>
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

/**
 * Utility for rendering human-readable dates inside the ledger.
 * Demonstrates Single Responsibility Principle for formatting logic.
 */
function formatLedgerDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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

  // Dialog Preview State
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);

  // Integrated states for pre-approval PDF upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; fileName: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [actionError, setActionError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFileMutation = useUploadFile();
  const uploadLetterMutation = useUploadAdmissionLetter();

  // Cleanup Object URL on unmount or on localPreviewUrl changes
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setActionError("");
    setUploadedFile(null); // Reset uploaded server file state
    
    // Revoke any existing Object URL before creating a new one
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setActionError("");
    try {
      const result = await uploadFileMutation.mutateAsync({ file: selectedFile, folder: "admission-letters" });
      setUploadedFile({ url: result.url, fileName: selectedFile.name });
    } catch (err: any) {
      setActionError(err?.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    setUploadedFile(null);
    setActionError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      setSelectedFile(null);
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

  // Format variables for premium demographics display
  const formattedProgram = app.selectedProgram
    ? app.selectedProgram.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

  const formattedGender = fd?.gender
    ? fd.gender.replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

  const formattedMarital = fd?.maritalStatus
    ? fd.maritalStatus.replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

  return (
    <div className="min-h-screen text-[#111111] font-sans antialiased pb-12">
      {/* Dialogue Preview Box */}
      <PreviewDialog
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileUrl={previewFile?.url || null}
        fileName={previewFile?.name || null}
      />

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

                <div className="flex flex-col gap-4 pt-1">
                  {/* State A: No file selected and no file uploaded */}
                  {!selectedFile && !uploadedFile && (
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#d3cec6] bg-zinc-50 px-4 py-2 text-xs font-medium text-[#111111] hover:bg-zinc-100 transition-all cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Select Admission Letter (PDF)
                      </button>
                    </div>
                  )}

                  {/* State B: Local file selected, but not uploaded to server yet */}
                  {selectedFile && !uploadedFile && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d3cec6] bg-zinc-50 px-3 py-1 text-xs font-medium text-[#111111]">
                          Selected: {selectedFile.name}
                        </span>

                        {localPreviewUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewFile({ url: localPreviewUrl, name: selectedFile.name })}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#d3cec6] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Preview Selection
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleRemoveSelectedFile}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-all cursor-pointer"
                        >
                          <XCircle className="h-3 w-3" />
                          Remove
                        </button>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleUploadFile}
                          disabled={uploading}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#111111] px-4 py-2 text-xs font-medium text-white hover:bg-black transition-all cursor-pointer disabled:opacity-50"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Uploading to Server...
                            </>
                          ) : (
                            <>
                              <Upload className="h-3.5 w-3.5" />
                              Upload File to Server
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* State C: File uploaded successfully to server */}
                  {uploadedFile && (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Uploaded: {uploadedFile.fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewFile({ url: uploadedFile.url, name: uploadedFile.fileName })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#d3cec6] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Preview Upload
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveSelectedFile}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-all cursor-pointer"
                      >
                        <XCircle className="h-3 w-3" />
                        Remove & Re-select
                      </button>
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
            <div className="rounded-xl border border-[#d3cec6] bg-white p-6 md:p-8 transition-all">
              <div className="mb-6 flex items-center gap-3 border-b border-[#ebe7e1] pb-4">
                <div className="rounded-lg bg-zinc-100 p-2 text-[#111111]">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#111111] tracking-tight">Applicant Demographics</h2>
                  <p className="text-[11px] text-[#626260] mt-0.5">Verified details and profile dossier</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {/* Left Specification Column */}
                <div className="divide-y divide-zinc-100">
                  <KeyValueRow label="Full Name" value={`${app.firstName} ${app.lastName}`} />
                  <KeyValueRow label="Email Address" value={app.email} />
                  <KeyValueRow label="Selected Program" value={formattedProgram} />
                  <KeyValueRow
                    label="Date of Birth"
                    value={fd?.dateOfBirth ? new Date(fd.dateOfBirth).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    }) : null}
                  />
                </div>

                {/* Right Specification Column */}
                <div className="divide-y divide-zinc-100">
                  <KeyValueRow label="Gender" value={formattedGender} />
                  <KeyValueRow label="Citizenship" value={fd?.citizenship} />
                  <KeyValueRow label="Marital Status" value={formattedMarital} />
                  <KeyValueRow label="Embassy Location" value={fd?.embassyLocation} />
                </div>
              </div>
            </div>

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
                          <button
                            type="button"
                            onClick={() => setPreviewFile({ url: doc.fileUrl, name: doc.documentType?.name })}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#d3cec6] bg-white px-2.5 py-1 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </button>
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

            {/* Payment Ledger */}
            <div className="rounded-xl border border-[#d3cec6] bg-white transition-all overflow-hidden">
              <div className="p-6 md:p-8 pb-4">
                <div className="mb-6 flex items-center justify-between border-b border-[#ebe7e1] pb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-100 p-2 text-[#111111]">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-[#111111] tracking-tight">Payment Ledger</h2>
                      <p className="text-[11px] text-[#626260] mt-0.5">Transaction history and financial status</p>
                    </div>
                  </div>
                </div>

                {student?.payments?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-[#ebe7e1]">
                          <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#626260] font-sans w-1/3">Transaction</th>
                          <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#626260] font-sans w-1/3">Date & Time</th>
                          <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#626260] font-sans text-right">Amount & Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {student.payments.map((p: any) => (
                          <tr key={p.id} className="group">
                            <td className="py-4 align-top">
                              <p className="font-medium text-[#111111]">Stage {p.stage} Admission Fee</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-mono text-[#626260] bg-zinc-50 px-1.5 py-0.5 rounded border border-[#ebe7e1]">
                                  {p.razorpayOrderId || p.id.split("-")[0].toUpperCase()}
                                </span>
                                {p.paymentMethod && (
                                  <span className="text-[10px] text-[#626260]">{p.paymentMethod}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 align-top">
                              <p className="text-xs text-[#111111]">
                                {formatLedgerDate(p.paidAt || p.createdAt)}
                              </p>
                              {p.manuallyApproved && (
                                <p className="text-[10px] text-[#626260] mt-1 italic">Manually Approved</p>
                              )}
                            </td>
                            <td className="py-4 align-top text-right">
                              <p className="font-semibold text-[#111111] mb-1">
                                {p.currency === "INR" ? "₹" : p.currency} {p.amount.toLocaleString("en-IN")}
                              </p>
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                                  p.status === "SUCCESS" || p.status === "MANUALLY_APPROVED"
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                    : p.status === "FAILED" || p.status === "REFUNDED"
                                      ? "bg-red-50 border-red-200 text-red-700"
                                      : "bg-amber-50 border-amber-200 text-amber-700"
                                }`}
                              >
                                {p.status.replace(/_/g, " ")}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center bg-zinc-50 rounded-lg border border-dashed border-[#d3cec6] mt-4">
                    <p className="text-xs text-[#626260]">No payment records found.</p>
                  </div>
                )}
              </div>
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
            <div className="rounded-xl border border-[#d3cec6] bg-white overflow-hidden">
              {/* Optional Header Banner (can be gray if no bannerImage) */}
              <div className="h-16 w-full border-b border-[#ebe7e1] relative bg-zinc-100">
                {uni?.bannerImage && (
                  <img 
                    src={uni.bannerImage} 
                    alt="University Banner" 
                    className="absolute inset-0 h-full w-full object-cover" 
                  />
                )}
              </div>
              
              <div className="px-6 pb-6 relative">
                {/* Logo overlapping banner */}
                <div className="absolute -top-8 bg-white p-1 rounded-xl border border-[#d3cec6] shadow-sm">
                  {uni?.logo ? (
                    <img
                      src={uni.logo}
                      alt={uni.name}
                      className="h-14 w-14 rounded-lg object-contain bg-white"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-zinc-50 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-[#626260]" />
                    </div>
                  )}
                </div>

                <div className="pt-10">
                  <h2 className="text-[15px] font-semibold text-[#111111] leading-snug tracking-tight">
                    {uni?.name || "Institution Name"}
                  </h2>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <p className="text-xs text-[#626260]">
                      <span className="font-medium text-[#111111]">{uni?.shortName}</span> • {uni?.type?.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-[#626260]">
                      Est. {uni?.establishedYear}
                    </p>
                  </div>
                </div>

                {uni?.website && (
                  <div className="mt-5 pt-4 border-t border-[#ebe7e1]">
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#626260] hover:text-[#111111] transition-all"
                    >
                      Official Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [latestLetter, setLatestLetter] = useState<{ fileUrl: string; fileName: string } | null>(null);
  const [uploadError, setUploadError] = useState("");
  const uploadFile = useUploadFile();
  const uploadLetter = useUploadAdmissionLetter();

  // Self-contained Preview Modal State
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);

  // Cleanup local Object URL
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadError("");
    setSuccess(false);

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError("");
    setSuccess(false);

    try {
      const uploadResult = await uploadFile.mutateAsync(selectedFile);
      await uploadLetter.mutateAsync({
        applicationId,
        fileUrl: uploadResult.url,
        fileName: selectedFile.name,
      });
      setLatestLetter({ fileUrl: uploadResult.url, fileName: selectedFile.name });
      setSuccess(true);
    } catch (err: any) {
      setUploadError(
        err?.response?.data?.message || err?.message || "Upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    setLatestLetter(null);
    setSuccess(false);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const letterToDisplay = latestLetter || existingLetter;

  return (
    <div className="rounded-xl border border-[#d3cec6] bg-white p-6 space-y-4">
      {/* Dialogue Preview Box */}
      <PreviewDialog
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileUrl={previewFile?.url || null}
        fileName={previewFile?.name || null}
      />

      <div className="flex items-center gap-2">
        <Upload className="h-4 w-4 text-[#111111]" />
        <h2 className="text-sm font-medium text-[#111111] tracking-tight">Official Admission Letter</h2>
      </div>
      <p className="text-xs text-[#626260] leading-relaxed">
        Upload the official university admission letter PDF. This action notifies the student, automatically unlocks Stage 2, and prompts for payment of the admission letter processing fee.
      </p>

      {/* Show active letter from server if present and not in re-selection mode */}
      {letterToDisplay && !selectedFile && (
        <div className="flex items-center justify-between rounded-lg border border-[#d3cec6] bg-zinc-50 px-4 py-3 text-xs font-medium text-[#111111] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="truncate max-w-[280px]">Letter active: {letterToDisplay.fileName || "Admission_Letter.pdf"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewFile({ url: letterToDisplay.fileUrl, name: letterToDisplay.fileName || "Admission Letter" })}
              className="inline-flex items-center gap-1 rounded-md border border-[#d3cec6] bg-white px-2.5 py-1 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer"
            >
              <ExternalLink className="h-3 w-3" />
              View Letter
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-all cursor-pointer"
            >
              <XCircle className="h-3 w-3" />
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Show local file chosen state */}
      {selectedFile && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d3cec6] bg-zinc-50 px-3 py-1 text-xs font-medium text-[#111111]">
              Selected locally: {selectedFile.name}
            </span>

            {localPreviewUrl && (
              <button
                type="button"
                onClick={() => setPreviewFile({ url: localPreviewUrl, name: selectedFile.name })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d3cec6] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer"
              >
                <ExternalLink className="h-3 w-3" />
                Preview Local File
              </button>
            )}

            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-all cursor-pointer"
            >
              <XCircle className="h-3 w-3" />
              Remove
            </button>
          </div>

          {!success && (
            <div>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#111111] px-4 py-2 text-xs font-medium text-white hover:bg-black transition-all cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    Upload Chosen File
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-medium text-emerald-800 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Admission letter uploaded successfully. Student transitioned to Stage 2.</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-all cursor-pointer"
          >
            <XCircle className="h-3 w-3" />
            Remove / Replace
          </button>
        </div>
      )}

      {!letterToDisplay && !selectedFile && !success && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d3cec6] bg-zinc-50 px-4 py-2 text-xs font-medium text-[#111111] hover:bg-zinc-100 transition-all disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" />
            Select Admission Letter PDF
          </button>
        </>
      )}

      {uploadError && (
        <p className="mt-2 text-xs text-red-600 font-semibold">{uploadError}</p>
      )}
    </div>
  );
}
