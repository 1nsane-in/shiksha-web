import type { PaginatedResponse, PaginationMeta } from "../applications/applications.types";

export interface UniversityLocation {
  id?: string;
  country: string;
  city: string;
  state: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface UniversityContact {
  id?: string;
  email: string;
  phone: string;
  admissionOfficeHours?: string;
}

export interface UniversityProgram {
  name: string;
  duration: string;
  annualTuition: number;
  registration?: number;
  totalSeats: number;
  governmentSeats: number;
  managementSeats: number;
  nriSeats: number;
  feeBreakdown?: { id?: string; name: string; amount: number }[];
}

export interface UniversityAcademic {
  id?: string;
  programs: UniversityProgram[];
  duration: string;
  medium: string;
  specializations: string[];
  intakeMonths: string[];
  totalSeats: number;
  governmentSeats: number;
  managementSeats: number;
  nriSeats: number;
  curriculumType?: string | null;
  clinicalTraining?: string | null;
}

export interface UniversityContent {
  id?: string;
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  whyChooseUs?: string | null;
  gallery: string[];
  videoTour?: string | null;
  virtualTour?: string | null;
}

export interface UniversityInfrastructure {
  id?: string;
  hospitalBeds?: number | null;
  departments: string[];
  librarySize?: string | null;
  hostelBoys: number;
  hostelGirls: number;
  laboratories: string[];
  campusArea?: number | null;
  facilities: string[];
  cafeteria: boolean;
  wifiCampus: boolean;
  transportation: boolean;
}

export interface ProgramEligibility {
  minimumMarks: string;
  eligibility: string;
}

export interface UniversityAdmission {
  id?: string;
  entranceExams: string[];
  minimumMarks?: string | null;
  ageCriteria: string;
  eligibility?: string | null;
  programEligibility?: ProgramEligibility[];
  requiredDocuments: string[];
  applicationDeadline: string;
  applicationFee: number;
  selectionProcess: string;
  reservationPolicy?: string | null;
}

export interface UniversitySupport {
  id?: string;
  placementRate?: number | null;
  averagePackage?: number | null;
  topRecruiters: string[];
  alumniNetwork: boolean;
  alumniCount?: number | null;
  internationalStudentSupport: boolean;
  visaAssistance: boolean;
  languageSupport: string[];
  counselingServices: boolean;
  careerGuidance: boolean;
}

export interface UniversityRecognition {
  id?: string;
  bodies: string[];
  ecfmgStatus: string;
  naacGrade?: string | null;
  nbaAccredited: boolean;
  worldRank?: number | null;
  nationalRank?: number | null;
  rankingSource?: string | null;
  worldRankingSource?: string | null;
  nationalRankingSource?: string | null;
  otherRankingSource?: string | null;
  otherNationalRankingSource?: string | null;
  subjectRankings?: Record<string, string> | null;
  accreditations: string[];
}

export interface UniversityFees {
  id?: string;
  tuitionAnnual: number;
  totalProgram: number;
  hostelAnnual?: number | null;
  registration: number;
  examination?: number | null;
  library?: number | null;
  otherFees?: Record<string, number> | null;
  currency: string;
  scholarshipAvailable: boolean;
  scholarshipDetails?: string | null;
  paymentSchedule: string;
  refundPolicy: string;
  feeHikePolicy?: string | null;
  programBreakdown?: any[];
}

export interface UniversityAdmin {
  id?: string;
  pocName: string;
  pocDesignation: string;
  pocEmail: string;
  pocPhone?: string | null;
  phoneCountryCode?: string;
  phoneNumber?: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankBranch: string;
  ifscCode: string;
  gstNumber?: string | null;
  panNumber?: string | null;
  commission: number;
  recipientName?: string | null;
  recipientBank?: string | null;
  bankIdCode?: string | null;
  recipientInn?: string | null;
  recipientKpp?: string | null;
  singleTreasuryAccount?: string | null;
  paymentPurpose?: string | null;
  bankCountry?: string | null;
  bankDetails?: Record<string, any> | null;
}

export interface StudentDemographics {
  totalStudents: number;
  localStudents: number;
  foreignStudents: number;
  foreignByCountry?: { country: string; count: number }[];
}

export interface SocialLinks {
  facebook?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
}

export interface UniversityCourse {
  id: string;
  name: string;
  duration: number;
  fees: number;
  seats: number;
  isActive: boolean;
}

export interface UniversityDocument {
  id: string;
  universityId: string;
  type: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface UniversityCount {
  courses: number;
  applications: number;
}

export interface UniversityListItem {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  establishedYear: number;
  type: string;
  status: string;
  logo: string;
  bannerImage?: string;
  brochureUrl?: string;
  verifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  location: UniversityLocation | null;
  contact: UniversityContact | null;
  academic: UniversityAcademic | null;
  content: UniversityContent | null;
}

export interface UniversityDetail extends UniversityListItem {
  website: string;
  location: UniversityLocation;
  contact: UniversityContact;
  academic: UniversityAcademic | null;
  infrastructure: UniversityInfrastructure | null;
  admission: UniversityAdmission | null;
  support: UniversitySupport | null;
  content: UniversityContent;
  recognition: UniversityRecognition | null;
  fees: UniversityFees | null;
  admin: UniversityAdmin | null;
  courses: UniversityCourse[];
  documents: UniversityDocument[];
  studentDemographics?: StudentDemographics | null;
  socialLinks?: SocialLinks | null;
  _count?: UniversityCount;
  courses: {
    id: string;
    name: string;
    duration: number;
    fees: number;
    seats: number;
    isActive: boolean;
  }[];
  recognition: {
    nmcApproved: boolean;
    whoListed: boolean;
    ecfmgVerified: boolean;
    accreditedBy: string;
    globalRank: number;
    countryRank: number;
    approvals: string[];
  } | null;
  fees: {
    currency: string;
    tuitionFee: number;
    hostelFee: number;
    totalFee: number;
    paymentTerms: string;
    installmentAvailable: boolean;
    otherFees: Record<string, number>;
  } | null;
  admin: {
    assignedAdminId: string;
    assignedAdminName: string;
    lastReviewedAt: string;
    notes: string;
  } | null;
  documents?: {
    id: string;
    type: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
  }[];
}

export interface UniversityFilters {
  page?: number;
  limit?: number;
  country?: string;
  type?: string;
  status?: string;
  search?: string;
}

export type { PaginatedResponse, PaginationMeta };
