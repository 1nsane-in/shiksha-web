export interface DocumentType {
  id: string;
  name: string;
  code: string;
  description?: string;
  requiredForStage: number;
  isActive: boolean;
  ocrRequired: boolean;
  validationRules?: Record<string, unknown>;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  documentTypeId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType?: string;
  status: DocumentStatus;
  remarks?: string;
  version: number;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  documentType: DocumentType;
  student?: {
    user?: {
      name?: string;
      email?: string;
    };
  };
}

export type DocumentStatus =
  | "UPLOADED"
  | "IN_REVIEW"
  | "PROCESSING"
  | "APPROVED"
  | "REJECTED"
  | "REUPLOAD_REQUIRED";

export interface UploadDocumentPayload {
  documentTypeId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DocumentFilters {
  page?: number;
  limit?: number;
  status?: string;
  studentId?: string;
}
