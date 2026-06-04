import { client } from "@/shared/api/client";
import type { Consultation, CreateConsultationPayload } from "./consultations.types";

export function getConsultations() {
  return client.get<Consultation[]>("/consultations");
}

export function createConsultation(data: CreateConsultationPayload) {
  return client.post<Consultation>("/consultations", data);
}

export function updateConsultationStatus(id: string, status: string) {
  return client.put<Consultation>(`/consultations/${id}/status`, { status });
}

export function deleteConsultation(id: string) {
  return client.delete<{ success: boolean }>(`/consultations/${id}`);
}
