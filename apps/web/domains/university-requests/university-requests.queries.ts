import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import {
  createUniversityRequest,
  getUniversityRequests,
  getUniversityRequestStats,
} from "./university-requests.api";
import type { CreateUniversityRequestPayload } from "./university-requests.types";

export function useCreateUniversityRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUniversityRequestPayload) => createUniversityRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universityRequests.all });
    },
  });
}

export function useUniversityRequests(status?: string) {
  return useQuery({
    queryKey: queryKeys.universityRequests.list(status),
    queryFn: () => getUniversityRequests(status),
  });
}

export function useUniversityRequestStats() {
  return useQuery({
    queryKey: queryKeys.universityRequests.stats,
    queryFn: () => getUniversityRequestStats(),
  });
}
