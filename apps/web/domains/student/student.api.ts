import { client } from "@/shared/api/client";
import type {
  StudentProfile,
  StudentApplication,
  StageInfo,
  SubmitApplicationFormData,
  ApplicationCheckResult,
  ApplicationDetail,
} from "./student.types";

export function getStudentProfile() {
  return client.get<StudentProfile>("/student/profile");
}

export function getStageInfo() {
  return client.get<StageInfo>("/student/stage");
}

export function getMyApplications(page = 1, limit = 10) {
  return client.get<{
    data: StudentApplication[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>("/student/applications", { params: { page, limit } });
}

export function getMyApplicationById(id: string) {
  return client.get<ApplicationDetail>("/student/applications/" + id);
}

export function submitApplication(data: SubmitApplicationFormData) {
  return client.post<{ message: string; applicationId: string }>(
    "/student/apply",
    data,
  );
}

export function checkApplication(universityId: string) {
  return client.get<ApplicationCheckResult>(
    `/student/applications/check/${universityId}`,
  );
}

export function updateStudentProfile(data: Record<string, unknown>) {
  return client.put("/student/profile", data);
}

export function getDashboardOverview() {
  return client.get<import("./student.types").DashboardOverview>(
    "/student/dashboard/overview",
  );
}

export function getDashboardActivity() {
  return client.get<import("./student.types").DashboardActivity>(
    "/student/dashboard/activity",
  );
}

export function getDashboardNextSteps() {
  return client.get<import("./student.types").DashboardNextSteps>(
    "/student/dashboard/next-steps",
  );
}
