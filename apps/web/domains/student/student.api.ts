import { client } from "@/shared/api/client";
import type {
  StudentProfile,
  StudentApplication,
  StageInfo,
  SubmitApplicationFormData,
  ApplicationCheckResult,
  ApplicationDetail,
  DashboardOverview,
  DashboardActivity,
  DashboardNextSteps,
  UpdateStudentProfileData,
} from "./student.types";

// ponytail: routes grouped here, one file. Extract to shared constants if a 2nd consumer appears.
const route = {
  profile: "/student/profile",
  stage: "/student/stage",
  applications: "/student/applications",
  applicationById: (id: string) => `/student/applications/${id}`,
  apply: "/student/apply",
  check: (universityId: string) =>
    `/student/applications/check/${universityId}`,
  dashboardOverview: "/student/dashboard/overview",
  dashboardActivity: "/student/dashboard/activity",
  dashboardNextSteps: "/student/dashboard/next-steps",
} as const;

export function getStudentProfile() {
  return client.get<StudentProfile>(route.profile);
}

export function getStageInfo() {
  return client.get<StageInfo>(route.stage);
}

export function getMyApplications(page = 1, limit = 10) {
  return client.get<{
    data: StudentApplication[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(route.applications, { params: { page, limit } });
}

export function getMyApplicationById(id: string) {
  return client.get<ApplicationDetail>(route.applicationById(id));
}

export function submitApplication(data: SubmitApplicationFormData) {
  return client.post<{ message: string; applicationId: string }>(
    route.apply,
    data,
  );
}

export function checkApplication(universityId: string) {
  return client.get<ApplicationCheckResult>(route.check(universityId));
}

export function updateStudentProfile(data: UpdateStudentProfileData) {
  return client.put(route.profile, data);
}

export function getDashboardOverview() {
  return client.get<DashboardOverview>(route.dashboardOverview);
}

export function getDashboardActivity() {
  return client.get<DashboardActivity>(route.dashboardActivity);
}

export function getDashboardNextSteps() {
  return client.get<DashboardNextSteps>(route.dashboardNextSteps);
}
