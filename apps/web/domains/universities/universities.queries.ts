import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type { UniversityFilters, UniversityDetail } from "./universities.types";

export function useUniversities(filters: UniversityFilters = {}) {
  return useQuery({
    queryKey: queryKeys.universities.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const { getUniversities } = await import("./universities.api");
      return getUniversities(filters);
    },
  });
}

export function useUniversity(id: string) {
  return useQuery({
    queryKey: queryKeys.universities.detail(id),
    queryFn: async () => {
      const { getUniversity } = await import("./universities.api");
      return getUniversity(id);
    },
    enabled: !!id,
  });
}

export function useCreateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<UniversityDetail>) => {
      const { createUniversity } = await import("./universities.api");
      return createUniversity(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.lists() });
    },
  });
}

export function useUpdateUniversity(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<UniversityDetail>) => {
      const { updateUniversity } = await import("./universities.api");
      return updateUniversity(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.lists() });
    },
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
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.lists() });
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
