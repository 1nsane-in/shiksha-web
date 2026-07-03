import { client } from "@/shared/api/client";
import type {
  AdminStudentListItem,
  AdminStudentFilters,
  AdminStudentStats,
  UpdateStudentStagePayload,
  AssignUniversityPayload,
  UpdateAdminStudentPayload,
} from "./students.types";

const route = {
  list: "/admin/students" as const,
  detail: (id: string) => `/admin/students/${id}` as const,
  stage: (id: string) => `/admin/students/${id}/stage` as const,
  assignUniversity: (id: string) => `/admin/students/${id}/assign-university` as const,
  stats: "/admin/students/stats" as const,
} as const;

export function getAdminStudents(filters: AdminStudentFilters = {}) {
  return client.get<{
    data: AdminStudentListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(route.list, { params: filters });
}

export function getAdminStudent(id: string) {
  return client.get<AdminStudentListItem>(route.detail(id));
}

export function updateAdminStudent(id: string, data: UpdateAdminStudentPayload) {
  return client.put<AdminStudentListItem>(route.detail(id), data);
}

export function updateStudentStage(id: string, payload: UpdateStudentStagePayload) {
  return client.put<AdminStudentListItem>(route.stage(id), payload);
}

export function assignUniversity(id: string, payload: AssignUniversityPayload) {
  return client.post<{ message: string; application: unknown }>(
    route.assignUniversity(id),
    payload
  );
}

export function getStudentStats() {
  return client.get<AdminStudentStats>(route.stats);
}
