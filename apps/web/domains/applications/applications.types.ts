export interface ApplicationListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  selectedProgram: string;
  status: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  university: {
    id: string;
    name: string;
    shortName: string | null;
    slug: string;
  };
  student: {
    id: string;
    currentStage: number;
    applicationStatus: string | null;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    };
  };
}

export interface TimelineEvent {
  id: string;
  applicationId: string;
  studentId: string;
  stage: number;
  event: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  occurredAt: string;
}

export interface ApplicationDetail extends ApplicationListItem {
  studentId: string;
  universityId: string;
  student: ApplicationListItem['student'] & {
    documents: {
      id: string;
      documentType: { id: string; name: string };
      fileUrl: string | null;
      status: string;
      uploadedAt: string;
    }[];
    payments: {
      id: string;
      stage: number;
      amount: number;
      status: string;
    }[];
  };
  timelineEvents: TimelineEvent[];
  tickets: {
    id: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
  }[];
}

export interface ApplicationFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
