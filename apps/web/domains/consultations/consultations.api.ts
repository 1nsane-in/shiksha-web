import { client } from "@/shared/api/client";
import type { Consultation, CreateConsultationPayload } from "./consultations.types";

const route = {
  list: "/consultations" as const,
  status: (id: string) => `/consultations/${id}/status` as const,
  detail: (id: string) => `/consultations/${id}` as const,
} as const;

export function getConsultations() {
  return client.get<Consultation[]>(route.list);
}

export function createConsultation(data: CreateConsultationPayload) {
  return client.post<Consultation>(route.list, data);
}

export function updateConsultationStatus(id: string, status: string) {
  return client.put<Consultation>(route.status(id), { status });
}

export function deleteConsultation(id: string) {
  return client.delete<{ success: boolean }>(route.detail(id));
}
