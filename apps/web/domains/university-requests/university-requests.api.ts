import { client } from "@/shared/api/client";
import type { CreateUniversityRequestPayload, UniversityRequest, UniversityRequestStats } from "./university-requests.types";

const route = {
  base: "/university-requests" as const,
  stats: "/university-requests/stats" as const,
} as const;

export function createUniversityRequest(data: CreateUniversityRequestPayload) {
  return client.post<UniversityRequest>(route.base, data);
}

export function getUniversityRequests(status?: string) {
  const params = status ? { status } : {};
  return client.get<UniversityRequest[]>(route.base, { params });
}

export function getUniversityRequestStats() {
  return client.get<UniversityRequestStats>(route.stats);
}
