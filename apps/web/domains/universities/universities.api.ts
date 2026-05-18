import { client } from "@/shared/api/client";
import type { UniversityListItem, UniversityDetail, UniversityFilters, PaginatedResponse } from "./universities.types";

export function getUniversities(filters: UniversityFilters) {
  return client.get<PaginatedResponse<UniversityListItem>>("/admin/universities", {
    params: filters,
  });
}

export function getUniversity(id: string) {
  return client.get<UniversityDetail>(`/admin/universities/${id}`);
}

export function createUniversity(data: Partial<UniversityDetail>) {
  return client.post<UniversityDetail>("/admin/universities", data);
}

export function updateUniversity(id: string, data: Partial<UniversityDetail>) {
  return client.put<UniversityDetail>(`/admin/universities/${id}`, data);
}

export function deleteUniversity(id: string) {
  return client.delete(`/admin/universities/${id}`);
}

export function updateUniversityStatus(id: string, status: string) {
  return client.patch(`/admin/universities/${id}/status`, { status });
}
