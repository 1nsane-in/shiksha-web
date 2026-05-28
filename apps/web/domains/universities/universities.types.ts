import type { PaginatedResponse, PaginationMeta } from "../applications/applications.types";

export interface UniversityLocation {
  country: string;
  city: string;
  state: string;
  address: string;
}

export interface UniversityContact {
  email: string;
  phone: string;
  admissionOfficeHours?: string;
}

export interface UniversityAcademic {
  medium: string;
}

export interface UniversityContent {
  gallery: string[];
  shortDescription?: string;
  longDescription?: string;
  highlights?: string[];
  whyChooseUs?: string;
  videoTour?: string;
  virtualTour?: string;
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
  location: UniversityLocation | null;
  contact: UniversityContact | null;
  academic: UniversityAcademic | null;
  content: UniversityContent | null;
}

export interface UniversityDetail extends UniversityListItem {
  website: string;
  location: UniversityLocation;
  contact: UniversityContact;
  academic: {
    programs: string[];
    duration: string;
    medium: string;
    specializations: string[];
    intakeMonths: string[];
    totalSeats: number;
    governmentSeats: number;
    managementSeats: number;
    nriSeats: number;
  } | null;
  infrastructure: {
    hospitalBeds: number;
    departments: number;
    hostelBoys: number;
    hostelGirls: number;
    laboratories: number;
    campusArea: number;
    facilities: string[];
    cafeteria: boolean;
    wifiCampus: boolean;
    transportation: boolean;
  } | null;
  admission: {
    entranceExams: string[];
    minimumMarks: string;
    ageCriteria: string;
    eligibility: string;
    requiredDocuments: string[];
    applicationDeadline: string;
    applicationFee: number;
    selectionProcess: string;
  } | null;
  support: {
    placementRate: number;
    averagePackage: number;
    visaAssistance: boolean;
    languageSupport: string[];
    counselingServices: boolean;
    careerGuidance: boolean;
  } | null;
  content: UniversityContent;
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
}

export interface UniversityFilters {
  page?: number;
  limit?: number;
  country?: string;
  type?: string;
  search?: string;
}

export type { PaginatedResponse, PaginationMeta };


