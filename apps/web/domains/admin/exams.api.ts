import { client } from "@/shared/api/client";
import type { ScheduleExamPayload, DeclareResultPayload, ExamResponse } from "./exams.types";
import type { PaginatedResponse } from "../documents/documents.types";

const route = {
  schedule: "/exams/schedule" as const,
  declareResult: "/exams/declare-result" as const,
  all: "/exams/admin/all" as const,
} as const;

export function scheduleExam(data: ScheduleExamPayload) {
  return client.post<ExamResponse>(route.schedule, data);
}

export function declareExamResult(data: DeclareResultPayload) {
  return client.post<ExamResponse>(route.declareResult, data);
}

export function getAllExams(page = 1, limit = 20) {
  return client.get<PaginatedResponse<ExamResponse>>(route.all, {
    params: { page, limit },
  });
}
