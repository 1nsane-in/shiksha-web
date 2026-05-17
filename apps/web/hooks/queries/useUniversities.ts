import { api } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface UniversityListItem {
  id: string;
  name: string;
  shortName: string;
  country: string;
  city: string;
  type: string;
  status: string;
  establishedYear: number;
  createdAt: string;
}

export interface UniversityDetail {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  type: string;
  status: string;
  establishedYear: number;
  website: string;
  image: string;
  country: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    admissionOfficeHours: string;
  };
  recognition: {
    ecfmgStatus: string;
    naacGrade?: string;
    worldRank?: number;
  };
  academic: {
    programs: string[];
    duration: string;
    medium: string;
    totalSeats: number;
    governmentSeats: number;
    managementSeats: number;
    nriSeats: number;
    intakeMonths: string[];
  };
  fees: {
    currency: string;
    tuitionAnnual: number;
    totalProgram: number;
    registration: number;
    scholarshipAvailable: boolean;
    paymentSchedule: string;
    refundPolicy: string;
  };
  infrastructure?: {
    campusSize: string;
    hostelCapacity: number;
    librarySize: string;
    sportsFacilities: string[];
  };
  admission: {
    entranceExams: string[];
    eligibilityCriteria: string;
    applicationDeadline: string;
  };
  admin?: {
    headOfDepartment: string;
    accreditationBody: string;
    accreditationValidUntil: string;
    commission: number;
  };
  content?: {
    shortDescription: string;
    longDescription: string;
  };
}

export interface UniversityFilters {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const universityKeys = {
  all: ["universities"] as const,
  lists: () => [...universityKeys.all, "list"] as const,
  list: (filters: UniversityFilters) =>
    [...universityKeys.lists(), filters] as const,
  details: () => [...universityKeys.all, "detail"] as const,
  detail: (id: string) => [...universityKeys.details(), id] as const,
};

export function useUniversities(filters: UniversityFilters = {}) {
  return useQuery({
    queryKey: universityKeys.list(filters),
    queryFn: () =>
      api.get<PaginatedResponse<UniversityListItem>>("/admin/universities", {
        params: filters,
      }),
  });
}

export function useUniversity(id: string) {
  return useQuery({
    queryKey: universityKeys.detail(id),
    queryFn: () => api.get<UniversityDetail>(`/admin/universities/${id}`),
    enabled: !!id,
  });
}

export function useCreateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UniversityDetail>) =>
      api.post<UniversityDetail>("/admin/universities", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.lists() });
    },
  });
}

export function useUpdateUniversity(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UniversityDetail>) =>
      api.put<UniversityDetail>(`/admin/universities/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: universityKeys.lists() });
    },
  });
}

export function useDeleteUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/universities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.lists() });
    },
  });
}

export function useUpdateUniversityStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/universities/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.all });
    },
  });
}
