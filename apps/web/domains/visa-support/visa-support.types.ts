export interface VisaCenter {
  id: string;
  name: string;
  address?: string;
  city: string;
  country: string;
  contactNo?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VisaChecklist {
  id: string;
  country: string;
  title: string;
  description?: string;
  documents: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type VisaStatus =
  | "DRAFT"
  | "DOCUMENTS_PENDING"
  | "SUBMITTED"
  | "PROCESSING"
  | "APPROVED"
  | "REJECTED";

export interface VisaApplication {
  id: string;
  studentId: string;
  applicationId?: string;
  visaCenterId?: string;
  checklistId?: string;
  status: VisaStatus;
  passportNumber?: string;
  passportExpiry?: string;
  visaType?: string;
  documentUrls: string[];
  remarks?: string;
  notes?: string;
  submittedAt?: string;
  decidedAt?: string;
  decidedBy?: string;
  createdAt: string;
  updatedAt: string;
  visaCenter?: VisaCenter;
  checklist?: VisaChecklist;
}

export interface CreateVisaCenterPayload {
  name: string;
  city: string;
  country: string;
  address?: string;
  contactNo?: string;
  email?: string;
  website?: string;
}

export interface CreateVisaChecklistPayload {
  country: string;
  title: string;
  description?: string;
  documents: string[];
}

export interface CreateVisaApplicationPayload {
  studentId: string;
  applicationId?: string;
  visaCenterId?: string;
  checklistId?: string;
  passportNumber?: string;
  passportExpiry?: string;
  visaType?: string;
  remarks?: string;
}

export interface DecideVisaPayload {
  decision: "APPROVED" | "REJECTED";
  remarks?: string;
}
