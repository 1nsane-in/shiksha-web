import { client } from "@/shared/api/client";
import type { ApplicationListItem, ApplicationDetail, ApplicationFilters, PaginatedResponse } from "./applications.types";

export function getApplications(filters: ApplicationFilters) {
  return client.get<PaginatedResponse<ApplicationListItem>>("/admin/applications", {
    params: filters,
  });
}

export function getApplication(id: string) {
  return client.get<ApplicationDetail>(`/admin/applications/${id}`);
}

export function updateApplicationStatus(id: string, status: string) {
  return client.patch<{ message: string }>(`/admin/applications/${id}/status`, { status });
}

