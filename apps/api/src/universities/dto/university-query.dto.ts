import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UniversityType, UniversityStatus } from './university-enums';

export class UniversityQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() limit?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsEnum(UniversityStatus) status?: UniversityStatus;
  @IsOptional() @IsEnum(UniversityType) type?: UniversityType;
  @IsOptional() @IsString() search?: string;
}
