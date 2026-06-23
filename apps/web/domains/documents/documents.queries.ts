import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type { DocumentFilters } from "./documents.types";

/* ───── Student Hooks ───── */

export function useMyDocuments() {
  return useQuery({
    queryKey: queryKeys.documents.my(),
    queryFn: async () => {
      const { getMyDocuments } = await import("./documents.api");
      return getMyDocuments();
    },
  });
}

export function useUploadMyDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { documentTypeId: string; fileUrl: string; fileName: string; fileSize: number }) => {
      const { uploadMyDocument } = await import("./documents.api");
      return uploadMyDocument(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: async (arg: File | { file: File; folder?: string }) => {
      const { uploadFile } = await import("./documents.api");
      if (arg instanceof File) {
        return uploadFile(arg);
      }
      return uploadFile(arg.file, arg.folder);
    },
  });
}

/* ───── Shared Hooks ───── */

export function useDocumentTypes() {
  return useQuery({
    queryKey: queryKeys.documents.types(),
    queryFn: async () => {
      const { getDocumentTypes } = await import("./documents.api");
      return getDocumentTypes();
    },
  });
}

/* ───── Admin Hooks ───── */

export function usePendingDocuments(filters: DocumentFilters = {}) {
  return useQuery({
    queryKey: queryKeys.documents.pending(filters),
    queryFn: async () => {
      const { getPendingDocuments } = await import("./documents.api");
      return getPendingDocuments(filters);
    },
  });
}

export function useVerifyDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, remarks }: { id: string; status: 'APPROVED' | 'REJECTED'; remarks?: string }) => {
      const { verifyDocument } = await import("./documents.api");
      return verifyDocument(id, { status, remarks });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}

export function useMarkForReupload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, remarks }: { id: string; remarks: string }) => {
      const { markForReupload } = await import("./documents.api");
      return markForReupload(id, remarks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}

export function useCreateDocumentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; code: string; description?: string; requiredForStage: number }) => {
      const { createDocumentType } = await import("./documents.api");
      return createDocumentType(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.types() });
    },
  });
}

export function useStudentDocuments(studentId: string) {
  return useQuery({
    queryKey: queryKeys.documents.student(studentId),
    queryFn: async () => {
      const { getStudentDocuments } = await import("./documents.api");
      return getStudentDocuments(studentId);
    },
    enabled: !!studentId,
  });
}
