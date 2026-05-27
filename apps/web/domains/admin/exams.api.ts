import { client } from "@/shared/api/client";
import type { ScheduleExamPayload, DeclareResultPayload, ExamResponse } from "./exams.types";
import type { PaginatedResponse } from "../documents/documents.types";

export function scheduleExam(data: ScheduleExamPayload) {
  return client.post<ExamResponse>("/exams/schedule", data);
}

export function declareExamResult(data: DeclareResultPayload) {
  return client.post<ExamResponse>("/exams/declare-result", data);
}

export function getAllExams(page = 1, limit = 20) {
  return client.get<PaginatedResponse<ExamResponse>>("/exams/admin/all", {
    params: { page, limit },
  });
}
