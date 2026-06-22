import type { DocumentFilters } from "@/domains/documents/documents.types";

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
  documents: {
    all: ["documents"] as const,
    my: () => [...queryKeys.documents.all, "my"] as const,
    types: () => [...queryKeys.documents.all, "types"] as const,
    pending: (filters: DocumentFilters = {}) =>
      [...queryKeys.documents.all, "pending", filters] as const,
    student: (studentId: string) =>
      [...queryKeys.documents.all, "student", studentId] as const,
  },
  letters: {
    all: ["letters"] as const,
    admission: () => [...queryKeys.letters.all, "admission"] as const,
    invitation: () => [...queryKeys.letters.all, "invitation"] as const,
  },
  payments: {
    all: ["payments"] as const,
    history: (applicationId?: string) => [...queryKeys.payments.all, "history", applicationId] as const,
    config: () => [...queryKeys.payments.all, "config"] as const,
    detail: (id: string) => [...queryKeys.payments.all, "detail", id] as const,
  },
  exams: {
    all: ["exams"] as const,
    my: () => [...queryKeys.exams.all, "my"] as const,
    byApplication: (applicationId: string) => [...queryKeys.exams.all, "application", applicationId] as const,
  },
  tickets: {
    all: ["tickets"] as const,
    my: () => [...queryKeys.tickets.all, "my"] as const,
    byApplication: (applicationId: string) => [...queryKeys.tickets.all, "application", applicationId] as const,
    detail: (id: string) => [...queryKeys.tickets.all, "detail", id] as const,
  },
  timeline: {
    all: ["timeline"] as const,
    byApplication: (applicationId: string) => [...queryKeys.timeline.all, "application", applicationId] as const,
    my: () => [...queryKeys.timeline.all, "my"] as const,
  },
  visa: {
    all: ["visa"] as const,
    centers: () => [...queryKeys.visa.all, "centers"] as const,
    center: (id: string) => [...queryKeys.visa.centers(), id] as const,
    checklists: (country?: string) => [...queryKeys.visa.all, "checklists", country] as const,
    my: () => [...queryKeys.visa.all, "my"] as const,
    allApplications: (status?: string) => [...queryKeys.visa.all, "applications", status] as const,
    application: (id: string) => [...queryKeys.visa.all, "application", id] as const,
    countries: () => [...queryKeys.visa.all, "countries"] as const,
  },
  student: {
    all: ["student"] as const,
    profile: () => [...queryKeys.student.all, "profile"] as const,
    stage: () => [...queryKeys.student.all, "stage"] as const,
    applications: () => [...queryKeys.student.all, "applications"] as const,
    applicationDetail: (id: string) => [...queryKeys.student.all, "application", id] as const,
    dashboardOverview: () => [...queryKeys.student.all, "dashboard", "overview"] as const,
    dashboardActivity: () => [...queryKeys.student.all, "dashboard", "activity"] as const,
    dashboardNextSteps: () => [...queryKeys.student.all, "dashboard", "next-steps"] as const,
  },
  gallery: {
    all: ["gallery"] as const,
  },
  consultations: {
    all: ["consultations"] as const,
  },
  universityRequests: {
    all: ["university-requests"] as const,
    list: (status?: string) => ["university-requests", "list", status] as const,
    stats: ["university-requests", "stats"] as const,
  },
};