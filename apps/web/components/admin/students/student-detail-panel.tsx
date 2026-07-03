"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from "@repo/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { ArrowRight, MapPin, User } from "lucide-react";

interface Props {
  student: any;
  editStage: number | null;
  editStatus: string | null;
  isPending: boolean;
  onStageChange: (v: number) => void;
  onStatusChange: (v: string) => void;
  onSave: () => void;
}

export function StudentDetailPanel({ student, editStage, editStatus, isPending, onStageChange, onStatusChange, onSave }: Props) {
  if (!student) {
    return (
      <Card className="h-full flex items-center justify-center p-6 text-center text-gray-400 border-dashed border-2 border-[#ECEAE6] bg-[#FAFAF8]">
        <div>
          <User className="size-8 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-medium">Select student from list</p>
          <p className="text-xs text-gray-400">Click a student row to view details & manage stage progress</p>
        </div>
      </Card>
    );
  }

  return <StudentDetailCard student={student} editStage={editStage} editStatus={editStatus} isPending={isPending} onStageChange={onStageChange} onStatusChange={onStatusChange} onSave={onSave} />;
}

function StudentDetailCard({ student, editStage, editStatus, isPending, onStageChange, onStatusChange, onSave }: Props) {
  const router = useRouter();
  const stageOpts = [
    [1, "Stage 1: Application"],
    [2, "Stage 2: Admission Fee"],
    [3, "Stage 3: Entrance Exam"],
    [4, "Stage 4: Invitation Letter"],
    [5, "Stage 5: Visa Support"],
  ] as const;

  const statusOpts = [
    "NOT_STARTED", "STAGE_1_PENDING", "STAGE_1_APPROVED",
    "STAGE_2_PENDING", "STAGE_2_APPROVED", "STAGE_3_ACTIVE",
    "STAGE_4_PENDING", "STAGE_4_APPROVED", "STAGE_5_UNLOCKED",
    "COMPLETED", "REJECTED",
  ] as const;

  return (
    <Card className="sticky top-6 border-[#ECEAE6] bg-[#FAFAF8]">
      <CardHeader className="pb-3 border-b border-[#ECEAE6]">
        <CardTitle className="text-base font-semibold text-[#111]">Student Overview</CardTitle>
        <CardDescription className="text-xs">Quick progress controls & credentials.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-5">
        <div>
          <h3 className="font-bold text-sm text-[#111] mb-1">{student.user?.name}</h3>
          <p className="text-xs text-gray-400">Email: {student.user?.email}</p>
          <p className="text-xs text-gray-400">Phone: {student.user?.phone ?? "N/A"}</p>
        </div>

        <Button
          size="sm" variant="outline"
          onClick={() => router.push(`/admin/students/${student.id}`)}
          className="w-full border-[#3730A3] text-[#3730A3] hover:bg-[#EEF2FF] font-semibold flex items-center justify-center gap-1.5 cursor-pointer h-9 text-xs"
        >
          Full Profile & Documents <ArrowRight className="size-4" />
        </Button>

        <div className="bg-white border border-[#ECEAE6] rounded-xl p-3.5 space-y-2">
          <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Academics</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <KV label="NEET Score" value={student.neetScore ?? "N/A"} />
            <KV label="NEET Rank" value={student.neetRank ?? "N/A"} />
            <KV label="12th Grade %" value={student.twelfthPercentage ? `${student.twelfthPercentage}%` : "N/A"} />
            <KV label="10th Grade %" value={student.tenthPercentage ? `${student.tenthPercentage}%` : "N/A"} />
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Demographics</h4>
          <p className="text-gray-400 flex items-start gap-1">
            <MapPin className="size-3.5 shrink-0 mt-0.5" />
            <span>
              {student.address
                ? `${student.address}, ${student.city ?? ""}, ${student.state ?? ""}, ${student.country ?? ""}`
                : "No address specified"}
            </span>
          </p>
        </div>

        <div className="border-t border-[#ECEAE6] pt-4 space-y-3">
          <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Update Progression</h4>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Current Stage</label>
              <Select value={String(editStage ?? "")} onValueChange={(v) => onStageChange(Number(v))}>
                <SelectTrigger className="w-full text-xs bg-white border-[#E5E7EB]">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stageOpts.map(([v, l]) => (
                    <SelectItem key={v} value={String(v)}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Application Status</label>
              <Select value={editStatus ?? ""} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full text-xs bg-white border-[#E5E7EB]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOpts.map((s) => (
                    <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              size="sm"
              className="w-full bg-[#3730A3] hover:bg-[#2e288a] text-white font-medium text-xs h-9"
              disabled={isPending || (editStage === student.currentStage && editStatus === student.applicationStatus)}
              onClick={onSave}
            >
              {isPending ? "Updating..." : "Save Progression"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-400">{label}</p>
      <p className="font-bold text-sm text-[#111]">{value}</p>
    </div>
  );
}
