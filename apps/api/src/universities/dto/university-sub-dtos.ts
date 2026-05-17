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
  IsObject,
} from 'class-validator';
import { ECFMGStatus } from './university-enums';

export class UniversityLocationDto {
  @IsString() country: string;
  @IsString() state: string;
  @IsString() city: string;
  @IsString() address: string;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
}

export class UniversityContactDto {
  @IsEmail() email: string;
  @IsString() phone: string;
  @IsString() admissionOfficeHours: string;
}

export class UniversityAcademicDto {
  @IsArray() @IsString({ each: true }) programs: string[];
  @IsString() duration: string;
  @IsString() medium: string;
  @IsArray() @IsString({ each: true }) specializations: string[];
  @IsArray() @IsString({ each: true }) intakeMonths: string[];
  @IsNumber() @Min(1) totalSeats: number;
  @IsNumber() @Min(0) governmentSeats: number;
  @IsNumber() @Min(0) managementSeats: number;
  @IsNumber() @Min(0) nriSeats: number;
  @IsOptional() @IsString() curriculumType?: string;
  @IsOptional() @IsString() clinicalTraining?: string;
}

export class UniversityRecognitionDto {
  @IsArray() @IsString({ each: true }) bodies: string[];
  @IsEnum(ECFMGStatus) ecfmgStatus: ECFMGStatus;
  @IsOptional() @IsString() naacGrade?: string;
  @IsBoolean() nbaAccredited: boolean;
  @IsOptional() @IsNumber() worldRank?: number;
  @IsOptional() @IsNumber() nationalRank?: number;
  @IsArray() @IsString({ each: true }) accreditations: string[];
}

export class UniversityFeesDto {
  @IsNumber() @Min(0) tuitionAnnual: number;
  @IsNumber() @Min(0) totalProgram: number;
  @IsOptional() @IsNumber() @Min(0) hostelAnnual?: number;
  @IsNumber() @Min(0) registration: number;
  @IsOptional() @IsNumber() @Min(0) examination?: number;
  @IsOptional() @IsNumber() @Min(0) library?: number;
  @IsOptional() @IsObject() otherFees?: Record<string, number>;
  @IsString() currency: string;
  @IsBoolean() scholarshipAvailable: boolean;
  @IsOptional() @IsString() scholarshipDetails?: string;
  @IsString() paymentSchedule: string;
  @IsString() refundPolicy: string;
  @IsOptional() @IsString() feeHikePolicy?: string;
}

export class UniversityInfrastructureDto {
  @IsNumber() @Min(1) hospitalBeds: number;
  @IsNumber() @Min(1) departments: number;
  @IsOptional() @IsString() librarySize?: string;
  @IsNumber() @Min(0) hostelBoys: number;
  @IsNumber() @Min(0) hostelGirls: number;
  @IsNumber() @Min(1) laboratories: number;
  @IsOptional() @IsNumber() @Min(0) campusArea?: number;
  @IsArray() @IsString({ each: true }) facilities: string[];
  @IsBoolean() cafeteria: boolean;
  @IsBoolean() wifiCampus: boolean;
  @IsBoolean() transportation: boolean;
}

export class UniversityAdmissionDto {
  @IsArray() @IsString({ each: true }) entranceExams: string[];
  @IsString() minimumMarks: string;
  @IsString() ageCriteria: string;
  @IsString() eligibility: string;
  @IsArray() @IsString({ each: true }) requiredDocuments: string[];
  @IsDateString() applicationDeadline: string;
  @IsNumber() @Min(0) applicationFee: number;
  @IsString() selectionProcess: string;
  @IsOptional() @IsString() reservationPolicy?: string;
}

export class UniversitySupportDto {
  @IsOptional() @IsNumber() @Min(0) @Max(100) placementRate?: number;
  @IsOptional() @IsNumber() @Min(0) averagePackage?: number;
  @IsArray() @IsString({ each: true }) topRecruiters: string[];
  @IsBoolean() alumniNetwork: boolean;
  @IsOptional() @IsNumber() @Min(0) alumniCount?: number;
  @IsBoolean() internationalStudentSupport: boolean;
  @IsBoolean() visaAssistance: boolean;
  @IsArray() @IsString({ each: true }) languageSupport: string[];
  @IsBoolean() counselingServices: boolean;
  @IsBoolean() careerGuidance: boolean;
}

export class UniversityContentDto {
  @IsString() shortDescription: string;
  @IsString() longDescription: string;
  @IsArray() @IsString({ each: true }) highlights: string[];
  @IsOptional() @IsString() whyChooseUs?: string;
  @IsArray() @IsUrl({}, { each: true }) gallery: string[];
  @IsOptional() @IsUrl() videoTour?: string;
  @IsOptional() @IsUrl() virtualTour?: string;
}

export class UniversityAdminDto {
  @IsString() pocName: string;
  @IsString() pocDesignation: string;
  @IsEmail() pocEmail: string;
  @IsString() pocPhone: string;
  @IsString() accountName: string;
  @IsString() accountNumber: string;
  @IsString() bankName: string;
  @IsString() bankBranch: string;
  @IsString() ifscCode: string;
  @IsOptional() @IsString() gstNumber?: string;
  @IsOptional() @IsString() panNumber?: string;
  @IsNumber() @Min(0) @Max(100) commission: number;
}
