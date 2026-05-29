import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type { UniversityFilters } from "./universities.types";

export function useUniversities(filters: UniversityFilters = {}) {
  return useQuery({
    queryKey: queryKeys.universities.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const { getUniversities } = await import("./universities.api");
      return getUniversities(filters);
    },
  });
}

export function useUniversity(identifier: string) {
  return useQuery({
    queryKey: queryKeys.universities.detail(identifier),
    queryFn: async () => {
      const { getUniversity } = await import("./universities.api");
      return getUniversity(identifier);
    },
    enabled: !!identifier,
  });
}


export function useDeleteUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { deleteUniversity } = await import("./universities.api");
      return deleteUniversity(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.all });
    },
  });
}

export function useUpdateUniversityStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { updateUniversityStatus } = await import("./universities.api");
      return updateUniversityStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.all });
    },
  });
}
