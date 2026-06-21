import { client } from "@/shared/api/client";
import type { UniversityListItem, UniversityDetail, UniversityFilters, PaginatedResponse, UniversityCourse, UniversityDocument } from "./universities.types";

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

export function updateUniversityStatus(id: string, status: string) {
  return client.patch(`/admin/universities/${id}/status`, { status });
}

export function updateUniversity(id: string, data: Record<string, unknown>) {
  return client.patch(`/admin/universities/${id}`, data);
}

// Course CRUD
export function getUniversityCourses(universityId: string) {
  return client.get<UniversityCourse[]>(`/admin/universities/${universityId}/courses`);
}

export function createUniversityCourse(universityId: string, data: Record<string, unknown>) {
  return client.post(`/admin/universities/${universityId}/courses`, data);
}

export function updateUniversityCourse(universityId: string, courseId: string, data: Record<string, unknown>) {
  return client.patch(`/admin/universities/${universityId}/courses/${courseId}`, data);
}

export function deleteUniversityCourse(universityId: string, courseId: string) {
  return client.delete(`/admin/universities/${universityId}/courses/${courseId}`);
}

// Document CRUD
export function getUniversityDocuments(universityId: string) {
  return client.get<UniversityDocument[]>(`/admin/universities/${universityId}/documents`);
}

export function uploadUniversityDocument(universityId: string, data: FormData) {
  return client.post(`/admin/universities/${universityId}/documents`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteUniversityDocument(universityId: string, documentId: string) {
  return client.delete(`/admin/universities/${universityId}/documents/${documentId}`);
}

// Image upload
export function uploadUniversityImage(universityId: string, file: File, type: "logo" | "banner" | "gallery") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  return client.post(`/admin/universities/${universityId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteUniversityImage(universityId: string, imageUrl: string, type: "logo" | "banner" | "gallery") {
  return client.delete(`/admin/universities/${universityId}/images`, {
    data: { url: imageUrl, type },
  });
}

