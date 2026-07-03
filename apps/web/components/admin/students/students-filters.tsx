"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";

interface Props {
  stage: number | undefined;
  status: string | undefined;
  onStageChange: (val: number | undefined) => void;
  onStatusChange: (val: string | undefined) => void;
}

export function StudentsFilters({ stage, status, onStageChange, onStatusChange }: Props) {
  return (
    <div className="flex gap-2">
      <Select value={stage === undefined ? "all" : String(stage)} onValueChange={(v) => onStageChange(v === "all" ? undefined : Number(v))}>
        <SelectTrigger className="w-[130px] bg-white border-[#E5E7EB] text-xs">
          <SelectValue placeholder="Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          {[1, 2, 3, 4, 5].map((s) => (
            <SelectItem key={s} value={String(s)}>Stage {s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status === undefined ? "all" : status} onValueChange={(v) => onStatusChange(v === "all" ? undefined : v)}>
        <SelectTrigger className="w-[140px] bg-white border-[#E5E7EB] text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="STAGE_1_PENDING">Stage 1 Pending</SelectItem>
          <SelectItem value="STAGE_1_APPROVED">Stage 1 Approved</SelectItem>
          <SelectItem value="STAGE_2_PENDING">Stage 2 Pending</SelectItem>
          <SelectItem value="STAGE_2_APPROVED">Stage 2 Approved</SelectItem>
          <SelectItem value="STAGE_3_ACTIVE">Stage 3 Active</SelectItem>
          <SelectItem value="STAGE_4_PENDING">Stage 4 Pending</SelectItem>
          <SelectItem value="STAGE_4_APPROVED">Stage 4 Approved</SelectItem>
          <SelectItem value="STAGE_5_UNLOCKED">Stage 5 Unlocked</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="REJECTED">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
