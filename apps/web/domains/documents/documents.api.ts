import { client } from "@/shared/api/client";
import type {
  DocumentType,
  StudentDocument,
  UploadDocumentPayload,
  UploadResponse,
  PaginatedResponse,
  DocumentFilters,
} from "./documents.types";

const route = {
  myDocuments: "/student/documents" as const,
  documentTypes: "/student/documents/types" as const,
  upload: "/upload" as const,
  pendingDocuments: "/admin/documents/pending" as const,
  studentDocuments: (studentId: string) => `/admin/documents/student/${studentId}` as const,
  verifyDocument: (id: string) => `/admin/documents/${id}/verify` as const,
  reupload: (id: string) => `/admin/documents/${id}/reupload` as const,
  adminDocumentTypes: "/admin/documents/types" as const,
  adminDocumentType: (id: string) => `/admin/documents/types/${id}` as const,
} as const;

/* ---- Student Endpoints ---- */

export function getMyDocuments() {
  return client.get<StudentDocument[]>(route.myDocuments);
}

export function uploadMyDocument(data: UploadDocumentPayload) {
  return client.post<StudentDocument>(route.myDocuments, data);
}

export function getDocumentTypes() {
  return client.get<DocumentType[]>(route.documentTypes);
}

/* ---- File Upload ---- */

export function uploadFile(file: File, folder?: string) {
  const formData = new FormData();
  formData.append("file", file);
  const params = folder ? `?folder=${folder}` : '';
  return client.post<UploadResponse>(`${route.upload}${params}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteFile(key: string) {
  return client.delete(`${route.upload}?key=${encodeURIComponent(key)}`);
}

/* ---- Admin Endpoints ---- */

export function getPendingDocuments(filters: DocumentFilters = {}) {
  return client.get<PaginatedResponse<StudentDocument>>(route.pendingDocuments, {
    params: filters,
  });
}

export function getStudentDocuments(studentId: string) {
  return client.get<StudentDocument[]>(route.studentDocuments(studentId));
}

export function verifyDocument(id: string, data: { status: "APPROVED" | "REJECTED"; remarks?: string }) {
  return client.put<StudentDocument>(route.verifyDocument(id), data);
}

export function markForReupload(id: string, remarks: string) {
  return client.put<StudentDocument>(route.reupload(id), { remarks });
}

export function createDocumentType(data: { name: string; code: string; description?: string; requiredForStage: number }) {
  return client.post<DocumentType>(route.adminDocumentTypes, data);
}

export function updateDocumentType(id: string, data: Partial<DocumentType>) {
  return client.put<DocumentType>(route.adminDocumentType(id), data);
}

export function deleteDocumentType(id: string) {
  return client.delete<void>(route.adminDocumentType(id));
}
