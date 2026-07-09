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

/* ─── Location ─── */
export class UniversityLocationDto {
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
}

/* ─── Contact ─── */
export class UniversityContactDto {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() admissionOfficeHours?: string;
}

/* ─── Academic ─── */
export class UniversityAcademicDto {
  @IsOptional() @IsArray() programs?: any[];
  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsString() medium?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) specializations?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) intakeMonths?: string[];
  @IsOptional() @IsNumber() @Min(0) totalSeats?: number;
  @IsOptional() @IsNumber() @Min(0) governmentSeats?: number;
  @IsOptional() @IsNumber() @Min(0) managementSeats?: number;
  @IsOptional() @IsNumber() @Min(0) nriSeats?: number;
  @IsOptional() @IsString() curriculumType?: string;
  @IsOptional() @IsString() clinicalTraining?: string;
}

/* ─── Recognition ─── */
export class UniversityRecognitionDto {
  @IsOptional() @IsArray() @IsString({ each: true }) bodies?: string[];
  @IsOptional() @IsEnum(ECFMGStatus) ecfmgStatus?: ECFMGStatus;
  @IsOptional() @IsString() naacGrade?: string;
  @IsOptional() @IsBoolean() nbaAccredited?: boolean;
  @IsOptional() @IsNumber() worldRank?: number;
  @IsOptional() @IsNumber() nationalRank?: number;
  @IsOptional() @IsString() rankingSource?: string;
  @IsOptional() @IsString() worldRankingSource?: string;
  @IsOptional() @IsString() nationalRankingSource?: string;
  @IsOptional() @IsString() otherRankingSource?: string;
  @IsOptional() @IsString() otherNationalRankingSource?: string;
  @IsOptional() @IsObject() subjectRankings?: Record<string, string>;
  @IsOptional() @IsArray() @IsString({ each: true }) accreditations?: string[];
}

/* ─── Fees sub-types ─── */
export class FeeBreakdownItemDto {
  @IsString() name!: string;
  @IsNumber() @Min(0) amount!: number;
}

export class ProgramFeeBreakdownDto {
  @IsString() programName!: string;
  @IsNumber() @Min(0) annualTuition!: number;
  @IsNumber() @Min(0) totalSeats!: number;
  @IsOptional() @IsNumber() @Min(0) governmentSeats?: number;
  @IsOptional() @IsNumber() @Min(0) managementSeats?: number;
  @IsOptional() @IsNumber() @Min(0) nriSeats?: number;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeeBreakdownItemDto)
  feeBreakdown?: FeeBreakdownItemDto[];
}

export class UniversityFeesDto {
  @IsOptional() @IsNumber() @Min(0) tuitionAnnual?: number;
  @IsOptional() @IsNumber() @Min(0) totalProgram?: number;
  @IsOptional() @IsNumber() @Min(0) hostelAnnual?: number;
  @IsOptional() @IsNumber() @Min(0) registration?: number;
  @IsOptional() @IsNumber() @Min(0) examination?: number;
  @IsOptional() @IsNumber() @Min(0) library?: number;
  @IsOptional() @IsObject() otherFees?: Record<string, number>;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsBoolean() scholarshipAvailable?: boolean;
  @IsOptional() @IsString() scholarshipDetails?: string;
  @IsOptional() @IsString() paymentSchedule?: string;
  @IsOptional() @IsString() refundPolicy?: string;
  @IsOptional() @IsString() feeHikePolicy?: string;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgramFeeBreakdownDto)
  programBreakdown?: ProgramFeeBreakdownDto[];
}

/* ─── Infrastructure ─── */
export class UniversityInfrastructureDto {
  @IsOptional() @IsNumber() @Min(0) hospitalBeds?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) departments?: string[];
  @IsOptional() @IsString() librarySize?: string;
  @IsOptional() @IsNumber() @Min(0) hostelBoys?: number;
  @IsOptional() @IsNumber() @Min(0) hostelGirls?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) laboratories?: string[];
  @IsOptional() @IsNumber() @Min(0) campusArea?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) facilities?: string[];
  @IsOptional() @IsBoolean() cafeteria?: boolean;
  @IsOptional() @IsBoolean() wifiCampus?: boolean;
  @IsOptional() @IsBoolean() transportation?: boolean;
}

/* ─── Admission ─── */
export class ProgramEligibilityDto {
  @IsString() minimumMarks!: string;
  @IsString() eligibility!: string;
}

export class UniversityAdmissionDto {
  @IsOptional() @IsArray() @IsString({ each: true }) entranceExams?: string[];
  @IsOptional() @IsString() minimumMarks?: string;
  @IsOptional() @IsString() ageCriteria?: string;
  @IsOptional() @IsString() eligibility?: string;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgramEligibilityDto)
  programEligibility?: ProgramEligibilityDto[];
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredDocuments?: string[];
  @IsOptional() @IsDateString() applicationDeadline?: string;
  @IsOptional() @IsNumber() @Min(0) applicationFee?: number;
  @IsOptional() @IsString() selectionProcess?: string;
  @IsOptional() @IsString() reservationPolicy?: string;
}

/* ─── Support ─── */
export class UniversitySupportDto {
  @IsOptional() @IsNumber() @Min(0) @Max(100) placementRate?: number;
  @IsOptional() @IsNumber() @Min(0) averagePackage?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) topRecruiters?: string[];
  @IsOptional() @IsBoolean() alumniNetwork?: boolean;
  @IsOptional() @IsNumber() @Min(0) alumniCount?: number;
  @IsOptional() @IsBoolean() internationalStudentSupport?: boolean;
  @IsOptional() @IsBoolean() visaAssistance?: boolean;
  @IsOptional() @IsArray() @IsString({ each: true }) languageSupport?: string[];
  @IsOptional() @IsBoolean() counselingServices?: boolean;
  @IsOptional() @IsBoolean() careerGuidance?: boolean;
}

/* ─── Content ─── */
export class UniversityContentDto {
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() longDescription?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) highlights?: string[];
  @IsOptional() @IsString() whyChooseUs?: string;
  @IsOptional() @IsArray() @IsUrl({}, { each: true }) gallery?: string[];
  @IsOptional() @IsUrl() virtualTour?: string;
}

/* ─── Student Demographics ─── */
export class ForeignStudentBreakdownDto {
  @IsString() country!: string;
  @IsNumber() @Min(0) count!: number;
}

export class StudentDemographicsDto {
  @IsOptional() @IsNumber() @Min(0) totalStudents?: number;
  @IsOptional() @IsNumber() @Min(0) localStudents?: number;
  @IsOptional() @IsNumber() @Min(0) foreignStudents?: number;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ForeignStudentBreakdownDto)
  foreignByCountry?: ForeignStudentBreakdownDto[];
}

/* ─── Social Links ─── */
export class SocialLinksDto {
  @IsOptional() @IsUrl() facebook?: string;
  @IsOptional() @IsUrl() instagram?: string;
  @IsOptional() @IsUrl() youtube?: string;
  @IsOptional() @IsUrl() linkedin?: string;
  @IsOptional() @IsUrl() twitter?: string;
  @IsOptional() @IsUrl() tiktok?: string;
}

/* ─── Admin ─── */
export class UniversityAdminDto {
  @IsOptional() @IsString() pocName?: string;
  @IsOptional() @IsString() pocDesignation?: string;
  @IsOptional() @IsEmail() pocEmail?: string;
  @IsOptional() @IsString() pocPhone?: string;
  @IsOptional() @IsString() phoneCountryCode?: string;
  @IsOptional() @IsString() phoneNumber?: string;
  @IsOptional() @IsString() accountName?: string;
  @IsOptional() @IsString() accountNumber?: string;
  @IsOptional() @IsString() bankName?: string;
  @IsOptional() @IsString() bankBranch?: string;
  @IsOptional() @IsString() ifscCode?: string;
  @IsOptional() @IsString() gstNumber?: string;
  @IsOptional() @IsString() panNumber?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(100) commission?: number;
  @IsOptional() @IsString() bankCountry?: string;
  @IsOptional() @IsObject() bankDetails?: any;
}
