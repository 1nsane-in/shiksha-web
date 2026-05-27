import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type { CreateVisaCenterPayload, CreateVisaChecklistPayload, CreateVisaApplicationPayload, DecideVisaPayload } from "./visa-support.types";

// ===== Visa Centers ===== //
export function useVisaCenters() {
  return useQuery({
    queryKey: queryKeys.visa.centers(),
    queryFn: async () => { const { getVisaCenters } = await import("./visa-support.api"); return getVisaCenters(); },
  });
}
export function useVisaCenter(id: string) {
  return useQuery({
    queryKey: queryKeys.visa.center(id),
    queryFn: async () => { const { getVisaCenter } = await import("./visa-support.api"); return getVisaCenter(id); },
    enabled: !!id,
  });
}
export function useCreateVisaCenter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateVisaCenterPayload) => { const { createVisaCenter } = await import("./visa-support.api"); return createVisaCenter(data); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.visa.all }); },
  });
}
export function useUpdateVisaCenter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<CreateVisaCenterPayload & { isActive: boolean }>) => {
      const { updateVisaCenter } = await import("./visa-support.api"); return updateVisaCenter(id, data);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.visa.all }); },
  });
}
export function useDeleteVisaCenter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { deleteVisaCenter } = await import("./visa-support.api"); return deleteVisaCenter(id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.visa.all }); },
  });
}

// ===== Visa Checklists ===== //
export function useVisaChecklists(country?: string) {
  return useQuery({
    queryKey: queryKeys.visa.checklists(country),
    queryFn: async () => { const { getVisaChecklists } = await import("./visa-support.api"); return getVisaChecklists(country); },
  });
}
export function useCreateVisaChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateVisaChecklistPayload) => { const { createVisaChecklist } = await import("./visa-support.api"); return createVisaChecklist(data); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.visa.all }); },
  });
}
export function useUpdateVisaChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<CreateVisaChecklistPayload & { isActive: boolean }>) => {
      const { updateVisaChecklist } = await import("./visa-support.api"); return updateVisaChecklist(id, data);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.visa.all }); },
  });
}
export function useDeleteVisaChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { deleteVisaChecklist } = await import("./visa-support.api"); return deleteVisaChecklist(id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.visa.all }); },
  });
}

// ===== Visa Applications ===== //
export function useMyVisaApplications() {
  return useQuery({
    queryKey: queryKeys.visa.my(),
    queryFn: async () => { const { getMyVisaApplications } = await import("./visa-support.api"); return getMyVisaApplications(); },
  });
}
export function useAllVisaApplications(status?: string) {
  return useQuery({
    queryKey: queryKeys.visa.allApplications(status),
    queryFn: async () => { const { getAllVisaApplications } = await import("./visa-support.api"); return getAllVisaApplications(status); },
  });
}
export function useVisaApplication(id: string) {
  return useQuery({
    queryKey: queryKeys.visa.application(id),
    queryFn: async () => { const { getVisaApplication } = await import("./visa-support.api"); return getVisaApplication(id); },
    enabled: !!id,
  });
}
export function useCreateVisaApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateVisaApplicationPayload) => { const { createVisaApplication } = await import("./visa-support.api"); return createVisaApplication(data); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.visa.all }); },
  });
}
export function useSubmitVisaApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { submitVisaApplication } = await import("./visa-support.api"); return submitVisaApplication(id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.visa.all }); },
  });
}
export function useDecideVisaApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & DecideVisaPayload) => {
      const { decideVisaApplication } = await import("./visa-support.api"); return decideVisaApplication(id, data);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.visa.all }); },
  });
}

// ===== Countries ===== //
export function useVisaCountries() {
  return useQuery({
    queryKey: queryKeys.visa.countries(),
    queryFn: async () => { const { getVisaCountries } = await import("./visa-support.api"); return getVisaCountries(); },
  });
}
