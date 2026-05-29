import { client } from "@/shared/api/client";
import type { UniversityListItem, UniversityDetail, UniversityFilters, PaginatedResponse } from "./universities.types";

export function getUniversities(filters: UniversityFilters = {}) {
  return client.get<PaginatedResponse<UniversityListItem>>("/universities", {
    params: filters,
  });
}

export function getUniversity(identifier: string) {
  return client.get<UniversityDetail>(`/universities/${identifier}`);
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

export function updateUniversityStatus(id: string, status: string) {
  return client.patch(`/admin/universities/${id}/status`, { status });
}

