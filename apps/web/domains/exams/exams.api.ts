import { client } from "@/shared/api/client";
import type { ExamDetail } from "./exams.types";

export function getMyExam() {
  return client.get<ExamDetail>("/exams/my");
}

export function getExamByApplication(applicationId: string) {
  return client.get<ExamDetail>("/exams/application/" + applicationId);
}