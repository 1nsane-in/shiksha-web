import { client } from "@/shared/api/client";
import type {
  DocumentType,
  StudentDocument,
  UploadDocumentPayload,
  UploadResponse,
  PaginatedResponse,
  DocumentFilters,
} from "./documents.types";

/* ---- Student Endpoints ---- */

export function getMyDocuments() {
  return client.get<StudentDocument[]>("/student/documents");
}

export function uploadMyDocument(data: UploadDocumentPayload) {
  return client.post<StudentDocument>("/student/documents", data);
}

export function getDocumentTypes() {
  return client.get<DocumentType[]>("/admin/documents/types");
}

/* ---- File Upload ---- */

export function uploadFile(file: File, folder?: string) {
  const formData = new FormData();
  formData.append("file", file);
  const params = folder ? `?folder=${folder}` : '';
  return client.post<UploadResponse>(`/upload${params}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteFile(key: string) {
  return client.delete(`/upload?key=${encodeURIComponent(key)}`);
}

/* ---- Admin Endpoints ---- */

export function getPendingDocuments(filters: DocumentFilters = {}) {
  return client.get<PaginatedResponse<StudentDocument>>("/admin/documents/pending", {
    params: filters,
  });
}

export function getStudentDocuments(studentId: string) {
  return client.get<StudentDocument[]>("/admin/documents/student/" + studentId);
}

export function verifyDocument(id: string, data: { status: "APPROVED" | "REJECTED"; remarks?: string }) {
  return client.put<StudentDocument>("/admin/documents/" + id + "/verify", data);
}

export function markForReupload(id: string, remarks: string) {
  return client.put<StudentDocument>("/admin/documents/" + id + "/reupload", { remarks });
}

export function createDocumentType(data: { name: string; code: string; description?: string; requiredForStage: number }) {
  return client.post<DocumentType>("/admin/documents/types", data);
}

export function updateDocumentType(id: string, data: Partial<DocumentType>) {
  return client.put<DocumentType>("/admin/documents/types/" + id, data);
}

export function deleteDocumentType(id: string) {
  return client.delete<void>("/admin/documents/types/" + id);
}
