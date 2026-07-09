"use client";

import React from "react";
import { Card, CardContent } from "@repo/ui";
import { SectionHeading, InfoRow, BadgeList, DataCard, DataCardPad, EmptyState } from "@/components/admin/universities/ui";
import { ClipboardList, FileText, Medal, Calendar, ScrollText, Banknote, Shield, CheckCircle2 } from "lucide-react";

export function AdmissionTab({
  adm,
  router,
  uniId,
}: {
  adm: any;
  router: any;
  uniId: string;
}) {
  return (
    <div className="space-y-5">
      {adm ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Requirements */}
          <Card size="sm" className="border-[#ECEAE6]">
            <CardContent className="space-y-3 p-4 sm:p-5">
              <SectionHeading icon={ClipboardList} title="Requirements" />
              <InfoRow
                icon={FileText}
                label="Entrance Exams"
                value={<BadgeList items={adm.entranceExams} />}
              />
              <InfoRow
                icon={Medal}
                label="Minimum Marks"
                value={adm.minimumMarks}
              />
              <InfoRow
                icon={Calendar}
                label="Age Criteria"
                value={adm.ageCriteria}
              />
              <InfoRow
                icon={FileText}
                label="Eligibility"
                value={adm.eligibility}
              />
              {adm.programEligibility && (
                <InfoRow
                  icon={ScrollText}
                  label="Program-Specific Eligibility"
                  value={
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(adm.programEligibility)
                        ? adm.programEligibility
                        : []
                      ).map((pe: any, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-md border border-[#ECEAE6] bg-white px-2 py-0.5 text-xs text-[#6B6B6B]"
                        >
                          {pe.program || pe.name}:{" "}
                          {pe.eligibility || pe.minimumMarks}
                        </span>
                      ))}
                    </div>
                  }
                />
              )}
            </CardContent>
          </Card>

          {/* Deadline & Fees */}
          <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
            <CardContent className="space-y-4 p-5">
              <SectionHeading
                icon={ScrollText}
                title="Application Process & Deadlines"
              />
              <div className="grid grid-cols-1 gap-3">
                <InfoRow
                  icon={Banknote}
                  label="Application Form Fee"
                  value={`₹${adm.applicationFee?.toLocaleString() ?? "—"}`}
                />
                <InfoRow
                  icon={Calendar}
                  label="Submission Deadline"
                  value={
                    adm.applicationDeadline
                      ? new Date(
                          adm.applicationDeadline,
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"
                  }
                />
                <InfoRow
                  icon={ClipboardList}
                  label="Admissions Selection Process"
                  value={adm.selectionProcess}
                />
                {adm.reservationPolicy && (
                  <InfoRow
                    icon={Shield}
                    label="Reservation Policy"
                    value={adm.reservationPolicy}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {adm.requiredDocuments?.length > 0 && (
            <DataCard className="md:col-span-2">
              <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                <SectionHeading
                  icon={FileText}
                  title="Required Documents"
                />
              </div>
              <DataCardPad>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {adm.requiredDocuments.map((doc: string) => (
                    <div
                      key={doc}
                      className="flex items-center gap-2 rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] px-3 py-2.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="text-sm text-[#111]">{doc}</span>
                    </div>
                  ))}
                </div>
              </DataCardPad>
            </DataCard>
          )}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          message="No admission details available"
        />
      )}
    </div>
  );
}
