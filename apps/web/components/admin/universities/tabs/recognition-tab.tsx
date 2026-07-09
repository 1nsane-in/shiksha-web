"use client";

import React from "react";
import { Card, CardContent } from "@repo/ui";
import { SectionHeading, InfoRow, BadgeList } from "@/components/admin/universities/ui";
import { Medal, Award, CheckCircle2, Shield, Star, BarChart3, Globe, MapPin } from "lucide-react";

export function RecognitionTab({
  recognition,
  router,
  uniId,
}: {
  recognition: any;
  router: any;
  uniId: string;
}) {
  return (
    <div className="space-y-6">
      {recognition ? (
        (() => {
          const r = recognition;
          return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading
                        icon={Medal}
                        title="Accreditations"
                        onEdit={() =>
                          router.push(`/admin/universities/${uniId}/edit`)
                        }
                      />
                      <InfoRow
                        icon={Award}
                        label="Recognition Bodies"
                        value={<BadgeList items={r.bodies} />}
                      />
                      <InfoRow
                        icon={CheckCircle2}
                        label="ECFMG Status"
                        value={r.ecfmgStatus?.replace("_", " ")}
                      />
                      <InfoRow
                        icon={Shield}
                        label="NAAC Grade"
                        value={r.naacGrade ?? "—"}
                      />
                      <InfoRow
                        icon={Star}
                        label="NBA Accredited"
                        value={r.nbaAccredited ? "Yes" : "No"}
                      />
                      {r.accreditations?.length > 0 && (
                        <InfoRow
                          icon={Award}
                          label="Other Accreditations"
                          value={<BadgeList items={r.accreditations} />}
                        />
                      )}
                    </CardContent>
                  </Card>
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading
                        icon={BarChart3}
                        title="Rankings"
                        onEdit={() =>
                          router.push(`/admin/universities/${uniId}/edit`)
                        }
                      />
                      <InfoRow
                        icon={Globe}
                        label="World Rank"
                        value={r.worldRank ?? "—"}
                      />
                      <InfoRow
                        icon={MapPin}
                        label="National Rank"
                        value={r.nationalRank ?? "—"}
                      />
                      <InfoRow
                        icon={Globe}
                        label="Ranking Source"
                        value={r.rankingSource ?? "—"}
                      />
                      <InfoRow
                        icon={Globe}
                        label="World Ranking Source"
                        value={r.worldRankingSource ?? "—"}
                      />
                      <InfoRow
                        icon={MapPin}
                        label="National Ranking Source"
                        value={r.nationalRankingSource ?? "—"}
                      />
                      {r.otherRankingSource && (
                        <InfoRow
                          icon={Globe}
                          label="Other Ranking Source"
                          value={r.otherRankingSource}
                        />
                      )}
                      {r.otherNationalRankingSource && (
                        <InfoRow
                          icon={MapPin}
                          label="Other National Ranking Source"
                          value={r.otherNationalRankingSource}
                        />
                      )}
                      {r.subjectRankings && (
                        <InfoRow
                          icon={BarChart3}
                          label="Subject Rankings"
                          value={
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(
                                r.subjectRankings as Record<string, any>,
                              ).map(([subject, rank]) => (
                                <span
                                  key={subject}
                                  className="inline-flex items-center rounded-md border border-[#ECEAE6] bg-white px-2 py-0.5 text-xs text-[#6B6B6B]"
                                >
                                  {subject}: {rank}
                                </span>
                              ))}
                            </div>
                          }
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
                    icon={Medal}
                    title="Accreditations"
                    onEdit={() =>
                      router.push(`/admin/universities/${uniId}/edit`)
                    }
                  />
                  <InfoRow icon={Award} label="Recognition Bodies" value="—" />
                  <InfoRow icon={CheckCircle2} label="ECFMG Status" value="—" />
                  <InfoRow icon={Shield} label="NAAC Grade" value="—" />
                  <InfoRow icon={Star} label="NBA Accredited" value="—" />
                  <InfoRow
                    icon={Award}
                    label="Other Accreditations"
                    value="—"
                  />
                </CardContent>
              </Card>
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <SectionHeading
                    icon={BarChart3}
                    title="Rankings"
                    onEdit={() =>
                      router.push(`/admin/universities/${uniId}/edit`)
                    }
                  />
                  <InfoRow icon={Globe} label="World Rank" value="—" />
                  <InfoRow icon={MapPin} label="National Rank" value="—" />
                  <InfoRow icon={Globe} label="Ranking Source" value="—" />
                  <InfoRow
                    icon={Globe}
                    label="World Ranking Source"
                    value="—"
                  />
                  <InfoRow
                    icon={MapPin}
                    label="National Ranking Source"
                    value="—"
                  />
                  <InfoRow
                    icon={Globe}
                    label="Other Ranking Source"
                    value="—"
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Other National Ranking Source"
                    value="—"
                  />
                  <InfoRow
                    icon={BarChart3}
                    label="Subject Rankings"
                    value="—"
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
  );
}
