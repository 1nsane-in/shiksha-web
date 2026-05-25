"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ClipboardList, Plus, CalendarIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  scheduleExam,
  declareExamResult,
  getAllExams,
} from "@/domains/admin/exams.api";
import type { ExamResponse } from "@/domains/admin/exams.types";

export default function AdminExamsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("schedule");

  /* ---- Schedule Exam Form ---- */
  const [applicationId, setApplicationId] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examSubject, setExamSubject] = useState("");
  const [examCenter, setExamCenter] = useState("");
  const scheduleMutation = useMutation({
    mutationFn: () =>
      scheduleExam({
        applicationId,
        examDate: new Date(examDate).toISOString(),
        examSubject,
        examCenter,
      }),
    onSuccess: () => {
      setApplicationId("");
      setExamDate("");
      setExamSubject("");
      setExamCenter("");
      queryClient.invalidateQueries({ queryKey: ["admin", "exams"] });
      alert("Exam scheduled successfully");
    },
    onError: (err: Error) => alert("Failed to schedule: " + err.message),
  });

  /* ---- Declare Result Form ---- */
  const [resultExamId, setResultExamId] = useState("");
  const [result, setResult] = useState<"PASSED" | "FAILED">("PASSED");
  const [resultRemarks, setResultRemarks] = useState("");
  const declareMutation = useMutation({
    mutationFn: () =>
      declareExamResult({ examId: resultExamId, result, remarks: resultRemarks }),
    onSuccess: () => {
      setResultExamId("");
      setResult("PASSED");
      setResultRemarks("");
      queryClient.invalidateQueries({ queryKey: ["admin", "exams"] });
      alert("Result declared successfully");
    },
    onError: (err: Error) => alert("Failed to declare: " + err.message),
  });

  /* ---- All Exams ---- */
  const { data: examsData, isLoading, error } = useQuery({
    queryKey: ["admin", "exams"],
    queryFn: () => getAllExams(),
  });

  const exams: ExamResponse[] = examsData?.data ?? [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="size-6 text-purple-600" /> Exam Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">Schedule exams and declare results for students</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="schedule">Schedule Exam</TabsTrigger>
          <TabsTrigger value="result">Declare Result</TabsTrigger>
          <TabsTrigger value="all">All Exams</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="size-5" /> Schedule New Exam
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicationId">Application ID</Label>
                  <Input
                    id="applicationId"
                    placeholder="Enter application ID"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="examDate">Exam Date</Label>
                  <div className="relative">
                    <Input
                      id="examDate"
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="pr-10"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examSubject">Exam Subject</Label>
                  <Input
                    id="examSubject"
                    placeholder="e.g., Physics, Biology"
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="examCenter">Exam Center</Label>
                  <Input
                    id="examCenter"
                    placeholder="e.g., New Delhi"
                    value={examCenter}
                    onChange={(e) => setExamCenter(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={() => scheduleMutation.mutate()}
                disabled={!applicationId || !examDate || !examSubject || !examCenter || scheduleMutation.isPending}
                className="w-full md:w-auto"
              >
                <Plus className="size-4 mr-1" />{" "}
                {scheduleMutation.isPending ? "Scheduling..." : "Schedule Exam"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="size-5" /> Declare Exam Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resultExamId">Exam ID</Label>
                <Input
                  id="resultExamId"
                  placeholder="Enter exam ID"
                  value={resultExamId}
                  onChange={(e) => setResultExamId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="result">Result</Label>
                <Select value={result} onValueChange={(v) => setResult(v as "PASSED" | "FAILED")}>
                  <SelectTrigger id="result">
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PASSED">PASSED</SelectItem>
                    <SelectItem value="FAILED">FAILED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resultRemarks">Remarks (optional)</Label>
                <Input
                  id="resultRemarks"
                  placeholder="Add remarks"
                  value={resultRemarks}
                  onChange={(e) => setResultRemarks(e.target.value)}
                />
              </div>
              <Button
                onClick={() => declareMutation.mutate()}
                disabled={!resultExamId || declareMutation.isPending}
                className="w-full md:w-auto"
              >
                {declareMutation.isPending ? "Declaring..." : "Declare Result"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="size-5" /> All Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading exams...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Failed to load exams.{" "}
                  <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["admin", "exams"] })}
                    className="text-purple-600 underline"
                  >
                    Retry
                  </button>
                </div>
              ) : !exams.length ? (
                <div className="text-center py-8 text-gray-500">No exams scheduled yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-gray-500">
                        <th className="pb-2 font-medium">Application</th>
                        <th className="pb-2 font-medium">Subject</th>
                        <th className="pb-2 font-medium">Center</th>
                        <th className="pb-2 font-medium">Date</th>
                        <th className="pb-2 font-medium">Result</th>
                        <th className="pb-2 font-medium">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map((exam: ExamResponse) => (
                        <tr key={exam.id} className="border-b last:border-0">
                          <td className="py-3">
                            {exam.student?.user?.name ?? exam.applicationId.slice(0, 8) + "..."}
                          </td>
                          <td className="py-3">
                            <Badge variant="secondary">{exam.examSubject}</Badge>
                          </td>
                          <td className="py-3">{exam.examCenter}</td>
                          <td className="py-3">
                            {new Date(exam.examDate).toLocaleDateString("en-IN")}
                          </td>
                          <td className="py-3">
                            {exam.result ? (
                              <Badge className={exam.result === "PASSED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                                {exam.result}
                              </Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </td>
                          <td className="py-3 text-gray-500">{exam.remarks || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}