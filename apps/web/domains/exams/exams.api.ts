import { client } from "@/shared/api/client";
import type { ExamDetail } from "./exams.types";

const route = {
  my: "/exams/my" as const,
  byApplication: (applicationId: string) => `/exams/application/${applicationId}` as const,
} as const;

export function getMyExam() {
  return client.get<ExamDetail>(route.my);
}

export function getExamByApplication(applicationId: string) {
  return client.get<ExamDetail>(route.byApplication(applicationId));
}
