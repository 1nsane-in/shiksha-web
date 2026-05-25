import { client } from "@/shared/api/client";
import type { InitiatePaymentDto, PayUHashResponse, VerifyPaymentDto, PaymentHistoryItem, PaymentConfig } from "./payments.types";

export function initiatePayment(dto: InitiatePaymentDto) {
  return client.post<PayUHashResponse>("/payments/initiate", dto);
}

export function verifyPayment(dto: VerifyPaymentDto) {
  return client.post<{ success: boolean; payment: PaymentHistoryItem }>("/payments/verify", dto);
}

export function getPaymentHistory(applicationId?: string) {
  const params = applicationId ? { applicationId } : {};
  return client.get<PaymentHistoryItem[]>("/payments/history", { params });
}

export function getPaymentConfig() {
  return client.get<PaymentConfig[]>("/payments/config");
}