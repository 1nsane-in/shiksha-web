export interface AdmissionLetter {
  id: string;
  applicationId: string;
  studentId: string;
  fileUrl: string;
  fileName?: string;
  uploadedBy: string;
  uploadedAt: string;
  viewCount: number;
  downloadCount: number;
}

export interface InvitationLetter {
  id: string;
  applicationId: string;
  studentId: string;
  fileUrl: string;
  fileName?: string;
  uploadedBy: string;
  uploadedAt: string;
  viewCount: number;
  downloadCount: number;
  isDownloadable: boolean;
  lastViewedAt?: string;
  lastDownloadedAt?: string;
}