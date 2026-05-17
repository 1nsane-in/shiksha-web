export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'admin' | 'counselor'
}

export interface Application {
  id: string
  userId: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

// ========== University Onboarding ==========

export type UniversityType = 'public' | 'private' | 'deemed' | 'trust'
export type AccreditationStatus = 'approved' | 'pending' | 'conditional'
export type SelectionProcess = 'interview' | 'merit' | 'first-come'
export type HostelType = 'single' | 'shared' | 'both'

export interface UniversityAccreditation {
  body: string
  status: AccreditationStatus
  certificateUrl?: string
  expiryDate?: string
}

export interface UniversityProgram {
  degree: string
  course: string
  duration: string
  language: string
  medium: string
  specialization: string
  foundationCourseAvailable: boolean
}

export interface UniversityFee {
  tuitionPerYear: number
  tuitionTotal: number
  hostelFee: number
  otherFees: string
  paymentSchedule: string
  refundPolicy: string
  scholarshipAvailable: boolean
  scholarshipCriteria?: string
  bankDetails?: string
}

export interface UniversityAdmission {
  intakes: string[]
  deadline?: string
  minGpa?: string
  requiredSubjects: string[]
  minAge?: number
  entranceExam?: string
  englishProficiencyRequired: boolean
  englishProficiencyScore?: string
  applicationFee: number
  selectionProcess: SelectionProcess
}

export interface UniversityContact {
  admissionsEmail: string
  admissionsPhone: string
  internationalOfficeEmail?: string
  authorizedSignatoryName: string
  authorizedSignatoryTitle: string
  partnerSupportEmail?: string
}

export interface University {
  id?: string

  // 1. Basic Identity
  name: string
  slug: string
  shortName: string
  tagline?: string
  websiteUrl: string
  established: string
  type: UniversityType

  // 2. Location & Campus
  country: string
  city?: string
  address?: string
  image: string
  campusImages?: string[]
  campusVideoUrl?: string

  // 3. Accreditation
  accreditations: UniversityAccreditation[]
  medicalCouncilRecognitions?: string

  // 4. Academic Programs
  programs: UniversityProgram[]
  curriculumUrl?: string
  clinicalRotationPartners?: string

  // 5. Admission
  admission: UniversityAdmission

  // 6. Fee
  fee: UniversityFee

  // 7. Infrastructure
  campusSize?: string
  hostelCapacity?: number
  hostelType?: HostelType
  teachingHospital?: string
  hospitalBedCount?: number
  labFacilities?: string
  libraryDetails?: string
  sportsFacilities?: string

  // 8. Faculty
  totalFaculty?: number
  professorCount?: number
  studentFacultyRatio?: string
  hasInternationalFaculty?: boolean

  // 9. Student Support
  hasInternationalOffice?: boolean
  hasOrientation?: boolean
  hasAirportPickup?: boolean
  hasIndianMess?: boolean
  hasHealthInsurance?: boolean
  hasVisaSupport?: boolean

  // 10. Contact
  contact: UniversityContact

  // 11. Documents
  partnershipDocuments?: string[]
  brochureUrl?: string
  detailUrl?: string

  // Metadata
  grade?: string
  worldRank?: string
  ecfmg?: string
  createdAt?: string
  updatedAt?: string
}
