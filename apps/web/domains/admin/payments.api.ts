import { client } from "@/shared/api/client";
import type { PaymentResponse, ManualApprovePayload } from "./payments.types";
import type { PaginatedResponse } from "../documents/documents.types";

export function getPendingPayments(page = 1, limit = 20) {
  return client.get<PaginatedResponse<PaymentResponse>>("/payments/admin/pending", {
    params: { page, limit },
  });
}

export function manualApprovePayment(data: ManualApprovePayload) {
  return client.post<PaymentResponse>("/payments/manual-approve", data);
}
