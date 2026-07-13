"use client";

import { use, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, GraduationCap, Languages, FileText, Clock, Building2, Calendar, Mail, MapPin, FileIcon, X, User, Lock, ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { brand } from "@/lib/brand";
import { useMyApplicationById, useStageInfo } from "@/domains/student/student.queries";
import { useApplicationTimeline } from "@/domains/timeline";
import { stageActions, stageNames } from "@/domains/student/student.constants";
import type { TimelineEvent } from "@/domains/timeline";
import type { SubmitApplicationFormData } from "@/domains/student/student.types";
import { formatDate, formatProgram } from "@/lib/utils";
import { useInitiatePayment } from "@/domains/payments";
import { useAuth } from "@/hooks/useAuth";

import { StatusBadge } from "@/components/shared/status-badge";

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ── Language proficiency pills ── */
function LanguageDisplay({ language }: { language: { name: string; speaking: string; reading: string; writing: string } }) {
  const levelStyle = (level: string): { bg: string; text: string } => {
    switch (level.toLowerCase()) {
      case "native":      return { bg: "#DCFCE7", text: "#166534" };
      case "fluent":      return { bg: "#DBEAFE", text: "#1E40AF" };
      case "intermediate": return { bg: "#FEF3C7", text: "#92400E" };
      case "beginner":    return { bg: "#F3F4F6", text: "#6B7280" };
      default:            return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };
  const skills = ["speaking", "reading", "writing"] as const;
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <p className="mb-2 text-sm font-semibold" style={{ color: brand.ink }}>{language.name}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => {
          const c = levelStyle(language[skill]);
          return (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: c.bg, color: c.text }}
            >
              <span className="lowercase opacity-60">{skill}:</span>
              <span>{language[skill]}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function isPdf(url: string): boolean {
  return url.toLowerCase().includes(".pdf") || url.toLowerCase().endsWith("pdf");
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════════════════════ */

/* ── Section shell: white card with gold top accent bar ── */
function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white" style={{ border: `1px solid ${brand.hairline}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
      <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${brand.gold} 0%, ${brand.gold}40 100%)` }} />
      <div className="px-5 pt-4 pb-5">
        <div className="mb-4 flex items-center gap-2">
          <Icon className="size-3.5" style={{ color: brand.gold }} />
          <h3 className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: brand.inkMuted }}>{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Document thumbnail card ── */
function DocThumb({ label, url, onClick }: { label: string; url: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg text-left transition-all hover:shadow-md"
      style={{ border: `1px solid ${brand.hairline}` }}
    >
      {isPdf(url) ? (
        <div className="flex h-32 items-center justify-center" style={{ background: brand.canvas }}>
          <div className="text-center">
            <FileIcon className="mx-auto size-7" style={{ color: "#DC2626" }} />
            <p className="mt-1 text-[11px] font-medium" style={{ color: brand.inkMuted }}>PDF</p>
          </div>
        </div>
      ) : (
        <div className="h-32 overflow-hidden">
          <img
            src={url}
            alt={label}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 px-3 py-2" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
        <p className="text-xs font-medium text-white">{label}</p>
      </div>
    </button>
  );
}

/* ── Stage pill ── */
function StagePill({ stage }: { stage: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium" style={{ background: brand.goldLight, color: brand.gold, border: `1px solid ${brand.goldBorder}` }}>
      Stage {stage}
      <span className="opacity-30 mx-0.5">·</span>
      <span className="opacity-80">{stageNames[stage] || "Unknown"}</span>
    </div>
  );
}

/* ── Profile sidebar card ── */
function ProfileCard({ name, email, dateOfBirth, gender, citizenship, maritalStatus, placeOfBirth }: {
  name: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  citizenship?: string;
  maritalStatus?: string;
  placeOfBirth?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white" style={{ border: `1px solid ${brand.hairline}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${brand.gold} 0%, ${brand.gold}40 100%)` }} />
      <div className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <User className="size-3.5" style={{ color: brand.gold }} />
          <h3 className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: brand.inkMuted }}>Applicant</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: brand.ink }}>{name}</p>
            {email && (
              <div className="mt-1 flex items-center gap-1.5">
                <Mail className="size-3 shrink-0" style={{ color: brand.inkMuted }} />
                <span className="text-xs" style={{ color: brand.inkMuted }}>{email}</span>
              </div>
            )}
          </div>
          {(dateOfBirth || gender || citizenship || maritalStatus || placeOfBirth) && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-3" style={{ borderTop: `1px solid ${brand.hairline}` }}>
              {dateOfBirth && (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>DOB</p>
                  <p className="mt-0.5 text-sm" style={{ color: brand.ink }}>{formatDate(dateOfBirth)}</p>
                </div>
              )}
              {gender && (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>Gender</p>
                  <p className="mt-0.5 text-sm" style={{ color: brand.ink }}>{capitalize(gender)}</p>
                </div>
              )}
              {citizenship && (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>Citizenship</p>
                  <p className="mt-0.5 text-sm" style={{ color: brand.ink }}>{citizenship}</p>
                </div>
              )}
              {maritalStatus && (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>Status</p>
                  <p className="mt-0.5 text-sm" style={{ color: brand.ink }}>{capitalize(maritalStatus)}</p>
                </div>
              )}
              {placeOfBirth && (
                <div className="col-span-2">
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>Place of Birth</p>
                  <p className="mt-0.5 text-sm" style={{ color: brand.ink }}>{placeOfBirth}</p>
                </div>
              )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton loading state ── */
function Skeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-8 sm:px-6" style={{ background: brand.canvas }}>
      {/* top bar */}
      <div className="mb-8 flex justify-between">
        <div className="h-10 w-20 rounded-lg" style={{ background: brand.hairline }} />
        <div className="h-8 w-44 rounded-full" style={{ background: brand.hairline }} />
      </div>
      {/* hero */}
      <div className="mb-8 rounded-2xl bg-white p-6 sm:p-8" style={{ border: `1px solid ${brand.hairline}` }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="size-16 rounded-full sm:size-20" style={{ background: brand.hairline }} />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-56 rounded" style={{ background: brand.hairline }} />
            <div className="h-4 w-36 rounded" style={{ background: brand.hairline }} />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 min-w-[130px] flex-1 rounded-lg" style={{ background: brand.hairline }} />
          ))}
        </div>
      </div>
      {/* grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-white p-6" style={{ border: `1px solid ${brand.hairline}` }}>
              <div className="mb-4 h-4 w-24 rounded" style={{ background: brand.hairline }} />
              <div className="space-y-2">
                <div className="h-4 w-full rounded" style={{ background: brand.hairline }} />
                <div className="h-4 w-3/4 rounded" style={{ background: brand.hairline }} />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6" style={{ border: `1px solid ${brand.hairline}` }}>
            <div className="mb-4 h-4 w-20 rounded" style={{ background: brand.hairline }} />
            <div className="space-y-2">
              <div className="h-4 w-36 rounded" style={{ background: brand.hairline }} />
              <div className="h-4 w-28 rounded" style={{ background: brand.hairline }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Error state ── */
function ErrorState() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6" style={{ background: brand.canvas }}>
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full" style={{ background: brand.goldLight }}>
          <FileIcon className="size-6" style={{ color: brand.gold }} />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: brand.ink }}>Application not found</h2>
          <p className="mt-1 text-sm" style={{ color: brand.inkMuted }}>It may have been removed or you don&apos;t have access.</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-80"
          style={{ background: brand.ink }}
        >
          <ArrowLeft className="size-4" /> Go back
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: app, isLoading, error } = useMyApplicationById(id);
  const { data: stageInfo } = useStageInfo();
  const { data: timeline, isError: timelineError } = useApplicationTimeline(id);
  const admissionLetter = app?.admissionLetter;
  const { user } = useAuth();
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const initiatePayment = useInitiatePayment();
  const formRef = useRef<HTMLFormElement>(null);

  const handlePayAdmissionFee = useCallback(async () => {
    if (!user) { toast.error("Please login to continue"); return; }
    try {
      const hashData = await initiatePayment.mutateAsync({
        applicationId: id,
        stage: 2,
        firstName: user.name ?? "Student",
        email: user.email,
        phone: "",
      });
      if (!formRef.current) return;
      const form = formRef.current;
      form.action = hashData.payuBaseUrl;
      form.method = "POST";
      const fields: Record<string, string> = {
        hash: hashData.hash, key: hashData.key, txnid: hashData.txnid,
        amount: hashData.amount, productinfo: hashData.productinfo,
        firstname: hashData.firstname, email: hashData.email, phone: hashData.phone,
        surl: hashData.surl, furl: hashData.furl,
        service_provider: hashData.service_provider,
        udf1: hashData.udf1 ?? "", udf2: hashData.udf2 ?? "",
        udf3: hashData.udf3 ?? "", udf4: hashData.udf4 ?? "", udf5: hashData.udf5 ?? "",
      };
      Object.entries(fields).forEach(([name, value]) => {
        let input = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
        if (!input) { input = document.createElement("input"); input.type = "hidden"; input.name = name; form.appendChild(input); }
        input.value = value;
      });
      form.submit();
    } catch { toast.error("Failed to initiate payment. Try again."); }
  }, [user, id, initiatePayment]);

  if (isLoading) return <Skeleton />;
  if (error || !app) return <ErrorState />;

  const formData = app.formData as SubmitApplicationFormData | null;
  const currentStage = stageInfo?.currentStage ?? 1;
  const isApproved = app.status === "approved";
  const currentAction = isApproved ? (currentStage === 3 && !app.examRecord ? undefined : stageActions[currentStage]) : undefined;
  const isStage2Locked = currentStage === 2 && !admissionLetter;
  const timelineEvents = !timelineError && timeline ? (timeline as TimelineEvent[]).filter(Boolean) : [];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 min-h-screen" style={{ background: brand.canvas, color: brand.ink }}>

      {/* ═══ TOP BAR ═══ */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:opacity-60"
          style={{ color: brand.inkMuted }}
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        {currentStage && <StagePill stage={currentStage} />}
      </div>

      {/* ═══ UNIVERSITY HERO ═══ */}
      {app.university && (
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-white px-6 pb-6 pt-8 sm:px-8 " style={{ border: `1px solid ${brand.hairline}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {/* Gold accent bar */}
          <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${brand.gold} 0%, ${brand.gold}60 40%, transparent 100%)` }} />

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            {/* Icon */}
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full sm:size-20" style={{ background: brand.goldLight }}>
              <Building2 className="size-7 sm:size-8" style={{ color: brand.gold }} />
            </div>

            {/* Name + meta */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: brand.ink }}>{app.university.name}</h1>
                  {app.university.location && (
                    <p className="mt-1 text-sm flex items-center gap-1.5" style={{ color: brand.inkMuted }}>
                      <MapPin className="size-3.5 shrink-0" />
                      {[app.university.location.city, app.university.location.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
                <StatusBadge status={app.status} />
              </div>

              {app.submittedAt && (
                <p className="mt-3 flex items-center gap-1.5 text-sm" style={{ color: brand.inkMuted }}>
                  <Calendar className="size-3.5 shrink-0" />
                  Submitted {formatDate(app.submittedAt)}
                </p>
              )}
            </div>
          </div>

        {/* Next step footer — render when approved, action or not */}
        {isApproved && (
          <div className="mt-5 -mx-6 -mb-6 px-6 py-4 sm:-mx-8 sm:px-8 rounded-b-2xl" style={{ background: brand.goldLight, borderTop: `1px solid ${brand.goldBorder}` }}>
            <form ref={formRef} style={{ display: "none" }} />

            {isStage2Locked ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Lock className="size-4 shrink-0 mt-0.5 self-start" style={{ color: brand.ink }} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: brand.ink }}>Admission Letter Ready</p>
                    <p className="mt-0.5 text-xs" style={{ color: brand.inkMuted }}>Pay ₹5,000 to unlock and download your admission letter.</p>
                  </div>
                </div>
                <button
                  onClick={handlePayAdmissionFee}
                  disabled={initiatePayment.isPending}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ background: brand.ink }}
                >
                  {initiatePayment.isPending ? "Redirecting…" : "Pay ₹5,000"} <ArrowRight className="size-3.5" />
                </button>
              </div>
            ) : currentAction ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {currentAction.icon && <currentAction.icon className="size-4 shrink-0 mt-0.5 self-start" style={{ color: brand.ink }} />}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: brand.ink }}>{currentAction.label}</p>
                    <p className="mt-0.5 text-xs" style={{ color: brand.inkMuted }}>{currentAction.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(currentAction.href)}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85"
                  style={{ background: brand.ink }}
                >
                  Proceed <ArrowRight className="size-3.5" />
                </button>
              </div>
            ) : null}

            {/* Admission letter download — independent of currentAction */}
            {currentStage >= 3 && admissionLetter?.fileUrl && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="size-4 shrink-0 mt-0.5 self-start" style={{ color: brand.ink }} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: brand.ink }}>Admission Letter</p>
                    <p className="mt-0.5 text-xs" style={{ color: brand.inkMuted }}>Your admission letter is ready for download.</p>
                  </div>
                </div>
                <a
                  href={admissionLetter.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85"
                  style={{ background: brand.ink }}
                >
                  Download <ArrowRight className="size-3.5" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* ═══ CONTENT GRID ═══ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ─── MAIN COLUMN ─── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Program */}
          {(formData?.selectedProgram || app.selectedProgram) && (
            <Section icon={GraduationCap} title="Program">
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>Selected Program</p>
                  <p className="mt-0.5 text-sm font-semibold" style={{ color: brand.ink }}>
                    {formData?.selectedProgram ? formatProgram(formData.selectedProgram) : app.selectedProgram}
                  </p>
                </div>
                {formData?.postGraduateDetail && (
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>Post-Graduate Detail</p>
                    <p className="mt-0.5 text-sm" style={{ color: brand.ink }}>{formData.postGraduateDetail}</p>
                  </div>
                )}
                {formData?.embassyLocation && (
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>Embassy Location</p>
                    <p className="mt-0.5 text-sm" style={{ color: brand.ink }}>{formData.embassyLocation}</p>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Address */}
          {formData?.permanentAddress && (
            <Section icon={MapPin} title="Address">
              <div>
                {/* Formatted address block */}
                <div className="rounded-lg p-4 leading-relaxed" style={{ background: brand.canvas, border: `1px solid ${brand.hairline}` }}>
                  <p className="text-sm font-medium" style={{ color: brand.ink }}>{formData.permanentAddress}</p>
                  {(formData.permanentCity || formData.permanentState || formData.permanentZip) && (
                    <p className="text-sm" style={{ color: brand.inkMuted }}>
                      {[formData.permanentCity, formData.permanentState, formData.permanentZip].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {formData.permanentCountry && (
                    <p className="text-sm" style={{ color: brand.inkMuted }}>{formData.permanentCountry}</p>
                  )}
                </div>
                {/* Field breakdown */}
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ color: brand.inkMuted }}>
                  {formData.permanentCity && <span><span className="font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>City</span> {formData.permanentCity}</span>}
                  {formData.permanentState && <span><span className="font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>State</span> {formData.permanentState}</span>}
                  {formData.permanentZip && <span><span className="font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>ZIP</span> {formData.permanentZip}</span>}
                  {formData.permanentCountry && <span><span className="font-medium uppercase tracking-wider" style={{ color: brand.inkSubtle }}>Country</span> {formData.permanentCountry}</span>}
                </div>
              </div>
            </Section>
          )}

          {/* Languages */}
          {formData?.language1 && (
            <Section icon={Languages} title="Languages">
              <div className="divide-y" style={{ borderColor: brand.hairline }}>
                <LanguageDisplay language={formData.language1} />
                {formData.otherLanguages?.map((lang, i) => (
                  <LanguageDisplay key={i} language={lang} />
                ))}
              </div>
            </Section>
          )}

          {/* Documents */}
          {(formData?.passportUrl || formData?.certificateUrl) && (
            <Section icon={FileText} title="Documents">
              <div className="grid grid-cols-2 gap-4">
                {formData?.passportUrl && (
                  <DocThumb label="Passport Copy" url={formData.passportUrl} onClick={() => setLightboxUrl(formData.passportUrl!)} />
                )}
                {formData?.certificateUrl && (
                  <DocThumb label="School Certificate" url={formData.certificateUrl} onClick={() => setLightboxUrl(formData.certificateUrl!)} />
                )}
              </div>
            </Section>
          )}

          {/* Application Progress — redesigned with impeccable principles */}
          {timelineEvents.length > 0 && (
            <section className="rounded-2xl bg-white p-6 sm:p-8" style={{ border: '1px solid #d3cec6' }}>
              {/* Section Header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: '#f5f1ec' }}>
                  <Clock className="size-5" style={{ color: '#111111' }} />
                </div>
                <div>
                  <h2 className="text-lg font-medium tracking-tight" style={{ color: '#111111', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
                    Application Progress
                  </h2>
                  <p className="text-sm" style={{ color: '#626260' }}>
                    {timelineEvents.filter(e => e.isCompleted).length} of {timelineEvents.length} stages completed
                  </p>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="mb-6 rounded-xl p-4" style={{ background: '#f5f1ec' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: '#111111' }}>
                    {(() => {
                      const activeEvent = timelineEvents.find(e => e.isActive);
                      if (activeEvent) return `Current: ${activeEvent.title}`;
                      const allDone = timelineEvents.every(e => e.isCompleted);
                      return allDone ? 'All stages completed!' : 'Application in progress';
                    })()}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#111111' }}>
                    {Math.round((timelineEvents.filter(e => e.isCompleted).length / timelineEvents.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: '#ebe7e1' }}>
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(timelineEvents.filter(e => e.isCompleted).length / timelineEvents.length) * 100}%`,
                      background: '#111111'
                    }}
                  />
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="relative">
                {timelineEvents
                  .slice()
                  .sort((a: TimelineEvent, b: TimelineEvent) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime())
                  .map((event, idx) => {
                    const isLast = idx === timelineEvents.length - 1;
                    const done = event.isCompleted;
                    const active = event.isActive;

                    return (
                      <div key={event.id || idx} className="relative flex gap-4 pb-6 last:pb-0">
                        {/* Step indicator */}
                        <div className="flex flex-col items-center">
                          {/* Circle */}
                          <div 
                            className="relative flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300"
                            style={{
                              borderColor: done ? '#0bdf50' : active ? '#111111' : '#d3cec6',
                              background: done ? '#0bdf50' : active ? '#111111' : '#ffffff',
                            }}
                          >
                            {done ? (
                              <Check className="size-4 text-white" strokeWidth={2.5} />
                            ) : active ? (
                              <div className="size-2 rounded-full bg-white" />
                            ) : (
                              <div className="size-2 rounded-full" style={{ background: '#d3cec6' }} />
                            )}
                          </div>
                          {/* Connector line */}
                          {!isLast && (
                            <div
                              className="w-0.5 flex-1 min-h-[24px] my-1 transition-colors duration-300"
                              style={{
                                background: done ? '#0bdf50' : '#ebe7e1',
                              }}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 -mt-1">
                          <div 
                            className={`rounded-xl p-4 transition-all duration-200 ${active ? 'ring-1' : ''}`}
                            style={{ 
                              background: active ? '#ffffff' : 'transparent',
                              border: active ? '1px solid #111111' : '1px solid transparent',
                              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.04)' : 'none'
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p 
                                    className="text-sm font-medium leading-snug"
                                    style={{ 
                                      color: done ? '#111111' : active ? '#111111' : '#9c9fa5',
                                      fontFamily: 'Inter, system-ui, sans-serif'
                                    }}
                                  >
                                    {event.title}
                                  </p>
                                  {active && (
                                    <span 
                                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                                      style={{
                                        background: '#111111',
                                        color: '#ffffff',
                                      }}
                                    >
                                      In Progress
                                    </span>
                                  )}
                                  {done && (
                                    <span 
                                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                                      style={{
                                        background: '#dcfce7',
                                        color: '#15803d',
                                      }}
                                    >
                                      Completed
                                    </span>
                                  )}
                                </div>
                                {event.description && (
                                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: done ? '#626260' : active ? '#626260' : '#9c9fa5' }}>
                                    {event.description}
                                  </p>
                                )}
                              </div>
                              <span className="shrink-0 text-xs whitespace-nowrap" style={{ color: '#7b7b78' }}>
                                {formatDate(event.occurredAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}
        </div>

        {/* ─── SIDEBAR ─── */}
        <div className="space-y-6">
          <ProfileCard
            name={[app.firstName, formData?.middleName, app.lastName].filter(Boolean).join(" ") || "N/A"}
            email={formData?.email || app.email}
            dateOfBirth={formData?.dateOfBirth}
            gender={formData?.gender}
            citizenship={formData?.citizenship}
            maritalStatus={formData?.maritalStatus}
            placeOfBirth={formData?.placeOfBirth ? [formData.placeOfBirth.city, formData.placeOfBirth.state, formData.placeOfBirth.country].filter(Boolean).join(", ") : undefined}
          />
        </div>
      </div>

      {/* ═══ LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxUrl(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute right-4 top-4 z-[110] flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close preview"
            >
              <X className="size-5" />
            </button>
            {isPdf(lightboxUrl) ? (
              <embed
                src={lightboxUrl}
                type="application/pdf"
                className="h-[85vh] w-full max-w-4xl rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.img
                key={lightboxUrl}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={lightboxUrl}
                alt="Document preview"
                className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
