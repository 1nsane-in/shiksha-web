"use client";

import { Card, CardContent } from "@repo/ui";
import { Users, Clock, GraduationCap, CheckCircle2 } from "lucide-react";

interface Props {
  stats: {
    total?: number;
    byStage?: Record<number, number>;
    byStatus?: Record<string, number>;
  } | undefined;
}

export function StudentStatsCards({ stats }: Props) {
  const stage2 = (stats?.byStage?.[1] ?? 0) + (stats?.byStage?.[2] ?? 0);
  const entrance = stats?.byStage?.[3] ?? 0;
  const visaCompleted = (stats?.byStage?.[5] ?? 0) + (stats?.byStatus?.["COMPLETED"] ?? 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={<Users className="size-5 text-violet-600" />} bg="bg-violet-100" label="Total Registered" value={stats?.total ?? 0} />
      <StatCard icon={<Clock className="size-5 text-yellow-600" />} bg="bg-yellow-100" label="In Stage 1 & 2" value={stage2} />
      <StatCard icon={<GraduationCap className="size-5 text-blue-600" />} bg="bg-blue-100" label="In Entrance Exam" value={entrance} />
      <StatCard icon={<CheckCircle2 className="size-5 text-emerald-600" />} bg="bg-emerald-100" label="Visa & Completed" value={visaCompleted} />
    </div>
  );
}

function StatCard({ icon, bg, label, value }: { icon: React.ReactNode; bg: string; label: string; value: number }) {
  return (
    <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
      <CardContent className="pt-4 flex items-center gap-4">
        <div className={`rounded-lg ${bg} p-2.5`}>{icon}</div>
        <div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{label}</p>
          <p className="text-xl font-bold text-[#111] mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
