export const queryKeys = {
  universities: {
    all: ["universities"] as const,
    lists: () => [...queryKeys.universities.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.universities.lists(), filters] as const,
    details: () => [...queryKeys.universities.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.universities.details(), id] as const,
  },
  applications: {
    all: ["applications"] as const,
    lists: () => [...queryKeys.applications.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.applications.lists(), filters] as const,
    details: () => [...queryKeys.applications.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.applications.details(), id] as const,
  },
};
