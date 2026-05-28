import { IsString, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';

export class UpdateStudentProfileDto {
  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  motherName?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsString()
  passportNumber?: string;

  @IsOptional()
  @IsDateString()
  passportExpiry?: string;

  @IsOptional()
  @IsDateString()
  passportIssueDate?: string;

  @IsOptional()
  @IsString()
  passportIssueCountry?: string;
}

export class UpdateAcademicDto {
  @IsOptional()
  @IsNumber()
  neetScore?: number;

  @IsOptional()
  @IsNumber()
  neetRank?: number;

  @IsOptional()
  @IsNumber()
  twelfthPercentage?: number;
}

export class AdminUpdateStudentDto extends UpdateStudentProfileDto {
  @IsOptional()
  @IsNumber()
  currentStage?: number;

  @IsOptional()
  @IsEnum([
    'NOT_STARTED',
    'STAGE_1_PENDING',
    'STAGE_1_IN_REVIEW',
    'STAGE_1_APPROVED',
    'STAGE_2_PENDING',
    'STAGE_2_IN_REVIEW',
    'STAGE_2_APPROVED',
    'STAGE_3_ACTIVE',
    'STAGE_4_PENDING',
    'STAGE_4_APPROVED',
    'STAGE_5_UNLOCKED',
    'COMPLETED',
    'REJECTED',
  ])
  applicationStatus?: string;
}

export class AssignUniversityDto {
  @IsString()
  courseId: string;
}
