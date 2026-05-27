import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type { ApplicationFilters } from "./applications.types";

export function useApplications(filters: ApplicationFilters = {}) {
  return useQuery({
    queryKey: queryKeys.applications.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const { getApplications } = await import("./applications.api");
      return getApplications(filters);
    },
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: queryKeys.applications.detail(id),
    queryFn: async () => {
      const { getApplication } = await import("./applications.api");
      return getApplication(id);
    },
    enabled: !!id,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { updateApplicationStatus } = await import("./applications.api");
      return updateApplicationStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}

