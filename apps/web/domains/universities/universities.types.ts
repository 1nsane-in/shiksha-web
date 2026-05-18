export interface UniversityListItem {
  id: string;
  name: string;
  shortName: string;
  slug?: string;
  country: string;
  city: string;
  type: string;
  status: string;
  establishedYear: number;
  createdAt: string;
  location?: {
    country: string;
    city: string;
  };
  _count?: {
    courses: number;
    applications: number;
  };
}

export interface UniversityDetail {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  type: string;
  status: string;
  establishedYear: number;
  website: string;
  image: string;
  country: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    admissionOfficeHours: string;
  };
  recognition: {
    ecfmgStatus: string;
    naacGrade?: string;
    worldRank?: number;
  };
  academic: {
    programs: string[];
    duration: string;
    medium: string;
    totalSeats: number;
    governmentSeats: number;
    managementSeats: number;
    nriSeats: number;
    intakeMonths: string[];
  };
  fees: {
    currency: string;
    tuitionAnnual: number;
    totalProgram: number;
    registration: number;
    scholarshipAvailable: boolean;
    paymentSchedule: string;
    refundPolicy: string;
  };
  infrastructure?: {
    hospitalBeds?: number;
    departments?: number;
    laboratories?: number;
    hostelBoys?: number;
    hostelGirls?: number;
    cafeteria?: boolean;
    wifiCampus?: boolean;
    transportation?: boolean;
  };
  admission: {
    entranceExams: string[];
    eligibilityCriteria?: string;
    eligibility?: string;
    applicationDeadline: string;
    minimumMarks?: string;
    ageCriteria?: string;
    applicationFee?: number;
    selectionProcess?: string;
  };
  admin?: {
    headOfDepartment?: string;
    accreditationBody?: string;
    accreditationValidUntil?: string;
    commission: number;
    pocName?: string;
    pocDesignation?: string;
    pocEmail?: string;
    pocPhone?: string;
    accountNumber?: string;
    bankName?: string;
    bankBranch?: string;
    ifscCode?: string;
  };
  content?: {
    shortDescription: string;
    longDescription: string;
  };
}

export interface UniversityFilters {
  search?: string;
  status?: string;
  type?: string;
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
