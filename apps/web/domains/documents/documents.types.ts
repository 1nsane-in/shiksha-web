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
  /** Bucket key returned by the upload endpoint. */
  fileKey: string;
  fileName: string;
  fileSize: number;
}

export interface UploadResponse {
  /** Public URL or short-lived signed URL (private folders). */
  url: string;
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  expiresIn?: number;
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
