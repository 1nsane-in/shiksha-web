import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type { SubmitApplicationFormData, UpdateStudentProfileData } from "./student.types";

export function useStudentProfile() {
  return useQuery({
    queryKey: queryKeys.student.profile(),
    queryFn: async () => {
      const { getStudentProfile } = await import("./student.api");
      return getStudentProfile();
    },
  });
}

export function useStageInfo() {
  return useQuery({
    queryKey: queryKeys.student.stage(),
    queryFn: async () => {
      const { getStageInfo } = await import("./student.api");
      return getStageInfo();
    },
    refetchInterval: 30000,
  });
}

export function useMyApplications(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...queryKeys.student.applications(), { page, limit }],
    queryFn: async () => {
      const { getMyApplications } = await import("./student.api");
      return getMyApplications(page, limit);
    },
  });
}

export function useMyApplicationById(id: string) {
  return useQuery({
    queryKey: queryKeys.student.applicationDetail(id),
    queryFn: async () => {
      const { getMyApplicationById } = await import("./student.api");
      return getMyApplicationById(id);
    },
    enabled: !!id,
  });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SubmitApplicationFormData) => {
      const { submitApplication } = await import("./student.api");
      return submitApplication(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.student.applications(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.student.stage() });
    },
  });
}

export function useCheckApplication(universityId: string) {
  return useQuery({
    queryKey: [...queryKeys.student.applications(), "check", universityId],
    queryFn: async () => {
      const { checkApplication } = await import("./student.api");
      return checkApplication(universityId);
    },
    enabled: !!universityId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateStudentProfileData) => {
      const { updateStudentProfile } = await import("./student.api");
      return updateStudentProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.student.dashboardOverview() });
    },
  });
}


export function useDashboardOverview() {
  return useQuery({
    queryKey: queryKeys.student.dashboardOverview(),
    queryFn: async () => {
      const { getDashboardOverview } = await import("./student.api");
      return getDashboardOverview();
    },
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: queryKeys.student.dashboardActivity(),
    queryFn: async () => {
      const { getDashboardActivity } = await import("./student.api");
      return getDashboardActivity();
    },
    refetchInterval: 60000,
  });
}

export function useDashboardNextSteps() {
  return useQuery({
    queryKey: queryKeys.student.dashboardNextSteps(),
    queryFn: async () => {
      const { getDashboardNextSteps } = await import("./student.api");
      return getDashboardNextSteps();
    },
  });
}
