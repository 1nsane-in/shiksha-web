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
  speaking: "high" | "moderate" | "low";
  reading: "high" | "moderate" | "low";
  writing: "high" | "moderate" | "low";
}

export interface ApplicationCheckResult {
  applied: boolean;
  application?: {
    id: string;
    selectedProgram: string;
    status: string;
    submittedAt: string;
  };
}

export interface ApplicationDetail {
  id: string;
  studentId: string;
  universityId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  selectedProgram: string | null;
  status: string;
  submittedAt: string | null;
  formData: SubmitApplicationFormData | null;
  createdAt: string;
  updatedAt: string;
  examRecord: { id: string } | null;
  admissionLetter: {
    id: string;
    fileUrl: string;
    fileName: string | null;
    uploadedAt: string;
  } | null;
  university: {
    id: string;
    name: string;
    shortName: string;
    slug: string;
    type: string;
    status: string;
    location: {
      country: string;
      city: string;
    } | null;
    contact: {
      email: string;
      phone: string;
    } | null;
  };
}

export interface SubmitApplicationFormData {
  universityId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  placeOfBirth: PlaceOfBirth;
  citizenship: string;
  maritalStatus: "single" | "married";
  gender: "male" | "female" | "other";
  permanentAddress: string;
  permanentCity: string;
  permanentState: string;
  permanentZip: string;
  permanentCountry: string;
  email: string;
  embassyLocation: string;
  language1: LanguageAbility;
  otherLanguages?: LanguageAbility[];
  selectedProgram:
    | "pre-medical"
    | "general-medicine"
    | "dentistry"
    | "post-graduate";
  postGraduateDetail?: string;
  passportUrl?: string;
  certificateUrl?: string;
  signature: string;
  signatureDate: string;
}

// ── Update Profile ──
export interface UpdateStudentProfileData {
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
}

// Dashboard Types
export interface DashboardOverview {
  profile: {
    studentId: string;
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatarUrl?: string;
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
  };
  stage: { currentStage: number; applicationStatus: string };
  documentStats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  paymentStats: {
    totalPaid: number;
    pendingAmount: number;
    totalPayments: number;
  };
  applicationSummary: {
    total: number;
    applications: {
      id: string;
      status: string;
      selectedProgram?: string;
      submittedAt?: string;
      university: { id: string; name: string; shortName: string };
    }[];
  };
  examSummary: { id: string; examDate?: string; result?: string } | null;
  lettersAvailability: { admissionLetter: boolean; invitationLetter: boolean };
}

export interface DashboardActivity {
  recentEvents: {
    id: string;
    stage: number;
    event: string;
    title: string;
    description?: string;
    occurredAt: string;
  }[];
  unreadNotifications: number;
  upcomingDeadlines: {
    type: "exam" | "visa";
    date: string;
    title: string;
    detail?: string;
  }[];
}

export interface NextAction {
  type: string;
  title: string;
  description: string;
  actionUrl: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

export interface DashboardNextSteps {
  nextActions: NextAction[];
  completionPercentage: number;
  pendingItems: string[];
}
