export interface AdminStudentUser {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface AdminStudentApplication {
  id: string;
  status: string;
  university: {
    id: string;
    name: string;
    shortName: string;
    slug: string;
  };
}

export interface AdminStudentListItem {
  id: string;
  userId: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportIssueDate?: string;
  passportIssueCountry?: string;
  neetScore?: number;
  neetRank?: number;
  twelfthPercentage?: number;
  tenthPercentage?: number;
  currentStage: number;
  applicationStatus: string;
  createdAt: string;
  updatedAt: string;
  user: AdminStudentUser;
  applications: AdminStudentApplication[];
}

export interface AdminStudentFilters {
  page?: number;
  limit?: number;
  status?: string;
  stage?: number;
}

export interface AdminStudentStats {
  total: number;
  byStage: Record<number, number>;
  byStatus: Record<string, number>;
}

export interface UpdateStudentStagePayload {
  stage: number;
  status?: string;
}

export interface AssignUniversityPayload {
  courseId: string;
}

export interface UpdateAdminStudentPayload {
  name?: string;
  email?: string;
  phone?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  passportNumber?: string;
  passportExpiry?: string;
  neetScore?: number;
  twelfthPercentage?: number;
  tenthPercentage?: number;
  gender?: string;
  dob?: string;
}
