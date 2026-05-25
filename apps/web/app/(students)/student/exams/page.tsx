"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyExam } from "@/domains/exams";
import {
  GraduationCap, Calendar, MapPin, Hash,
  AlertCircle, RefreshCw, Inbox, PartyPopper, MessageSquare
} from "lucide-react";
import type { ExamDetail } from "@/domains/exams";

const resultStyles: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  AWAITED: "secondary",
  PASSED: "default",
  FAILED: "destructive",
};

function ExamCard({ exam }: { exam: ExamDetail }) {
  return (
    <Card size="xl" className="overflow-hidden">
      {exam.result === "PASSED" && (
        <div className="bg-green-50 px-6 py-3 flex items-center gap-2">
          <PartyPopper className="size-5 text-green-600" />
          <p className="text-sm font-medium text-green-700">
            Congratulations! You have passed the entrance exam.
          </p>
        </div>
      )}
      {exam.result === "FAILED" && (
        <div className="bg-red-50 px-6 py-3 flex items-center gap-2">
          <MessageSquare className="size-5 text-red-600" />
          <p className="text-sm font-medium text-red-700">
            Please contact support for re-examination options.
          </p>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Entrance Exam Details</CardTitle>
          <Badge variant={resultStyles[exam.result ?? "AWAITED"] ?? "secondary"} className="text-xs">
            {exam.result ?? "AWAITED"}
          </Badge>
        </div>
        <CardDescription>
          Attempt #{exam.attemptNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exam.examSubject && (
            <div className="flex items-start gap-3 bg-[#F8F6FC] rounded-lg p-3">
              <div className="size-8 rounded-lg bg-[#4B2D8E]/10 flex items-center justify-center shrink-0">
                <GraduationCap className="size-4 text-[#4B2D8E]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Subject</p>
                <p className="text-sm font-medium text-[#2D2154]">{exam.examSubject}</p>
              </div>
            </div>
          )}
          {exam.examDate && (
            <div className="flex items-start gap-3 bg-[#F8F6FC] rounded-lg p-3">
              <div className="size-8 rounded-lg bg-[#4B2D8E]/10 flex items-center justify-center shrink-0">
                <Calendar className="size-4 text-[#4B2D8E]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Scheduled Date</p>
                <p className="text-sm font-medium text-[#2D2154]">
                  {new Date(exam.examDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
          {exam.examCenter && (
            <div className="flex items-start gap-3 bg-[#F8F6FC] rounded-lg p-3">
              <div className="size-8 rounded-lg bg-[#4B2D8E]/10 flex items-center justify-center shrink-0">
                <MapPin className="size-4 text-[#4B2D8E]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Exam Center</p>
                <p className="text-sm font-medium text-[#2D2154]">{exam.examCenter}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3 bg-[#F8F6FC] rounded-lg p-3">
            <div className="size-8 rounded-lg bg-[#4B2D8E]/10 flex items-center justify-center shrink-0">
              <Hash className="size-4 text-[#4B2D8E]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Attempt</p>
              <p className="text-sm font-medium text-[#2D2154]">#{exam.attemptNumber}</p>
            </div>
          </div>
        </div>
        {exam.resultRemarks && (
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Remarks</p>
            <p className="text-sm text-[#2D2154]">{exam.resultRemarks}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ExamsPage() {
  const { data: exam, isLoading, isError, refetch } = useMyExam();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-60 mt-1" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">Failed to load exam details</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Something went wrong. Please try again.</p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Inbox className="size-16 text-[#4B2D8E]/30 mb-4" />
        <h2 className="text-xl font-bold text-[#2D2154]">No exam scheduled yet</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Your entrance exam details will appear here once scheduled. Complete your application and admission payment first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2D2154]">Entrance Exam</h1>
        <p className="text-sm text-gray-500 mt-1">View your exam schedule and results</p>
      </div>
      <ExamCard exam={exam} />
    </div>
  );
}
