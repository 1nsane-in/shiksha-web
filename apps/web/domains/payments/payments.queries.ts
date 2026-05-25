import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type { InitiatePaymentDto, VerifyPaymentDto } from "./payments.types";

export function useInitiatePayment() {
  return useMutation({
    mutationFn: async (dto: InitiatePaymentDto) => {
      const { initiatePayment } = await import("./payments.api");
      return initiatePayment(dto);
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: VerifyPaymentDto) => {
      const { verifyPayment } = await import("./payments.api");
      return verifyPayment(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.student.stage() });
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline.all });
    },
  });
}

export function usePaymentHistory(applicationId?: string) {
  return useQuery({
    queryKey: queryKeys.payments.history(applicationId),
    queryFn: async () => {
      const { getPaymentHistory } = await import("./payments.api");
      return getPaymentHistory(applicationId);
    },
  });
}

export function usePaymentConfig() {
  return useQuery({
    queryKey: queryKeys.payments.config(),
    queryFn: async () => {
      const { getPaymentConfig } = await import("./payments.api");
      return getPaymentConfig();
    },
    staleTime: 10 * 60 * 1000,
  });
}