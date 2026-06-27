export interface CreateUniversityRequestPayload {
  universityName: string;
  country: string;
  state?: string;
  website?: string;
  type: string;
  programs: string[];
  otherPrograms?: string;
  contactEmail: string;
  contactPhone: string;
  additionalInfo?: string;
}

export interface UniversityRequest {
  id: string;
  universityName: string;
  country: string;
  state: string | null;
  website: string | null;
  type: string;
  programs: string[];
  otherPrograms: string | null;
  contactEmail: string;
  contactPhone: string;
  additionalInfo: string | null;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "ADDED";
  createdAt: string;
  updatedAt: string;
}

export interface UniversityRequestStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  added: number;
}
