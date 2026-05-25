import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";

export function useMyExam() {
  return useQuery({
    queryKey: queryKeys.exams.my(),
    queryFn: async () => {
      const { getMyExam } = await import("./exams.api");
      return getMyExam();
    },
    retry: false,
  });
}

export function useExamByApplication(applicationId: string) {
  return useQuery({
    queryKey: queryKeys.exams.byApplication(applicationId),
    queryFn: async () => {
      const { getExamByApplication } = await import("./exams.api");
      return getExamByApplication(applicationId);
    },
    enabled: !!applicationId,
    retry: false,
  });
}