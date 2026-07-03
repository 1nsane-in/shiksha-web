import { client } from "@/shared/api/client";
import type {
  VisaCenter, VisaChecklist, VisaApplication,
  CreateVisaCenterPayload, CreateVisaChecklistPayload,
  CreateVisaApplicationPayload, DecideVisaPayload,
} from "./visa-support.types";

const route = {
  centers: "/visa-support/centers" as const,
  center: (id: string) => `/visa-support/centers/${id}` as const,
  checklists: "/visa-support/checklists" as const,
  checklist: (id: string) => `/visa-support/checklists/${id}` as const,
  myApplications: "/visa-support/applications/my" as const,
  adminAll: "/visa-support/applications/admin/all" as const,
  applicationsBase: "/visa-support/applications" as const,
  application: (id: string) => `/visa-support/applications/${id}` as const,
  submit: (id: string) => `/visa-support/applications/${id}/submit` as const,
  decide: (id: string) => `/visa-support/applications/${id}/decide` as const,
  countries: "/visa-support/countries" as const,
} as const;

// ===== Visa Centers ===== //
export function getVisaCenters() {
  return client.get<VisaCenter[]>(route.centers);
}
export function getVisaCenter(id: string) {
  return client.get<VisaCenter>(route.center(id));
}
export function createVisaCenter(data: CreateVisaCenterPayload) {
  return client.post<VisaCenter>(route.centers, data);
}
export function updateVisaCenter(id: string, data: Partial<CreateVisaCenterPayload & { isActive: boolean }>) {
  return client.patch<VisaCenter>(route.center(id), data);
}
export function deleteVisaCenter(id: string) {
  return client.delete<void>(route.center(id));
}

// ===== Visa Checklists ===== //
export function getVisaChecklists(country?: string) {
  const params = country ? { country } : {};
  return client.get<VisaChecklist[]>(route.checklists, { params });
}
export function getVisaChecklist(id: string) {
  return client.get<VisaChecklist>(route.checklist(id));
}
export function createVisaChecklist(data: CreateVisaChecklistPayload) {
  return client.post<VisaChecklist>(route.checklists, data);
}
export function updateVisaChecklist(id: string, data: Partial<CreateVisaChecklistPayload & { isActive: boolean }>) {
  return client.patch<VisaChecklist>(route.checklist(id), data);
}
export function deleteVisaChecklist(id: string) {
  return client.delete<void>(route.checklist(id));
}

// ===== Visa Applications ===== //
export function getMyVisaApplications() {
  return client.get<VisaApplication[]>(route.myApplications);
}
export function getAllVisaApplications(status?: string) {
  const params = status ? { status } : {};
  return client.get<VisaApplication[]>(route.adminAll, { params });
}
export function getVisaApplication(id: string) {
  return client.get<VisaApplication>(route.application(id));
}
export function createVisaApplication(data: CreateVisaApplicationPayload) {
  return client.post<VisaApplication>(route.applicationsBase, data);
}
export function updateVisaApplication(id: string, data: Partial<CreateVisaApplicationPayload & { documentUrls: string[]; notes: string }>) {
  return client.patch<VisaApplication>(route.application(id), data);
}
export function submitVisaApplication(id: string) {
  return client.post<VisaApplication>(route.submit(id));
}
export function decideVisaApplication(id: string, data: DecideVisaPayload) {
  return client.post<VisaApplication>(route.decide(id), data);
}

// ===== Lookups ===== //
export function getVisaCountries() {
  return client.get<string[]>(route.countries);
}
