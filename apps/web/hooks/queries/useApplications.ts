import { api } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ApplicationListItem {
  id: string;
  studentName: string;
  universityName: string;
  stage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDetail extends ApplicationListItem {
  studentId: string;
  universityId: string;
  documents: {
    id: string;
    type: string;
    status: string;
    uploadedAt: string;
  }[];
  payments: {
    id: string;
    stage: string;
    amount: number;
    status: string;
  }[];
}

export interface ApplicationFilters {
  search?: string;
  status?: string;
  stage?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const applicationKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationKeys.all, "list"] as const,
  list: (filters: ApplicationFilters) =>
    [...applicationKeys.lists(), filters] as const,
  details: () => [...applicationKeys.all, "detail"] as const,
  detail: (id: string) => [...applicationKeys.details(), id] as const,
};

export function useApplications(filters: ApplicationFilters = {}) {
  return useQuery({
    queryKey: applicationKeys.list(filters),
    queryFn: () =>
      api.get<PaginatedResponse<ApplicationListItem>>("/admin/applications", {
        params: filters,
      }),
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: applicationKeys.detail(id),
    queryFn: () =>
      api.get<ApplicationDetail>(`/admin/applications/${id}`),
    enabled: !!id,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      stage,
      status,
    }: {
      id: string;
      stage: string;
      status: string;
    }) => api.patch(`/admin/applications/${id}/status`, { stage, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}
