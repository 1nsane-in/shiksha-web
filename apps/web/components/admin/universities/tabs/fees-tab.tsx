"use client";

import React from "react";
import { Card, CardContent } from "@repo/ui";
import { SectionHeading, InfoRow, BadgeList } from "@/components/admin/universities/ui";
import { DollarSign, Banknote, Calendar, TrendingUp, Award, Heart, Users, GraduationCap, Briefcase, CreditCard, FileText, BarChart3 } from "lucide-react";

export function FeesTab({
  fees,
  router,
  uniId,
}: {
  fees: any;
  router: any;
  uniId: string;
}) {
  return (
    <div className="space-y-6">
      {fees ? (
        (() => {
          const f = fees;
              return (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading
                        icon={DollarSign}
                        title="Fee Structure"
                        onEdit={() =>
                          router.push(`/admin/universities/${uniId}/edit`)
                        }
                      />
                      <InfoRow
                        icon={DollarSign}
                        label="Tuition (Annual)"
                        value={`${f.currency} ${f.tuitionAnnual?.toLocaleString() ?? "—"}`}
                      />
                      <InfoRow
                        icon={DollarSign}
                        label="Total Program Fee"
                        value={`${f.currency} ${f.totalProgram?.toLocaleString() ?? "—"}`}
                      />
                      {f.hostelAnnual != null && (
                        <InfoRow
                          icon={DollarSign}
                          label="Hostel (Annual)"
                          value={`${f.currency} ${f.hostelAnnual.toLocaleString()}`}
                        />
                      )}
                      <InfoRow
                        icon={DollarSign}
                        label="Registration Fee"
                        value={`${f.currency} ${f.registration?.toLocaleString() ?? "—"}`}
                      />
                      {f.examination != null && (
                        <InfoRow
                          icon={DollarSign}
                          label="Examination Fee"
                          value={`${f.currency} ${f.examination.toLocaleString()}`}
                        />
                      )}
                      {f.library != null && (
                        <InfoRow
                          icon={DollarSign}
                          label="Library Fee"
                          value={`${f.currency} ${f.library.toLocaleString()}`}
                        />
                      )}
                      {f.otherFees && (
                        <InfoRow
                          icon={DollarSign}
                          label="Other Fees"
                          value={JSON.stringify(f.otherFees)}
                        />
                      )}
                    </CardContent>
                  </Card>
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading
                        icon={CreditCard}
                        title="Payment & Scholarship"
                        onEdit={() =>
                          router.push(`/admin/universities/${uniId}/edit`)
                        }
                      />
                      <InfoRow
                        icon={CreditCard}
                        label="Payment Schedule"
                        value={f.paymentSchedule ?? "—"}
                      />
                      <InfoRow
                        icon={FileText}
                        label="Refund Policy"
                        value={f.refundPolicy ?? "—"}
                      />
                      {f.feeHikePolicy && (
                        <InfoRow
                          icon={TrendingUp}
                          label="Fee Hike Policy"
                          value={f.feeHikePolicy}
                        />
                      )}
                      <InfoRow
                        icon={Heart}
                        label="Scholarship Available"
                        value={f.scholarshipAvailable ? "Yes" : "No"}
                      />
                      {f.scholarshipDetails && (
                        <InfoRow
                          icon={FileText}
                          label="Scholarship Details"
                          value={f.scholarshipDetails}
                        />
                      )}
                      {f.programBreakdown && (
                        <InfoRow
                          icon={BarChart3}
                          label="Program-Wise Fee Breakdown"
                          value={JSON.stringify(f.programBreakdown)}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })()
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <SectionHeading
                    icon={DollarSign}
                    title="Fee Structure"
                    onEdit={() =>
                      router.push(`/admin/universities/${uniId}/edit`)
                    }
                  />
                  <InfoRow
                    icon={DollarSign}
                    label="Tuition (Annual)"
                    value="—"
                  />
                  <InfoRow
                    icon={DollarSign}
                    label="Total Program Fee"
                    value="—"
                  />
                  <InfoRow
                    icon={DollarSign}
                    label="Hostel (Annual)"
                    value="—"
                  />
                  <InfoRow
                    icon={DollarSign}
                    label="Registration Fee"
                    value="—"
                  />
                  <InfoRow
                    icon={DollarSign}
                    label="Examination Fee"
                    value="—"
                  />
                  <InfoRow icon={DollarSign} label="Library Fee" value="—" />
                  <InfoRow icon={DollarSign} label="Other Fees" value="—" />
                </CardContent>
              </Card>
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <SectionHeading
                    icon={CreditCard}
                    title="Payment & Scholarship"
                    onEdit={() =>
                      router.push(`/admin/universities/${uniId}/edit`)
                    }
                  />
                  <InfoRow
                    icon={CreditCard}
                    label="Payment Schedule"
                    value="—"
                  />
                  <InfoRow icon={FileText} label="Refund Policy" value="—" />
                  <InfoRow
                    icon={TrendingUp}
                    label="Fee Hike Policy"
                    value="—"
                  />
                  <InfoRow
                    icon={Heart}
                    label="Scholarship Available"
                    value="—"
                  />
                  <InfoRow
                    icon={FileText}
                    label="Scholarship Details"
                    value="—"
                  />
                  <InfoRow
                    icon={BarChart3}
                    label="Program-Wise Fee Breakdown"
                    value="—"
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
  );
}
