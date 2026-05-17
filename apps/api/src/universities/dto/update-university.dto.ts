import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsUrl,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UniversityType, UniversityStatus } from './university-enums';
import {
  UniversityLocationDto,
  UniversityContactDto,
  UniversityAcademicDto,
  UniversityRecognitionDto,
  UniversityFeesDto,
  UniversityInfrastructureDto,
  UniversityAdmissionDto,
  UniversitySupportDto,
  UniversityContentDto,
  UniversityAdminDto,
} from './university-sub-dtos';

export class UpdateUniversityDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() shortName?: string;
  @IsOptional() @IsNumber() @Min(1800) @Max(new Date().getFullYear()) establishedYear?: number;
  @IsOptional() @IsEnum(UniversityType) type?: UniversityType;
  @IsOptional() @IsUrl() website?: string;
  @IsOptional() @IsUrl() logo?: string;
  @IsOptional() @IsUrl() bannerImage?: string;
  @IsOptional() @IsEnum(UniversityStatus) status?: UniversityStatus;

  @IsOptional() @ValidateNested() @Type(() => UniversityLocationDto) location?: UniversityLocationDto;
  @IsOptional() @ValidateNested() @Type(() => UniversityContactDto) contact?: UniversityContactDto;
  @IsOptional() @ValidateNested() @Type(() => UniversityAcademicDto) academic?: UniversityAcademicDto;
  @IsOptional() @ValidateNested() @Type(() => UniversityRecognitionDto) recognition?: UniversityRecognitionDto;
  @IsOptional() @ValidateNested() @Type(() => UniversityFeesDto) fees?: UniversityFeesDto;
  @IsOptional() @ValidateNested() @Type(() => UniversityInfrastructureDto) infrastructure?: UniversityInfrastructureDto;
  @IsOptional() @ValidateNested() @Type(() => UniversityAdmissionDto) admission?: UniversityAdmissionDto;
  @IsOptional() @ValidateNested() @Type(() => UniversitySupportDto) support?: UniversitySupportDto;
  @IsOptional() @ValidateNested() @Type(() => UniversityContentDto) content?: UniversityContentDto;
  @IsOptional() @ValidateNested() @Type(() => UniversityAdminDto) admin?: UniversityAdminDto;
}
