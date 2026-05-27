export interface StudentProfile {
  id: string;
  userId: string;
  currentStage: number;
  applicationStatus: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatarUrl?: string;
  };
  applications: StudentApplication[];
  documents: StudentDocument[];
  payments: PaymentSummary[];
}

export interface StudentApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  selectedProgram?: string;
  status: string;
  submittedAt: string;
  university: {
    id: string;
    name: string;
    shortName: string;
    slug: string;
  };
}

export interface StudentDocument {
  id: string;
  documentType: {
    name: string;
    key: string;
  };
  status: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface PaymentSummary {
  id: string;
  amount: number;
  stage: number;
  status: string;
  paidAt?: string;
}

export interface StageInfo {
  currentStage: number;
  applicationStatus: string;
  requirements: StageRequirement[];
  documents: StudentDocument[];
  payments: PaymentSummary[];
}

export interface StageRequirement {
  id: string;
  stage: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface PlaceOfBirth {
  city: string;
  state: string;
  country: string;
}

export interface LanguageAbility {
  name: string;
  speaking: 'high' | 'moderate' | 'low';
  reading: 'high' | 'moderate' | 'low';
  writing: 'high' | 'moderate' | 'low';
}

export interface SubmitApplicationFormData {
  universityId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  placeOfBirth: PlaceOfBirth;
  citizenship: string;
  maritalStatus: 'single' | 'married';
  gender: 'male' | 'female' | 'other';
  permanentAddress: string;
  permanentCity: string;
  permanentState: string;
  permanentZip: string;
  permanentCountry: string;
  email: string;
  embassyLocation: string;
  language1: LanguageAbility;
  language2?: LanguageAbility;
  otherLanguages?: string[];
  selectedProgram: 'pre-medical' | 'general-medicine' | 'dentistry' | 'post-graduate';
  postGraduateDetail?: string;
  signature: string;
  signatureDate: string;
}
