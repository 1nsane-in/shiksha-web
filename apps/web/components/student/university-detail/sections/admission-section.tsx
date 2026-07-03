"use client";

import { brand as theme } from "@/lib/brand";
import { Check } from "lucide-react";
import { SectionCard, InfoField, ChipList } from "../common/ui";
import type { UniversityAdmission } from "@/domains/universities/universities.types";

export function AdmissionSection({ admission }: { admission: UniversityAdmission | null }) {
  if (!admission) {
    return (
      <SectionCard title="Admission Details" isEmpty emptyMessage="Admission information will be available soon." />
    );
  }

  return (
    <SectionCard
      title="Admission Details"
      isEmpty={
        !admission.eligibility &&
        !admission.minimumMarks &&
        !admission.ageCriteria &&
        admission.applicationFee == null &&
        !admission.applicationDeadline &&
        !admission.entranceExams?.length &&
        !admission.requiredDocuments?.length
      }
      emptyMessage="Detailed admission information will be updated soon."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <InfoField label="Eligibility" value={admission.eligibility} />
        <InfoField label="Minimum Marks" value={admission.minimumMarks} />
        <InfoField label="Age Criteria" value={admission.ageCriteria} />

        {admission.applicationFee != null && admission.applicationFee > 0 ? (
          <InfoField label="Application Fee" value={`₹${admission.applicationFee.toLocaleString()}`} />
        ) : admission.applicationFee === 0 ? (
          <InfoField label="Application Fee" value="Free" />
        ) : null}
        {admission.applicationDeadline && (
          <InfoField
            label="Deadline"
            value={new Date(admission.applicationDeadline).toLocaleDateString("en-IN", {
              year: "numeric", month: "long", day: "numeric",
            })}
          />
        )}
        {admission.entranceExams?.length > 0 && (
          <div className="sm:col-span-2">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>
              Entrance Exams
            </p>
            <ChipList items={admission.entranceExams} />
          </div>
        )}
        {admission.requiredDocuments?.length > 0 && (
          <div className="sm:col-span-2">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>
              Required Documents
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {admission.requiredDocuments.map((doc: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                  style={{ background: theme.canvas, border: "1px solid " + theme.hairline }}
                >
                  <Check className="size-4 shrink-0" style={{ color: theme.gold }} />
                  <span style={{ color: theme.inkMuted }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
