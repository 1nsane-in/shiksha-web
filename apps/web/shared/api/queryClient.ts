import { QueryClient } from "@tanstack/react-query";
import { QUERY_CONFIG, HTTP_STATUS } from "./constants";
import type { AxiosError } from "axios";

function shouldRetry(failureCount: number, error: unknown) {
  if (failureCount >= QUERY_CONFIG.RETRY_COUNT) return false;
  const axiosError = error as AxiosError;
  const status = axiosError?.response?.status;
  if (status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN || status === HTTP_STATUS.TOO_MANY_REQUESTS) return false;
  return true;
}

const defaultOptions = {
  queries: {
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.CACHE_TIME,
    retry: shouldRetry,
    refetchOnWindowFocus: false,
  },
  mutations: { retry: shouldRetry },
};

let queryClient: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = new QueryClient({ defaultOptions });
  }
  return queryClient;
}

export function clearQueryCache(): void {
  queryClient?.clear();
}
