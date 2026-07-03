import { client } from "@/shared/api/client";
import type { ApplicationListItem, ApplicationDetail, ApplicationFilters, PaginatedResponse } from "./applications.types";

const route = {
  list: "/admin/applications" as const,
  detail: (id: string) => `/admin/applications/${id}` as const,
  status: (id: string) => `/admin/applications/${id}/status` as const,
} as const;

export function getApplications(filters: ApplicationFilters) {
  return client.get<PaginatedResponse<ApplicationListItem>>(route.list, {
    params: filters,
  });
}

export function getApplication(id: string) {
  return client.get<ApplicationDetail>(route.detail(id));
}

export function updateApplicationStatus(id: string, status: string) {
  return client.patch<{ message: string }>(route.status(id), { status });
}

