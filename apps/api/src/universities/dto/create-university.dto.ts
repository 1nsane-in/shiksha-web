import {
  IsString,
  IsNumber,
  IsEnum,
  IsUrl,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UniversityType } from './university-enums';
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

export class CreateUniversityDto {
  @IsString() name: string;
  @IsString() shortName: string;
  @IsNumber() @Min(1800) @Max(new Date().getFullYear()) establishedYear: number;
  @IsEnum(UniversityType) type: UniversityType;
  @IsUrl() website: string;
  @IsUrl() logo: string;
  @IsUrl() bannerImage: string;

  @ValidateNested() @Type(() => UniversityLocationDto) location: UniversityLocationDto;
  @ValidateNested() @Type(() => UniversityContactDto) contact: UniversityContactDto;
  @ValidateNested() @Type(() => UniversityAcademicDto) academic: UniversityAcademicDto;
  @ValidateNested() @Type(() => UniversityRecognitionDto) recognition: UniversityRecognitionDto;
  @ValidateNested() @Type(() => UniversityFeesDto) fees: UniversityFeesDto;
  @ValidateNested() @Type(() => UniversityInfrastructureDto) infrastructure: UniversityInfrastructureDto;
  @ValidateNested() @Type(() => UniversityAdmissionDto) admission: UniversityAdmissionDto;
  @ValidateNested() @Type(() => UniversitySupportDto) support: UniversitySupportDto;
  @ValidateNested() @Type(() => UniversityContentDto) content: UniversityContentDto;
  @ValidateNested() @Type(() => UniversityAdminDto) admin: UniversityAdminDto;
}
