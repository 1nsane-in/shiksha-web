"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { GraduationCap } from "lucide-react";

interface Props {
  neetScore?: number | null;
  neetRank?: number | null;
  twelfthPercentage?: number | null;
  tenthPercentage?: number | null;
}

export function StudentAcademicCard({ neetScore, neetRank, twelfthPercentage, tenthPercentage }: Props) {
  return (
    <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Academic History & Entrance Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ScoreTile label="NEET Score" value={neetScore ?? "N/A"} />
          <ScoreTile label="NEET Rank" value={neetRank ?? "N/A"} />
          <ScoreTile label="12th Grade %" value={twelfthPercentage ? `${twelfthPercentage}%` : "N/A"} />
          <ScoreTile label="10th Grade %" value={tenthPercentage ? `${tenthPercentage}%` : "N/A"} />
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-[#ECEAE6] p-3.5 rounded-xl text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xl font-bold text-[#111] mt-1">{value}</p>
    </div>
  );
}
