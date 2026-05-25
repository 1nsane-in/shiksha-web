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
    DETAIL: (id: string) => "/admin/universities/" + id,
    STATUS: (id: string) => "/admin/universities/" + id + "/status",
  },
  APPLICATIONS: {
    BASE: "/admin/applications",
    DETAIL: (id: string) => "/admin/applications/" + id,
    STATUS: (id: string) => "/admin/applications/" + id + "/status",
  },
  DOCUMENTS: {
    MY: "/student/documents",
    UPLOAD: "/student/documents",
    TYPES: "/admin/documents/types",
    PENDING: "/admin/documents/pending",
    STUDENT: (studentId: string) => "/admin/documents/student/" + studentId,
    VERIFY: (id: string) => "/admin/documents/" + id + "/verify",
    REUPLOAD: (id: string) => "/admin/documents/" + id + "/reupload",
    CREATE_TYPE: "/admin/documents/types",
    UPDATE_TYPE: (id: string) => "/admin/documents/types/" + id,
    DELETE_TYPE: (id: string) => "/admin/documents/types/" + id,
  },
  LETTERS: {
    ADMISSION_UPLOAD: "/letters/admission",
    INVITATION_UPLOAD: "/letters/invitation",
    INVITATION_UPDATE: (id: string) => "/letters/invitation/" + id,
    APPROVE_ACCESS: (applicationId: string) => "/letters/invitation/" + applicationId + "/approve-access",
    MY_ADMISSION: "/letters/admission/my",
    MY_INVITATION: "/letters/invitation/my",
  },
  EXAMS: {
    SCHEDULE: "/exams/schedule",
    DECLARE_RESULT: "/exams/declare-result",
    ADMIN_ALL: "/exams/admin/all",
    MY: "/exams/my",
  },
  TICKETS: {
    ADMIN_ALL: "/tickets/admin/all",
    DETAIL: (id: string) => "/tickets/" + id,
    UPDATE_STATUS: (id: string) => "/tickets/" + id + "/status",
    ASSIGN: (id: string) => "/tickets/" + id + "/assign",
    MY: "/tickets/my",
    CREATE: "/tickets",
    ADD_MESSAGE: (id: string) => "/tickets/" + id + "/messages",
  },
  PAYMENTS: {
    INITIATE: "/payments/initiate",
    VERIFY: "/payments/verify",
    HISTORY: "/payments/history",
    CONFIG: "/payments/config",
    PENDING: "/payments/admin/pending",
    MANUAL_APPROVE: "/payments/manual-approve",
    DETAIL: (id: string) => "/payments/" + id,
  },
  VISA: {
    CENTERS: "/visa-support/centers",
    CENTER: (id: string) => "/visa-support/centers/" + id,
    CHECKLISTS: "/visa-support/checklists",
    CHECKLIST: (id: string) => "/visa-support/checklists/" + id,
    MY: "/visa-support/applications/my",
    ALL: "/visa-support/applications/admin/all",
    APPLICATION: (id: string) => "/visa-support/applications/" + id,
    SUBMIT: (id: string) => "/visa-support/applications/" + id + "/submit",
    DECIDE: (id: string) => "/visa-support/applications/" + id + "/decide",
    COUNTRIES: "/visa-support/countries",
  },
  UPLOAD: {
    FILE: "/upload",
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