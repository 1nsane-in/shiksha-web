"use client";

import { Card, CardContent, CardHeader, CardTitle, Button } from "@repo/ui";
import { Loader2 } from "lucide-react";

interface Props {
  stage: number | null;
  status: string | null;
  isPending: boolean;
  hasChanges: boolean;
  onStageChange: (v: number) => void;
  onStatusChange: (v: string) => void;
  onSave: () => void;
}

export function StudentStageWorkflow({ stage, status, isPending, hasChanges, onStageChange, onStatusChange, onSave }: Props) {
  return (
    <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#666]">Manage Workflow Stage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#666]">Select Stage</label>
          <select
            value={String(stage ?? "")}
            onChange={(e) => onStageChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3730A3]"
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <option key={s} value={s}>Stage {s}: {["Application Submission", "Admission Fee Payment", "Entrance Exam Process", "Invitation Letter Issue", "Visa Support & Processing"][s - 1]}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#666]">Select Status</label>
          <select
            value={status ?? ""}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3730A3]"
          >
            {["NOT_STARTED","STAGE_1_PENDING","STAGE_1_APPROVED","STAGE_2_PENDING","STAGE_2_APPROVED","STAGE_3_ACTIVE","STAGE_4_PENDING","STAGE_4_APPROVED","STAGE_5_UNLOCKED","COMPLETED","REJECTED"].map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        <Button
          type="button"
          onClick={onSave}
          disabled={isPending || !hasChanges}
          className="w-full bg-[#3730A3] hover:bg-[#2e288a] text-white font-medium text-xs h-10 mt-2"
        >
          {isPending ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Updating...</> : "Save Progression"}
        </Button>
      </CardContent>
    </Card>
  );
}
