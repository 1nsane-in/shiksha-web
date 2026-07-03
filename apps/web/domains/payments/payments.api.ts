import { client } from "@/shared/api/client";
import type { InitiatePaymentDto, PayUHashResponse, VerifyPaymentDto, PaymentHistoryItem, PaymentConfig } from "./payments.types";

const route = {
  initiate: "/payments/initiate" as const,
  verify: "/payments/verify" as const,
  history: "/payments/history" as const,
  config: "/payments/config" as const,
} as const;

export function initiatePayment(dto: InitiatePaymentDto) {
  return client.post<PayUHashResponse>(route.initiate, dto);
}

export function verifyPayment(dto: VerifyPaymentDto) {
  return client.post<{ success: boolean; payment: PaymentHistoryItem }>(route.verify, dto);
}

export function getPaymentHistory(applicationId?: string) {
  const params = applicationId ? { applicationId } : {};
  return client.get<PaymentHistoryItem[]>(route.history, { params });
}

export function getPaymentConfig() {
  return client.get<PaymentConfig[]>(route.config);
}
