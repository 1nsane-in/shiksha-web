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

export function useAdminUniversities(filters: UniversityFilters = {}) {
  return useQuery({
    queryKey: ["admin", ...queryKeys.universities.list(filters as Record<string, unknown>)],
    queryFn: async () => {
      const { getAdminUniversities } = await import("./universities.api");
      return getAdminUniversities(filters);
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

export function useAdminUniversity(identifier: string) {
  return useQuery({
    queryKey: ["admin", ...queryKeys.universities.detail(identifier)],
    queryFn: async () => {
      const { getAdminUniversity } = await import("./universities.api");
      return getAdminUniversity(identifier);
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
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useCreateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const { createUniversity } = await import("./universities.api");
      return createUniversity(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.all });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useUpdateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const { updateUniversity } = await import("./universities.api");
      return updateUniversity(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.all });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
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
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useAddUniversityCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uniId, data }: { uniId: string; data: Record<string, unknown> }) => {
      const { addUniversityCourse } = await import("./universities.api");
      return addUniversityCourse(uniId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.all });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useUpdateUniversityCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, data }: { courseId: string; data: Record<string, unknown> }) => {
      const { updateUniversityCourse } = await import("./universities.api");
      return updateUniversityCourse(courseId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.all });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useDeleteUniversityCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { deleteUniversityCourse } = await import("./universities.api");
      return deleteUniversityCourse(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.all });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useUploadUniversityDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uniId, data }: { uniId: string; data: Record<string, unknown> }) => {
      const { uploadUniversityDocument } = await import("./universities.api");
      return uploadUniversityDocument(uniId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.all });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useDeleteUniversityDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (docId: string) => {
      const { deleteUniversityDocument } = await import("./universities.api");
      return deleteUniversityDocument(docId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.all });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}
