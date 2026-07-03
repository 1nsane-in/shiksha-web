import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getConsultations, createConsultation, updateConsultationStatus, deleteConsultation } from "./consultations.api";
import type { CreateConsultationPayload } from "./consultations.types";

export function useConsultations() {
  return useQuery({
    queryKey: queryKeys.consultations.all,
    queryFn: () => getConsultations(),
  });
}

export function useCreateConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateConsultationPayload) => createConsultation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.all });
    },
  });
}

export function useUpdateConsultationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateConsultationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.all });
    },
  });
}

export function useDeleteConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteConsultation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.all });
    },
  });
}
