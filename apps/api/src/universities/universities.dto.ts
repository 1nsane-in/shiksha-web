import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsEnum,
  IsEmail,
  IsUrl,
  IsDateString,
  Min,
  Max,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

// Enums
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

// Location DTO
export class UniversityLocationDto {
  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

// Contact DTO
export class UniversityContactDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  admissionOfficeHours: string;
}

// Academic DTO
export class UniversityAcademicDto {
  @IsArray()
  @IsString({ each: true })
  programs: string[];

  @IsString()
  duration: string;

  @IsString()
  medium: string;

  @IsArray()
  @IsString({ each: true })
  specializations: string[];

  @IsArray()
  @IsString({ each: true })
  intakeMonths: string[];

  @IsNumber()
  @Min(1)
  totalSeats: number;

  @IsNumber()
  @Min(0)
  governmentSeats: number;

  @IsNumber()
  @Min(0)
  managementSeats: number;

  @IsNumber()
  @Min(0)
  nriSeats: number;

  @IsOptional()
  @IsString()
  curriculumType?: string;

  @IsOptional()
  @IsString()
  clinicalTraining?: string;
}

// Recognition DTO
export class UniversityRecognitionDto {
  @IsArray()
  @IsString({ each: true })
  bodies: string[];

  @IsEnum(ECFMGStatus)
  ecfmgStatus: ECFMGStatus;

  @IsOptional()
  @IsString()
  naacGrade?: string;

  @IsBoolean()
  nbaAccredited: boolean;

  @IsOptional()
  @IsNumber()
  worldRank?: number;

  @IsOptional()
  @IsNumber()
  nationalRank?: number;

  @IsArray()
  @IsString({ each: true })
  accreditations: string[];
}

// Fees DTO
export class UniversityFeesDto {
  @IsNumber()
  @Min(0)
  tuitionAnnual: number;

  @IsNumber()
  @Min(0)
  totalProgram: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hostelAnnual?: number;

  @IsNumber()
  @Min(0)
  registration: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  examination?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  library?: number;

  @IsOptional()
  @IsObject()
  otherFees?: Record<string, number>;

  @IsString()
  currency: string;

  @IsBoolean()
  scholarshipAvailable: boolean;

  @IsOptional()
  @IsString()
  scholarshipDetails?: string;

  @IsString()
  paymentSchedule: string;

  @IsString()
  refundPolicy: string;

  @IsOptional()
  @IsString()
  feeHikePolicy?: string;
}

// Infrastructure DTO
export class UniversityInfrastructureDto {
  @IsNumber()
  @Min(1)
  hospitalBeds: number;

  @IsNumber()
  @Min(1)
  departments: number;

  @IsOptional()
  @IsString()
  librarySize?: string;

  @IsNumber()
  @Min(0)
  hostelBoys: number;

  @IsNumber()
  @Min(0)
  hostelGirls: number;

  @IsNumber()
  @Min(1)
  laboratories: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  campusArea?: number;

  @IsArray()
  @IsString({ each: true })
  facilities: string[];

  @IsBoolean()
  cafeteria: boolean;

  @IsBoolean()
  wifiCampus: boolean;

  @IsBoolean()
  transportation: boolean;
}

// Admission DTO
export class UniversityAdmissionDto {
  @IsArray()
  @IsString({ each: true })
  entranceExams: string[];

  @IsString()
  minimumMarks: string;

  @IsString()
  ageCriteria: string;

  @IsString()
  eligibility: string;

  @IsArray()
  @IsString({ each: true })
  requiredDocuments: string[];

  @IsDateString()
  applicationDeadline: string;

  @IsNumber()
  @Min(0)
  applicationFee: number;

  @IsString()
  selectionProcess: string;

  @IsOptional()
  @IsString()
  reservationPolicy?: string;
}

// Support DTO
export class UniversitySupportDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  placementRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  averagePackage?: number;

  @IsArray()
  @IsString({ each: true })
  topRecruiters: string[];

  @IsBoolean()
  alumniNetwork: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  alumniCount?: number;

  @IsBoolean()
  internationalStudentSupport: boolean;

  @IsBoolean()
  visaAssistance: boolean;

  @IsArray()
  @IsString({ each: true })
  languageSupport: string[];

  @IsBoolean()
  counselingServices: boolean;

  @IsBoolean()
  careerGuidance: boolean;
}

// Content DTO
export class UniversityContentDto {
  @IsString()
  shortDescription: string;

  @IsString()
  longDescription: string;

  @IsArray()
  @IsString({ each: true })
  highlights: string[];

  @IsOptional()
  @IsString()
  whyChooseUs?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  gallery: string[];

  @IsOptional()
  @IsUrl()
  videoTour?: string;

  @IsOptional()
  @IsUrl()
  virtualTour?: string;
}

// Admin DTO
export class UniversityAdminDto {
  @IsString()
  pocName: string;

  @IsString()
  pocDesignation: string;

  @IsEmail()
  pocEmail: string;

  @IsString()
  pocPhone: string;

  @IsString()
  accountName: string;

  @IsString()
  accountNumber: string;

  @IsString()
  bankName: string;

  @IsString()
  bankBranch: string;

  @IsString()
  ifscCode: string;

  @IsOptional()
  @IsString()
  gstNumber?: string;

  @IsOptional()
  @IsString()
  panNumber?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  commission: number;
}

// Create University DTO
export class CreateUniversityDto {
  @IsString()
  name: string;

  @IsString()
  shortName: string;

  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear())
  establishedYear: number;

  @IsEnum(UniversityType)
  type: UniversityType;

  @IsUrl()
  website: string;

  @IsUrl()
  logo: string;

  @IsUrl()
  bannerImage: string;

  @ValidateNested()
  @Type(() => UniversityLocationDto)
  location: UniversityLocationDto;

  @ValidateNested()
  @Type(() => UniversityContactDto)
  contact: UniversityContactDto;

  @ValidateNested()
  @Type(() => UniversityAcademicDto)
  academic: UniversityAcademicDto;

  @ValidateNested()
  @Type(() => UniversityRecognitionDto)
  recognition: UniversityRecognitionDto;

  @ValidateNested()
  @Type(() => UniversityFeesDto)
  fees: UniversityFeesDto;

  @ValidateNested()
  @Type(() => UniversityInfrastructureDto)
  infrastructure: UniversityInfrastructureDto;

  @ValidateNested()
  @Type(() => UniversityAdmissionDto)
  admission: UniversityAdmissionDto;

  @ValidateNested()
  @Type(() => UniversitySupportDto)
  support: UniversitySupportDto;

  @ValidateNested()
  @Type(() => UniversityContentDto)
  content: UniversityContentDto;

  @ValidateNested()
  @Type(() => UniversityAdminDto)
  admin: UniversityAdminDto;
}

// Update University DTO
export class UpdateUniversityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  shortName?: string;

  @IsOptional()
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear())
  establishedYear?: number;

  @IsOptional()
  @IsEnum(UniversityType)
  type?: UniversityType;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  logo?: string;

  @IsOptional()
  @IsUrl()
  bannerImage?: string;

  @IsOptional()
  @IsEnum(UniversityStatus)
  status?: UniversityStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => UniversityLocationDto)
  location?: UniversityLocationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UniversityContactDto)
  contact?: UniversityContactDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UniversityAcademicDto)
  academic?: UniversityAcademicDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UniversityRecognitionDto)
  recognition?: UniversityRecognitionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UniversityFeesDto)
  fees?: UniversityFeesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UniversityInfrastructureDto)
  infrastructure?: UniversityInfrastructureDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UniversityAdmissionDto)
  admission?: UniversityAdmissionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UniversitySupportDto)
  support?: UniversitySupportDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UniversityContentDto)
  content?: UniversityContentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UniversityAdminDto)
  admin?: UniversityAdminDto;
}

// Document Upload DTO
export class UploadUniversityDocumentDto {
  @IsEnum(UniversityDocType)
  type: UniversityDocType;

  @IsUrl()
  fileUrl: string;

  @IsString()
  fileName: string;

  @IsNumber()
  @Min(1)
  fileSize: number;
}

// Query DTO
export class UniversityQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(UniversityStatus)
  status?: UniversityStatus;

  @IsOptional()
  @IsEnum(UniversityType)
  type?: UniversityType;

  @IsOptional()
  @IsString()
  search?: string;
}

// Course DTOs (keeping existing)
export class CreateCourseDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(0)
  fees: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  eligibility?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  seats?: number;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fees?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  eligibility?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  seats?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
