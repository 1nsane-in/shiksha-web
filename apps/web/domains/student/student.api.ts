import { client } from "@/shared/api/client";
import type { StudentProfile, StudentApplication, StageInfo, SubmitApplicationFormData } from "./student.types";

export function getStudentProfile() {
  return client.get<StudentProfile>("/student/profile");
}

export function getStageInfo() {
  return client.get<StageInfo>("/student/stage");
}

export function getMyApplications(page = 1, limit = 10) {
  return client.get<{ data: StudentApplication[]; total: number; page: number; limit: number; totalPages: number }>(
    "/student/applications", { params: { page, limit } }
  );
}

export function getMyApplicationById(id: string) {
  return client.get<StudentApplication & { university: any }>("/student/applications/" + id);
}

export function submitApplication(data: SubmitApplicationFormData) {
  return client.post<{ message: string; applicationId: string }>("/student/apply", data);
}