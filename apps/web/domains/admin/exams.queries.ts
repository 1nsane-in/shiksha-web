import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type { ScheduleExamPayload, DeclareResultPayload } from "./exams.types";

export function useAllExams(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...queryKeys.exams.all, "admin", { page, limit }] as const,
    queryFn: async () => {
      const { getAllExams } = await import("./exams.api");
      return getAllExams(page, limit);
    },
  });
}

export function useScheduleExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ScheduleExamPayload) => {
      const { scheduleExam } = await import("./exams.api");
      return scheduleExam(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.all });
    },
  });
}

export function useDeclareExamResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DeclareResultPayload) => {
      const { declareExamResult } = await import("./exams.api");
      return declareExamResult(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.all });
    },
  });
}
