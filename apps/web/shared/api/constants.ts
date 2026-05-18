export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    GOOGLE_LOGIN: "/auth/google-login",
    GOOGLE_REGISTER: "/auth/google-register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  UNIVERSITIES: {
    BASE: "/admin/universities",
    DETAIL: (id: string) => `/admin/universities/${id}`,
    STATUS: (id: string) => `/admin/universities/${id}/status`,
  },
  APPLICATIONS: {
    BASE: "/admin/applications",
    DETAIL: (id: string) => `/admin/applications/${id}`,
    STATUS: (id: string) => `/admin/applications/${id}/status`,
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_STORAGE: "auth-storage",
} as const;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  TOO_MANY_REQUESTS: 429,
} as const;

export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  CACHE_TIME: 10 * 60 * 1000,
  RETRY_COUNT: 1,
} as const;
