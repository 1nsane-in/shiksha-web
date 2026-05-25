import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";

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