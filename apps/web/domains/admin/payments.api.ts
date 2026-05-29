import { client } from "@/shared/api/client";
import type { PaymentResponse, ManualApprovePayload } from "./payments.types";

export function getPendingPayments(page = 1, limit = 20) {
  return client
    .get<{
      items: PaymentResponse[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("/payments/admin/pending", {
      params: { page, limit },
    })
    .then((res) => ({
      data: res.items,
      total: res.total,
      page: res.page,
      limit: res.limit,
      totalPages: res.totalPages,
    }));
}

export function manualApprovePayment(data: ManualApprovePayload) {
  return client.post<PaymentResponse>("/payments/manual-approve", data);
}
