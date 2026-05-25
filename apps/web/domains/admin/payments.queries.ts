import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";

export function usePendingPayments(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...queryKeys.payments.all, "pending", { page, limit }] as const,
    queryFn: async () => {
      const { getPendingPayments } = await import("./payments.api");
      return getPendingPayments(page, limit);
    },
  });
}

export function useManualApprovePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { paymentId: string; note?: string }) => {
      const { manualApprovePayment } = await import("./payments.api");
      return manualApprovePayment(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
}