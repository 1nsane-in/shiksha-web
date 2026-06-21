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
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
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
  @IsArray() programs: any[];
  @IsString() duration: string;
  @IsString() medium: string;
  @IsArray() @IsString({ each: true }) specializations: string[];
  @IsArray() @IsString({ each: true }) intakeMonths: string[];
  @IsOptional() @IsNumber() @Min(0) totalSeats?: number;
  @IsOptional() @IsNumber() @Min(0) governmentSeats?: number;
  @IsOptional() @IsNumber() @Min(0) managementSeats?: number;
  @IsOptional() @IsNumber() @Min(0) nriSeats?: number;
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
  @IsOptional() @IsString() rankingSource?: string;
  @IsOptional() @IsString() worldRankingSource?: string;
  @IsOptional() @IsString() nationalRankingSource?: string;
  @IsOptional() @IsString() otherRankingSource?: string;
  @IsOptional() @IsString() otherNationalRankingSource?: string;
  @IsOptional() @IsObject() subjectRankings?: Record<string, string>;
  @IsArray() @IsString({ each: true }) accreditations: string[];
}

export class FeeBreakdownItemDto {
  @IsString() name: string;
  @IsNumber() @Min(0) amount: number;
}

export class ProgramFeeBreakdownDto {
  @IsString() programName: string;
  @IsNumber() @Min(0) annualTuition: number;
  @IsNumber() @Min(0) totalSeats: number;
  @IsOptional() @IsNumber() @Min(0) governmentSeats?: number;
  @IsOptional() @IsNumber() @Min(0) managementSeats?: number;
  @IsOptional() @IsNumber() @Min(0) nriSeats?: number;
  @IsOptional() @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeeBreakdownItemDto)
  feeBreakdown?: FeeBreakdownItemDto[];
}

export class UniversityFeesDto {
  @IsOptional() @IsNumber() @Min(0) tuitionAnnual?: number;
  @IsNumber() @Min(0) totalProgram: number;
  @IsOptional() @IsNumber() @Min(0) hostelAnnual?: number;
  @IsOptional() @IsNumber() @Min(0) registration?: number;
  @IsOptional() @IsNumber() @Min(0) examination?: number;
  @IsOptional() @IsNumber() @Min(0) library?: number;
  @IsOptional() @IsObject() otherFees?: Record<string, number>;
  @IsString() currency: string;
  @IsBoolean() scholarshipAvailable: boolean;
  @IsOptional() @IsString() scholarshipDetails?: string;
  @IsString() paymentSchedule: string;
  @IsString() refundPolicy: string;
  @IsOptional() @IsString() feeHikePolicy?: string;
  @IsOptional() @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgramFeeBreakdownDto)
  programBreakdown?: ProgramFeeBreakdownDto[];
}

export class UniversityInfrastructureDto {
  @IsOptional() @IsNumber() @Min(0) hospitalBeds?: number;
  @IsArray() @IsString({ each: true }) departments: string[];
  @IsOptional() @IsString() librarySize?: string;
  @IsNumber() @Min(0) hostelBoys: number;
  @IsNumber() @Min(0) hostelGirls: number;
  @IsArray() @IsString({ each: true }) laboratories: string[];
  @IsOptional() @IsNumber() @Min(0) campusArea?: number;
  @IsArray() @IsString({ each: true }) facilities: string[];
  @IsBoolean() cafeteria: boolean;
  @IsBoolean() wifiCampus: boolean;
  @IsBoolean() transportation: boolean;
}

export class UniversityAdmissionDto {
  @IsArray() @IsString({ each: true }) entranceExams: string[];
  @IsOptional() @IsString() minimumMarks?: string; // Legacy field
  @IsString() ageCriteria: string;
  @IsOptional() @IsString() eligibility?: string; // Legacy field
  @IsOptional() @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgramEligibilityDto)
  programEligibility?: ProgramEligibilityDto[];
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

export class StudentDemographicsDto {
  @IsNumber() @Min(0) totalStudents: number;
  @IsNumber() @Min(0) localStudents: number;
  @IsNumber() @Min(0) foreignStudents: number;
  @IsOptional() @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ForeignStudentBreakdownDto)
  foreignByCountry?: ForeignStudentBreakdownDto[];
}

export class ForeignStudentBreakdownDto {
  @IsString() country: string;
  @IsNumber() @Min(0) count: number;
}

export class SocialLinksDto {
  @IsOptional() @IsUrl() facebook?: string;
  @IsOptional() @IsUrl() instagram?: string;
  @IsOptional() @IsUrl() youtube?: string;
  @IsOptional() @IsUrl() linkedin?: string;
  @IsOptional() @IsUrl() twitter?: string;
  @IsOptional() @IsUrl() tiktok?: string;
}

export class ProgramEligibilityDto {
  @IsString() minimumMarks: string;
  @IsString() eligibility: string;
}

export class UniversityAdminDto {
  @IsString() pocName: string;
  @IsString() pocDesignation: string;
  @IsEmail() pocEmail: string;
  @IsOptional() @IsString() pocPhone?: string; // Legacy field
  @IsString() phoneCountryCode: string;
  @IsString() phoneNumber: string;
  @IsString() accountName: string;
  @IsString() accountNumber: string;
  @IsString() bankName: string;
  @IsString() bankBranch: string;
  @IsString() ifscCode: string;
  @IsOptional() @IsString() gstNumber?: string;
  @IsOptional() @IsString() panNumber?: string;
  @IsNumber() @Min(0) @Max(100) commission: number;

  // Country-specific bank details (for non-Indian universities)
  @IsOptional() @IsString() bankCountry?: string;
  @IsOptional() @IsObject() bankDetails?: any;
}
