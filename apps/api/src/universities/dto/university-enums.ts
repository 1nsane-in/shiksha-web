import type { UniversityType as SharedUniversityType, UniversityStatus as SharedUniversityStatus, ECFMGStatus as SharedECFMGStatus, UniversityDocType as SharedUniversityDocType } from '@repo/shared-types';

export enum UniversityType {
  GOVERNMENT = 'GOVERNMENT',
  PRIVATE = 'PRIVATE',
  DEEMED = 'DEEMED',
  AUTONOMOUS = 'AUTONOMOUS',
}

export enum UniversityStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum ECFMGStatus {
  APPROVED = 'APPROVED',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
}

export enum UniversityDocType {
  BROCHURE = 'BROCHURE',
  PROSPECTUS = 'PROSPECTUS',
  RECOGNITION_CERTIFICATE = 'RECOGNITION_CERTIFICATE',
  AFFILIATION_DOCUMENT = 'AFFILIATION_DOCUMENT',
  DEGREE_SAMPLE = 'DEGREE_SAMPLE',
  FEE_STRUCTURE = 'FEE_STRUCTURE',
  ADMISSION_FORM = 'ADMISSION_FORM',
  HOSTEL_RULES = 'HOSTEL_RULES',
  ANTI_RAGGING_POLICY = 'ANTI_RAGGING_POLICY',
  AGREEMENT = 'AGREEMENT',
}

// Compile-time checks: ensure enum values match shared-types string unions
type _AssertUniversityTypeExtends = UniversityType extends SharedUniversityType ? true : never;
type _AssertUniversityStatusExtends = UniversityStatus extends SharedUniversityStatus ? true : never;
type _AssertECFMGStatusExtends = ECFMGStatus extends SharedECFMGStatus ? true : never;
type _AssertUniversityDocTypeExtends = UniversityDocType extends SharedUniversityDocType ? true : never;
