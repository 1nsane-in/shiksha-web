import type { Dispatch, SetStateAction } from "react";

// ─── Sub-types ───────────────────────────────────────────

export interface FeeBreakdownItem {
  name: string;
  amount: number;
}

export interface Program {
  name: string;
  duration: string;
  annualTuition: number;
  registration: number;
  totalSeats: number;
  governmentSeats: number;
  managementSeats: number;
  nriSeats: number;
  feeBreakdown: FeeBreakdownItem[];
}

export interface SubjectRanking {
  subject: string;
  ranking: string;
}

export interface CountryBreakdown {
  country: string;
  count: number;
}

export interface StudentDemographics {
  totalStudents: number;
  localStudents: number;
  foreignStudents: number;
  foreignByCountry: CountryBreakdown[];
}

export interface ProgramEligibility {
  minimumMarks: string;
  eligibility: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  twitter: string;
  tiktok: string;
}

// ─── Full form shape ─────────────────────────────────────

export interface UniversityFormData {
  name: string;
  shortName: string;
  establishedYear: number;
  type: string;
  website: string;
  logo: string;
  bannerImage: string;
  brochureUrl: string;
  location: {
    country: string;
    state: string;
    city: string;
    address: string;
  };
  contact: {
    email: string;
    phone: string;
    admissionOfficeHours: string;
  };
  academic: {
    programs: Program[];
    duration: string;
    medium: string;
    specializations: string[];
    intakeMonths: string[];
  };
  recognition: {
    bodies: string[];
    ecfmgStatus: string;
    nbaAccredited: boolean;
    accreditations: string[];
    worldRankingSource: string;
    nationalRankingSource: string;
    otherRankingSource: string;
    otherNationalRankingSource: string;
    subjectRankings: SubjectRanking[];
  };
  fees: {
    currency: string;
    scholarshipAvailable: boolean;
    scholarships: string[];
    paymentSchedule: string;
    refundPolicy: string;
    feeBreakdown: FeeBreakdownItem[];
  };
  infrastructure: {
    departments: string[];
    hostelBoys: number;
    hostelGirls: number;
    laboratories: string[];
    facilities: string[];
    cafeteria: boolean;
    wifiCampus: boolean;
    transportation: boolean;
  };
  admission: {
    entranceExams: string[];
    ageCriteria: string;
    programEligibility: ProgramEligibility[];
    requiredDocuments: string[];
    applicationDeadline: string;
    applicationFee: number;
    selectionProcess: string;
  };
  support: {
    topRecruiters: string[];
    alumniNetwork: boolean;
    internationalStudentSupport: boolean;
    visaAssistance: boolean;
    languageSupport: string[];
    extraServices: string[];
    counselingServices: boolean;
    careerGuidance: boolean;
  };
  content: {
    shortDescription: string;
    longDescription: string;
    highlights: string[];
    gallery: string[];
  };
  admin: {
    pocName: string;
    pocDesignation: string;
    pocEmail: string;
    phoneCountryCode: string;
    phoneNumber: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankBranch: string;
    ifscCode: string;
    gstNumber: string;
    panNumber: string;
    commission: number;
    bankCountry: string;
    bankDetails: Record<string, string>;
  };
  studentDemographics: StudentDemographics;
  socialLinks: SocialLinks;
}

export type FormFieldValue = string | number | boolean | string[] | Record<string, string> | null | undefined;

// ─── Image keys ──────────────────────────────────────────

export interface ImageKeys {
  logo?: string;
  bannerImage?: string;
  brochure?: string;
}

// ─── Location codes ──────────────────────────────────────

export interface LocationCodes {
  countryCode: string;
  stateCode: string;
}

// ─── Extra bank fields ───────────────────────────────────

export interface ExtraBankField {
  key: string;
  value: string;
}

// ─── Step renderer props ─────────────────────────────────

export interface StepRendererProps {
  currentStep: number;
  formData: UniversityFormData;
  formErrors: Record<string, string>;
  onFieldUpdate: (section: string, field: string, value: FormFieldValue) => void;
  onRootFieldUpdate: (field: string, value: FormFieldValue) => void;
  onSetFormErrors: Dispatch<SetStateAction<Record<string, string>>>;
  imageKeys: ImageKeys;
  onSetImageKeys: Dispatch<SetStateAction<ImageKeys>>;
  onRemoveImage: (field: "logo" | "bannerImage" | "brochure") => void;
  locationCodes: LocationCodes;
  onSetLocationCodes: Dispatch<SetStateAction<LocationCodes>>;
  selectedBankCountry: string;
  onSetSelectedBankCountry: Dispatch<SetStateAction<string>>;
  extraBankFields: ExtraBankField[];
  onSetExtraBankFields: Dispatch<SetStateAction<ExtraBankField[]>>;
}

// ─── Wizard step props (used by step components) ─────────

export interface WizardStepProps {
  formData: UniversityFormData;
  formErrors: Record<string, string>;
  onFieldUpdate: (section: string, field: string, value: FormFieldValue) => void;
  onRootFieldUpdate: (field: string, value: FormFieldValue) => void;
  onSetFormErrors: Dispatch<SetStateAction<Record<string, string>>>;
}

export interface WizardStep0Props extends WizardStepProps {
  imageKeys: ImageKeys;
  onSetImageKeys: Dispatch<SetStateAction<ImageKeys>>;
  onRemoveImage: (field: "logo" | "bannerImage" | "brochure") => void;
  onNormalizeUrl: (section: string, field: string, value: string) => void;
}

export interface WizardStep1Props extends WizardStepProps {
  locationCodes: LocationCodes;
  onSetLocationCodes: Dispatch<SetStateAction<LocationCodes>>;
}

export interface WizardStep8Props extends WizardStepProps {
  selectedBankCountry: string;
  onSetSelectedBankCountry: Dispatch<SetStateAction<string>>;
  extraBankFields: ExtraBankField[];
  onSetExtraBankFields: Dispatch<SetStateAction<ExtraBankField[]>>;
}
