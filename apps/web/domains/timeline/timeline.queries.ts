import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";

export function useApplicationTimeline(applicationId: string) {
  return useQuery({
    queryKey: queryKeys.timeline.byApplication(applicationId),
    queryFn: async () => {
      const { getApplicationTimeline } = await import("./timeline.api");
      return getApplicationTimeline(applicationId);
    },
    enabled: !!applicationId,
  });
}

export function useStudentTimeline() {
  return useQuery({
    queryKey: queryKeys.timeline.my(),
    queryFn: async () => {
      const { getStudentTimeline } = await import("./timeline.api");
      return getStudentTimeline();
    },
  });
}