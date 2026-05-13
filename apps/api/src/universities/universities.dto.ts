import { IsString, IsOptional, IsNumber, IsBoolean, Min, IsUrl } from 'class-validator';

export class CreateUniversityDto {
  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}

export class UpdateUniversityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

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
