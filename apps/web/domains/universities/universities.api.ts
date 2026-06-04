import { client } from "@/shared/api/client";
import type { UniversityListItem, UniversityDetail, UniversityFilters, PaginatedResponse } from "./universities.types";

export function getUniversities(filters: UniversityFilters = {}) {
  return client.get<PaginatedResponse<UniversityListItem>>("/universities", {
    params: filters,
  });
}

export function getAdminUniversities(filters: UniversityFilters = {}) {
  return client.get<PaginatedResponse<UniversityListItem>>("/admin/universities", {
    params: filters,
  });
}

export function getUniversity(identifier: string) {
  return client.get<UniversityDetail>(`/universities/${identifier}`);
}

export function getAdminUniversity(identifier: string) {
  return client.get<UniversityDetail>(`/admin/universities/${identifier}`);
}

export function getUniversityCountries() {
  return client.get<{ countries: string[] }>("/universities/countries");
}

export function deleteUniversity(id: string) {
  return client.delete(`/admin/universities/${id}`);
}

export function createUniversity(data: Record<string, unknown>) {
  return client.post("/admin/universities", data);
}

export function updateUniversity(id: string, data: Record<string, unknown>) {
  return client.put(`/admin/universities/${id}`, data);
}

export function updateUniversityStatus(id: string, status: string) {
  return client.patch(`/admin/universities/${id}/status`, { status });
}

