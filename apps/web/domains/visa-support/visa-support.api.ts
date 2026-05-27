import { client } from "@/shared/api/client";
import type {
  VisaCenter, VisaChecklist, VisaApplication,
  CreateVisaCenterPayload, CreateVisaChecklistPayload,
  CreateVisaApplicationPayload, DecideVisaPayload,
} from "./visa-support.types";

// ===== Visa Centers ===== //
export function getVisaCenters() {
  return client.get<VisaCenter[]>("/visa-support/centers");
}
export function getVisaCenter(id: string) {
  return client.get<VisaCenter>("/visa-support/centers/" + id);
}
export function createVisaCenter(data: CreateVisaCenterPayload) {
  return client.post<VisaCenter>("/visa-support/centers", data);
}
export function updateVisaCenter(id: string, data: Partial<CreateVisaCenterPayload & { isActive: boolean }>) {
  return client.patch<VisaCenter>("/visa-support/centers/" + id, data);
}
export function deleteVisaCenter(id: string) {
  return client.delete<void>("/visa-support/centers/" + id);
}

// ===== Visa Checklists ===== //
export function getVisaChecklists(country?: string) {
  const params = country ? { country } : {};
  return client.get<VisaChecklist[]>("/visa-support/checklists", { params });
}
export function getVisaChecklist(id: string) {
  return client.get<VisaChecklist>("/visa-support/checklists/" + id);
}
export function createVisaChecklist(data: CreateVisaChecklistPayload) {
  return client.post<VisaChecklist>("/visa-support/checklists", data);
}
export function updateVisaChecklist(id: string, data: Partial<CreateVisaChecklistPayload & { isActive: boolean }>) {
  return client.patch<VisaChecklist>("/visa-support/checklists/" + id, data);
}
export function deleteVisaChecklist(id: string) {
  return client.delete<void>("/visa-support/checklists/" + id);
}

// ===== Visa Applications ===== //
export function getMyVisaApplications() {
  return client.get<VisaApplication[]>("/visa-support/applications/my");
}
export function getAllVisaApplications(status?: string) {
  const params = status ? { status } : {};
  return client.get<VisaApplication[]>("/visa-support/applications/admin/all", { params });
}
export function getVisaApplication(id: string) {
  return client.get<VisaApplication>("/visa-support/applications/" + id);
}
export function createVisaApplication(data: CreateVisaApplicationPayload) {
  return client.post<VisaApplication>("/visa-support/applications", data);
}
export function updateVisaApplication(id: string, data: Partial<CreateVisaApplicationPayload & { documentUrls: string[]; notes: string }>) {
  return client.patch<VisaApplication>("/visa-support/applications/" + id, data);
}
export function submitVisaApplication(id: string) {
  return client.post<VisaApplication>("/visa-support/applications/" + id + "/submit");
}
export function decideVisaApplication(id: string, data: DecideVisaPayload) {
  return client.post<VisaApplication>("/visa-support/applications/" + id + "/decide", data);
}

// ===== Lookups ===== //
export function getVisaCountries() {
  return client.get<string[]>("/visa-support/countries");
}
