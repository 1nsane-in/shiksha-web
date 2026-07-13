"use client";

import { Building2, GraduationCap, History } from "lucide-react";
import { Field } from "@/components/admin/shared/detail-primitives";
import { formatLedgerDate } from "@/components/admin/shared/format-ledger-date";

interface University {
  name?: string;
  shortName?: string;
  type?: string;
  establishedYear?: number;
  website?: string;
  logo?: string;
  bannerImage?: string;
}

interface Student {
  user?: { name?: string; phone?: string };
  currentStage?: number;
  applicationStatus?: string;
  neetScore?: number;
  neetRank?: number;
  twelfthPercentage?: number;
  tenthPercentage?: number;
  passportNumber?: string;
  passportExpiry?: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  occurredAt: string;
}

interface Props {
  university?: University | null;
  student?: Student | null;
  timelineEvents?: TimelineEvent[];
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function ApplicationSidebar({ university: uni, student, timelineEvents, submittedAt, createdAt, updatedAt }: Props) {
  return (
    <div className="space-y-6">
      {/* University Details */}
      <div className="rounded-xl border border-[#d3cec6] bg-white overflow-hidden">
        <div className="h-16 w-full border-b border-[#ebe7e1] relative bg-zinc-100">
          {uni?.bannerImage && (
            <img src={uni.bannerImage} alt="University Banner" className="absolute inset-0 h-full w-full object-cover" />
          )}
        </div>
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-8 bg-white p-1 rounded-xl border border-[#d3cec6] shadow-sm">
            {uni?.logo ? (
              <img src={uni.logo} alt={uni.name} className="h-14 w-14 rounded-lg object-contain bg-white" />
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
              <p className="text-xs text-[#626260]">Est. {uni?.establishedYear}</p>
            </div>
          </div>
          {uni?.website && (
            <div className="mt-5 pt-4 border-t border-[#ebe7e1]">
              <a href={uni.website} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#626260] hover:text-[#111111] transition-all">
                Official Website
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Academic History */}
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
          <Field label="Admission Pipeline Stage" value={student?.currentStage ? `Stage ${student.currentStage}` : "—"} />
          <Field label="Student Pipeline Status" value={student?.applicationStatus?.replace(/_/g, " ")} />
          <div className="grid grid-cols-2 gap-4 border-t border-[#ebe7e1] pt-4">
            <Field label="NEET Score" value={student?.neetScore} />
            <Field label="NEET Rank" value={student?.neetRank} />
            <Field label="Class 12th %" value={student?.twelfthPercentage} />
            <Field label="Class 10th %" value={student?.tenthPercentage} />
          </div>
          <div className="border-t border-[#ebe7e1] pt-4 space-y-4">
            <Field label="Passport Number" value={student?.passportNumber} />
            <Field label="Passport Expiry" value={student?.passportExpiry ? new Date(student.passportExpiry).toLocaleDateString() : null} />
          </div>
        </div>
      </div>

      {/* System & Audit Trail */}
      {timelineEvents && (
        <div className="rounded-xl border border-[#d3cec6] bg-white overflow-hidden transition-all">
          <div className="p-6 md:p-8 pb-6">
            <div className="mb-6 flex items-center border-b border-[#ebe7e1] pb-4">
              <div className="rounded-lg bg-zinc-100 p-2 text-[#111111] mr-3">
                <History className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#111111] tracking-tight">System & Audit Trail</h2>
                <p className="text-[11px] text-[#626260] mt-0.5">Application lifecycle and mutation record</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-8 bg-zinc-50/50 p-4 rounded-lg border border-[#ebe7e1]">
              <div className="flex items-center justify-between py-2 border-b border-[#ebe7e1] last:border-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#626260]">Application Submitted</p>
                <p className="text-xs font-medium text-[#111111]">{formatLedgerDate(submittedAt)}</p>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#ebe7e1] last:border-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#626260]">System Creation</p>
                <p className="text-xs font-medium text-[#111111]">{formatLedgerDate(createdAt)}</p>
              </div>
              <div className="flex items-center justify-between py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#626260]">Last Record Mutation</p>
                <p className="text-xs font-medium text-[#111111]">{formatLedgerDate(updatedAt)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#626260] mb-5">Chronological Events</h3>
              {timelineEvents.length > 0 ? (
                <div className="relative pl-5 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[#ebe7e1]">
                  {timelineEvents.map((e: TimelineEvent) => (
                    <div key={e.id} className="relative space-y-1 group">
                      <div className="absolute -left-[22px] top-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-white bg-[#111111] ring-1 ring-[#d3cec6] group-hover:ring-[#111111] transition-all" />
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <p className="text-sm font-medium text-[#111111]">{e.title}</p>
                        <p className="text-[10px] font-mono text-[#626260] bg-white inline-block">{formatLedgerDate(e.occurredAt)}</p>
                      </div>
                      {e.description && <p className="text-xs text-[#626260] leading-relaxed max-w-2xl">{e.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center bg-zinc-50 rounded-lg border border-dashed border-[#d3cec6]">
                  <p className="text-xs text-[#626260]">No chronological timeline events recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
