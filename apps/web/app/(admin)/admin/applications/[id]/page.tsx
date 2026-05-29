"use client";

import { use, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending Review",
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-700",
    icon: XCircle,
  },
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
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-[#111]">{value || "—"}</p>
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
    <div className="rounded-xl border border-[#ECEAE6] bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#3730A3]" />
        <h2 className="text-sm font-semibold text-[#111]">{title}</h2>
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
        <Loader2 className="h-6 w-6 animate-spin text-[#9CA3AF]" />
      </div>
    );

  if (error || !app)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-600">Application not found</p>
        <button
          onClick={() => router.push("/admin/applications")}
          className="text-sm text-[#3730A3] underline"
        >
          Back to Applications
        </button>
      </div>
    );

  const status = statusConfig[app.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const fd = app.formData as Record<string, any> | null;
  const student = app.student;
  const uni = app.university;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/applications")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ECEAE6] bg-white text-[#6B7280] hover:bg-[#F5F4F2]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-[#111]">
              {app.firstName} {app.lastName}
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Application #{id.slice(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.bg} ${status.text}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </span>
          {app.status === "pending" && (
            <>
              <button
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                onClick={() => updateStatus.mutate({ id, status: "approved" })}
                disabled={updateStatus.isPending}
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Approve
              </button>
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                onClick={() => updateStatus.mutate({ id, status: "rejected" })}
                disabled={updateStatus.isPending}
              >
                <XCircle className="h-3.5 w-3.5" /> Reject
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Applicant */}
          <Section title="Applicant Info" icon={User}>
            <Field
              label="Full Name"
              value={`${app.firstName} ${app.lastName}`}
            />
            <Field label="Email" value={app.email} />
            <Field label="Gender" value={fd?.gender} />
            <Field label="Date of Birth" value={fd?.dateOfBirth} />
            <Field label="Citizenship" value={fd?.citizenship} />
            <Field label="Marital Status" value={fd?.maritalStatus} />
            <Field label="Embassy Location" value={fd?.embassyLocation} />
            <Field label="Program" value={app.selectedProgram} />
          </Section>

          {/* Place of Birth */}
          {fd?.placeOfBirth && (
            <Section title="Place of Birth" icon={MapPin}>
              <Field label="City" value={fd.placeOfBirth.city} />
              <Field label="State" value={fd.placeOfBirth.state} />
              <Field label="Country" value={fd.placeOfBirth.country} />
            </Section>
          )}

          {/* Permanent Address */}
          {fd?.permanentAddress && (
            <Section title="Permanent Address" icon={MapPin}>
              <Field label="Address" value={fd.permanentAddress} />
              <Field label="City" value={fd.permanentCity} />
              <Field label="State" value={fd.permanentState} />
              <Field label="ZIP" value={fd.permanentZip} />
              <Field label="Country" value={fd.permanentCountry} />
            </Section>
          )}

          {/* Language */}
          {fd?.language1 && (
            <Section title="Language Proficiency" icon={Globe}>
              <Field label="Language" value={fd.language1.name} />
              <Field label="Speaking" value={fd.language1.speaking} />
              <Field label="Reading" value={fd.language1.reading} />
              <Field label="Writing" value={fd.language1.writing} />
            </Section>
          )}

          {/* Documents */}
          <div className="rounded-xl border border-[#ECEAE6] bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#3730A3]" />
              <h2 className="text-sm font-semibold text-[#111]">Documents</h2>
            </div>
            {student?.documents?.length ? (
              <div className="space-y-2">
                {student.documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg bg-[#F7F5F2] px-3 py-2 text-sm"
                  >
                    <span className="text-[#111]">
                      {doc.documentType?.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${doc.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : doc.status === "REJECTED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#9CA3AF]">No documents uploaded</p>
            )}
          </div>

          {/* Upload Admission Letter — shown when application is approved */}
          {app.status === "approved" && (
            <AdmissionLetterUpload applicationId={id} />
          )}

          {/* Payments */}
          <div className="rounded-xl border border-[#ECEAE6] bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#3730A3]" />
              <h2 className="text-sm font-semibold text-[#111]">Payments</h2>
            </div>
            {student?.payments?.length ? (
              <div className="space-y-2">
                {student.payments.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg bg-[#F7F5F2] px-3 py-2 text-sm"
                  >
                    <span className="text-[#111]">
                      Stage {p.stage} — ₹{p.amount.toLocaleString()}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#9CA3AF]">No payments recorded</p>
            )}
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-[#ECEAE6] bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <History className="h-4 w-4 text-[#3730A3]" />
              <h2 className="text-sm font-semibold text-[#111]">Timeline</h2>
            </div>
            {app.timelineEvents?.length ? (
              <div className="space-y-3">
                {app.timelineEvents.map((e: any) => (
                  <div key={e.id} className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#3730A3]" />
                    <div>
                      <p className="text-sm font-medium text-[#111]">
                        {e.title}
                      </p>
                      {e.description && (
                        <p className="text-xs text-[#9CA3AF]">
                          {e.description}
                        </p>
                      )}
                      <p className="text-xs text-[#9CA3AF]">
                        {new Date(e.occurredAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#9CA3AF]">No events yet</p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* University */}
          <div className="rounded-xl border border-[#ECEAE6] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#3730A3]" />
              <h2 className="text-sm font-semibold text-[#111]">University</h2>
            </div>
            {uni?.logo && (
              <img
                src={uni.logo}
                alt={uni.name}
                className="mb-3 h-10 w-10 rounded-lg object-contain"
              />
            )}
            <p className="text-sm font-semibold text-[#111]">{uni?.name}</p>
            <p className="text-xs text-[#9CA3AF]">
              {uni?.shortName} · {uni?.type}
            </p>
            <p className="mt-1 text-xs text-[#9CA3AF]">
              Est. {uni?.establishedYear}
            </p>
            {uni?.website && (
              <a
                href={uni.website}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-xs text-[#3730A3] hover:underline"
              >
                {uni.website}
              </a>
            )}
          </div>

          {/* Student Profile */}
          <div className="rounded-xl border border-[#ECEAE6] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-[#3730A3]" />
              <h2 className="text-sm font-semibold text-[#111]">
                Student Profile
              </h2>
            </div>
            <div className="space-y-3">
              <Field label="Name" value={student?.user?.name} />
              <Field label="Email" value={student?.user?.email} />
              <Field label="Phone" value={student?.user?.phone} />
              <Field
                label="Stage"
                value={
                  student?.currentStage ? `Stage ${student.currentStage}` : null
                }
              />
              <Field
                label="Status"
                value={student?.applicationStatus?.replace(/_/g, " ")}
              />
              <Field label="NEET Score" value={student?.neetScore} />
              <Field label="NEET Rank" value={student?.neetRank} />
              <Field label="12th %" value={student?.twelfthPercentage} />
              <Field label="10th %" value={student?.tenthPercentage} />
              <Field label="Passport No." value={student?.passportNumber} />
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

          {/* Submission Meta */}
          <div className="rounded-xl border border-[#ECEAE6] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#3730A3]" />
              <h2 className="text-sm font-semibold text-[#111]">Submission</h2>
            </div>
            <div className="space-y-3">
              <Field
                label="Submitted"
                value={
                  app.submittedAt
                    ? new Date(app.submittedAt).toLocaleString()
                    : null
                }
              />
              <Field
                label="Created"
                value={new Date(app.createdAt).toLocaleString()}
              />
              <Field
                label="Last Updated"
                value={new Date(app.updatedAt).toLocaleString()}
              />
            </div>
          </div>

          {/* Tickets */}
          {app.tickets?.length > 0 && (
            <div className="rounded-xl border border-[#ECEAE6] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#3730A3]" />
                <h2 className="text-sm font-semibold text-[#111]">
                  Support Tickets
                </h2>
              </div>
              <div className="space-y-2">
                {app.tickets.map((t: any) => (
                  <div key={t.id} className="rounded-lg bg-[#F7F5F2] px-3 py-2">
                    <p className="text-xs font-medium text-[#111]">
                      {t.subject}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      {t.status} · {t.priority}
                    </p>
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
    <div className="rounded-xl border border-[#3730A3]/20 bg-[#3730A3]/5 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Upload className="h-4 w-4 text-[#3730A3]" />
        <h2 className="text-sm font-semibold text-[#111]">
          Upload Admission Letter
        </h2>
      </div>
      <p className="text-xs text-[#9CA3AF] mb-4">
        Upload the admission letter PDF. This will notify the student and
        advance them to Stage 2 (payment of ₹5,000).
      </p>

      {success ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Admission letter uploaded. Student notified and advanced to Stage 2.
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
            className="inline-flex items-center gap-2 rounded-lg bg-[#3730A3] px-4 py-2 text-xs font-medium text-white hover:bg-[#2D2880] disabled:opacity-50"
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
            <p className="mt-2 text-xs text-red-600">{uploadError}</p>
          )}
        </>
      )}
    </div>
  );
}
