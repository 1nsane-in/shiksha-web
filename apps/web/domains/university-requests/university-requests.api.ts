import { client } from "@/shared/api/client";

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

export function createUniversityRequest(data: CreateUniversityRequestPayload) {
  return client.post<UniversityRequest>("/university-requests", data);
}

export function getUniversityRequests(status?: string) {
  const params = status ? { status } : {};
  return client.get<UniversityRequest[]>("/university-requests", { params });
}

export function getUniversityRequestStats() {
  return client.get<{
    total: number;
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
    added: number;
  }>("/university-requests/stats");
}
