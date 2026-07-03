import { client } from "@/shared/api/client";
import type {
  UniversityListItem,
  UniversityDetail,
  UniversityFilters,
  PaginatedResponse,
  CreateUniversityPayload,
  UpdateUniversityPayload,
  AddCoursePayload,
  UpdateCoursePayload,
  UploadDocumentPayload,
} from "./universities.types";

const route = {
  list: "/universities",
  adminList: "/admin/universities",
  detail: (id: string) => `/universities/${id}`,
  adminDetail: (id: string) => `/admin/universities/${id}`,
  countries: "/universities/countries",
  adminCreate: "/admin/universities",
  adminUpdate: (id: string) => `/admin/universities/${id}`,
  adminDelete: (id: string) => `/admin/universities/${id}`,
  adminStatus: (id: string) => `/admin/universities/${id}/status`,
  courses: (uniId: string) => `/admin/universities/${uniId}/courses`,
  courseById: (courseId: string) => `/admin/universities/courses/${courseId}`,
  documents: (uniId: string) => `/admin/universities/${uniId}/documents`,
  documentById: (docId: string) => `/admin/universities/documents/${docId}`,
} as const;

export function getUniversities(filters: UniversityFilters = {}) {
  return client.get<PaginatedResponse<UniversityListItem>>(route.list, {
    params: filters,
  });
}

export function getAdminUniversities(filters: UniversityFilters = {}) {
  return client.get<PaginatedResponse<UniversityListItem>>(route.adminList, {
    params: filters,
  });
}

export function getUniversity(identifier: string) {
  return client.get<UniversityDetail>(route.detail(identifier));
}

export function getAdminUniversity(identifier: string) {
  return client.get<UniversityDetail>(route.adminDetail(identifier));
}

export function getUniversityCountries() {
  return client.get<string[]>(route.countries);
}

export function createUniversity(data: CreateUniversityPayload) {
  return client.post(route.adminCreate, data);
}

export function updateUniversity(id: string, data: UpdateUniversityPayload) {
  return client.put(route.adminUpdate(id), data);
}

export function updateUniversityStatus(id: string, status: string) {
  return client.patch(route.adminStatus(id), { status });
}

export function deleteUniversity(id: string) {
  return client.delete(route.adminDelete(id));
}

export function addUniversityCourse(uniId: string, data: AddCoursePayload) {
  return client.post(route.courses(uniId), data);
}

export function updateUniversityCourse(courseId: string, data: UpdateCoursePayload) {
  return client.put(route.courseById(courseId), data);
}

export function deleteUniversityCourse(courseId: string) {
  return client.delete(route.courseById(courseId));
}

export function uploadUniversityDocument(uniId: string, data: UploadDocumentPayload) {
  return client.post(route.documents(uniId), data);
}

export function deleteUniversityDocument(docId: string) {
  return client.delete(route.documentById(docId));
}

