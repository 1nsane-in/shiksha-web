export interface ApplicationListItem {
  id: string;
  studentName: string;
  universityName: string;
  stage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDetail extends ApplicationListItem {
  studentId: string;
  universityId: string;
  documents: {
    id: string;
    type: string;
    status: string;
    uploadedAt: string;
  }[];
  payments: {
    id: string;
    stage: string;
    amount: number;
    status: string;
  }[];
}

export interface ApplicationFilters {
  search?: string;
  status?: string;
  stage?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
