import { client } from "@/shared/api/client";
import type {
  AdminStudentListItem,
  AdminStudentFilters,
  AdminStudentStats,
  UpdateStudentStagePayload,
  AssignUniversityPayload,
} from "./students.types";

export function getAdminStudents(filters: AdminStudentFilters = {}) {
  return client.get<{
    data: AdminStudentListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>("/admin/students", { params: filters });
}

export function getAdminStudent(id: string) {
  return client.get<AdminStudentListItem>(`/admin/students/${id}`);
}

export function updateAdminStudent(id: string, data: Record<string, unknown>) {
  return client.put<AdminStudentListItem>(`/admin/students/${id}`, data);
}

export function updateStudentStage(id: string, payload: UpdateStudentStagePayload) {
  return client.put<AdminStudentListItem>(`/admin/students/${id}/stage`, payload);
}

export function assignUniversity(id: string, payload: AssignUniversityPayload) {
  return client.post<{ message: string; application: any }>(
    `/admin/students/${id}/assign-university`,
    payload
  );
}

export function getStudentStats() {
  return client.get<AdminStudentStats>("/admin/students/stats");
}
