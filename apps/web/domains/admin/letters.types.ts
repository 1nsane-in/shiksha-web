export interface UploadLetterPayload {
  applicationId: string;
  fileUrl: string;
  fileName?: string;
}

export interface UpdateLetterPayload {
  fileUrl?: string;
  fileName?: string;
  isDownloadable?: boolean;
}

export interface LetterResponse {
  id: string;
  applicationId: string;
  studentId: string;
  fileUrl: string;
  fileName?: string;
  uploadedBy: string;
  uploadedAt: string;
  viewCount: number;
  downloadCount: number;
  isDownloadable?: boolean;
  student?: {
    id: string;
    user: { name: string; email: string };
  };
}
