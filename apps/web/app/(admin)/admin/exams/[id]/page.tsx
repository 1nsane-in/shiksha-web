"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import {
  ChevronLeft,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Archive,
  Loader2,
} from "lucide-react";
import { useExam, usePublishExam } from "@/domains/exams/exams.queries";
import { ExamStatus, QuestionType } from "@/domains/exams/exams.types";
import { toast } from "sonner";

const STATUS_BADGES: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  [ExamStatus.DRAFT]:     { label: "Draft",     color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: <Circle className="h-3 w-3" /> },
  [ExamStatus.SCHEDULED]: { label: "Scheduled", color: "text-blue-700",  bg: "bg-blue-50",  border: "border-blue-200",  icon: <Calendar className="h-3 w-3" /> },
  [ExamStatus.ACTIVE]:    { label: "Active",    color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: <CheckCircle2 className="h-3 w-3" /> },
  [ExamStatus.COMPLETED]: { label: "Completed", color: "text-gray-700",  bg: "bg-gray-50",   border: "border-gray-200",   icon: <CheckCircle2 className="h-3 w-3" /> },
  [ExamStatus.ARCHIVED]:  { label: "Archived",  color: "text-slate-700", bg: "bg-slate-50",  border: "border-slate-200",  icon: <Archive className="h-3 w-3" /> },
};

const QUESTION_TYPE_ICONS: Record<string, React.ReactNode> = {
  [QuestionType.SINGLE_CHOICE]: <div className="h-4 w-4 rounded-full border-2 border-current" />,
};

const QUESTION_TYPE_LABELS: Record<string, string> = {
  [QuestionType.SINGLE_CHOICE]: "MCQ",
};

export default function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: exam, isLoading, error } = useExam(id);
  const publishExam = usePublishExam(id);

  const handlePublish = async () => {
    try {
      await publishExam.mutateAsync();
      toast.success("Exam published");
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#9c9fa5]" />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <p className="text-lg font-medium text-[#111111]">Exam not found</p>
        <Button variant="outline" onClick={() => router.push("/admin/exams")}>Back to Exams</Button>
      </div>
    );
  }

  const badge = STATUS_BADGES[exam.status] || STATUS_BADGES[ExamStatus.DRAFT];

  return (
    <div className="flex flex-col min-h-screen max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={() => router.push("/admin/exams")} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#d3cec6] text-[#626260] hover:bg-[#f5f1ec] hover:text-[#111111] transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-[#111111] truncate">{exam.name}</h1>
              <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[13px] font-medium ${badge.bg} ${badge.color} ${badge.border}`}>
                {badge.icon}
                {badge.label}
              </span>
            </div>
            {exam.university && (
              <p className="text-sm text-[#626260] mt-0.5">{exam.university.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {exam.status === ExamStatus.DRAFT && (
            <Button onClick={handlePublish} disabled={publishExam.isPending} className="bg-[#111111] hover:bg-[#313130] text-white">
              {publishExam.isPending ? "Publishing..." : "Publish"}
            </Button>
          )}
          <Button variant="outline" className="border-[#d3cec6] text-[#626260]" onClick={() => router.push(`/admin/exams/${id}/edit`)}>Edit</Button>
        </div>
      </div>

      <div className="pb-8 space-y-6">
        {/* Info card */}
        <div className="rounded-lg border border-[#d3cec6] bg-white overflow-hidden">
          {/* Stats bar */}
          <div className="grid grid-cols-4">
            <div className="px-5 py-4 text-center border-r border-[#ebe7e1] last:border-r-0">
              <p className="text-2xl font-bold text-[#111111] tracking-tight">{exam._count?.questions ?? exam.questions?.length ?? 0}</p>
              <p className="text-[13px] text-[#9c9fa5] mt-0.5">Questions</p>
            </div>
            <div className="px-5 py-4 text-center border-r border-[#ebe7e1] last:border-r-0">
              <p className="text-2xl font-bold text-[#111111] tracking-tight">{exam.totalMarks}</p>
              <p className="text-[13px] text-[#9c9fa5] mt-0.5">Total Marks</p>
            </div>
            <div className="px-5 py-4 text-center border-r border-[#ebe7e1] last:border-r-0">
              <p className="text-2xl font-bold text-[#111111] tracking-tight">{exam.durationMinutes}</p>
              <p className="text-[13px] text-[#9c9fa5] mt-0.5">Duration (min)</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-2xl font-bold text-[#111111] tracking-tight">{exam.passingPercentage}%</p>
              <p className="text-[13px] text-[#9c9fa5] mt-0.5">Passing</p>
            </div>
          </div>

          <div className="divide-y divide-[#ebe7e1]">
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                <div>
                  <p className="text-[13px] font-medium text-[#9c9fa5] tracking-wide">Exam Name</p>
                  <p className="text-[15px] font-medium text-[#111111] mt-1">{exam.name}</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#9c9fa5] tracking-wide">University</p>
                  <p className="text-[15px] font-medium text-[#111111] mt-1">{exam.university?.name ?? "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[13px] font-medium text-[#9c9fa5] tracking-wide">Date Window</p>
                  <p className="text-[15px] font-medium text-[#111111] mt-1">
                    {new Date(exam.dateWindowStart).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} – {new Date(exam.dateWindowEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-[#9c9fa5] tracking-widest uppercase mb-4">Configuration</p>
              <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[13px] font-medium text-[#9c9fa5] tracking-wide">Max Attempts</p>
                  <p className="text-sm font-medium text-[#111111] mt-1">{exam.maxAttempts}</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#9c9fa5] tracking-wide">Result Timing</p>
                  <p className="text-sm font-medium text-[#111111] mt-1">{exam.resultTiming}</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#9c9fa5] tracking-wide">Shuffle Questions</p>
                  <span className={`inline-flex items-center mt-1.5 rounded px-2 py-0.5 text-xs font-semibold ${
                    exam.shuffleQuestions ? "bg-emerald-50 text-emerald-700" : "bg-[#f5f1ec] text-[#9c9fa5]"
                  }`}>{exam.shuffleQuestions ? "On" : "Off"}</span>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#9c9fa5] tracking-wide">Shuffle Options</p>
                  <span className={`inline-flex items-center mt-1.5 rounded px-2 py-0.5 text-xs font-semibold ${
                    exam.shuffleOptions ? "bg-emerald-50 text-emerald-700" : "bg-[#f5f1ec] text-[#9c9fa5]"
                  }`}>{exam.shuffleOptions ? "On" : "Off"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="rounded-lg border border-[#d3cec6] bg-white overflow-hidden">
          <div className="px-6 pt-5 pb-3 border-b border-[#ebe7e1]">
            <h3 className="text-sm font-semibold text-[#111111]">Questions <span className="text-[#9c9fa5] font-normal">{exam.questions?.length ?? 0}</span></h3>
          </div>

          <div className="p-6">
            {exam.questions && exam.questions.length > 0 ? (
              <div className="space-y-4">
                {exam.questions.map((q, i) => (
                  <div key={q.id ?? i} className="rounded-lg border border-[#ebe7e1] bg-[#faf9f7] px-4 py-3.5">
                    <div className="flex items-start justify-between gap-4 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white border border-[#d3cec6] text-xs font-semibold text-[#626260]">{i + 1}</span>
                        <span className="text-[15px] font-medium text-[#111111] leading-snug">{q.questionText}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1 rounded-md bg-white border border-[#d3cec6] px-2 py-0.5 text-xs font-medium text-[#626260]">
                          {QUESTION_TYPE_ICONS[q.type]}
                          {QUESTION_TYPE_LABELS[q.type]}
                        </span>
                        <span className="text-xs font-medium text-[#626260] whitespace-nowrap">{q.marks} mark{q.marks !== 1 ? "s" : ""}</span>
                        {q.difficulty && (
                          <span className="text-xs text-[#9c9fa5] capitalize">{q.difficulty.toLowerCase()}</span>
                        )}
                      </div>
                    </div>

                    {q.questionImageUrl && (
                      <img src={q.questionImageUrl} alt="" className="mb-2.5 rounded-md border border-[#ebe7e1] max-h-32 object-contain bg-[#f5f1ec]" />
                    )}

                    {q.options && q.options.length > 0 && (
                      <div className="space-y-1.5 ml-9">
                        {q.options.map((opt, oi) => {
                          const letter = String.fromCharCode(65 + oi);
                          return (
                            <div key={opt.id ?? oi} className="flex items-center gap-2.5">
                              {opt.isCorrect ? (
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                </span>
                              ) : (
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-[#d3cec6]" />
                              )}
                              <span className={`text-sm ${opt.isCorrect ? "font-medium text-emerald-700" : "text-[#626260]"}`}>
                                {letter}. {opt.optionText}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.config?.wordLimit && (
                      <p className="mt-1.5 ml-9 text-xs text-[#9c9fa5]">Word limit: {q.config.wordLimit}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#626260]">No questions added to this exam</p>
            )}
          </div>
        </div>

        {/* Registrations */}
        <div className="rounded-lg border border-[#d3cec6] bg-white overflow-hidden">
          <div className="px-6 pt-5 pb-3 border-b border-[#ebe7e1]">
            <h3 className="text-sm font-semibold text-[#111111]">Registrations</h3>
          </div>
          <div className="p-6">
            {exam._count ? (
              <p className="text-sm text-[#626260]">
                <span className="text-[15px] font-semibold text-[#111111]">{exam._count.registrations}</span> student{exam._count.registrations !== 1 ? "s" : ""} registered
              </p>
            ) : (
              <p className="text-sm text-[#626260]">No registrations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




