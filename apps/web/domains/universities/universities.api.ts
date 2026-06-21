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
  return client.get<string[]>("/universities/countries");
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

export function addUniversityCourse(uniId: string, data: Record<string, unknown>) {
  return client.post(`/admin/universities/${uniId}/courses`, data);
}

export function updateUniversityCourse(courseId: string, data: Record<string, unknown>) {
  return client.put(`/admin/universities/courses/${courseId}`, data);
}

export function deleteUniversityCourse(courseId: string) {
  return client.delete(`/admin/universities/courses/${courseId}`);
}

export function uploadUniversityDocument(uniId: string, data: Record<string, unknown>) {
  return client.post(`/admin/universities/${uniId}/documents`, data);
}

export function deleteUniversityDocument(docId: string) {
  return client.delete(`/admin/universities/documents/${docId}`);
}

