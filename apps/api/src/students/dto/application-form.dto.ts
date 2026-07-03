import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsObject,
  MaxLength,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PlaceOfBirthDto {
  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;
}

export class LanguageAbilityDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(['high', 'moderate', 'low'])
  speaking!: 'high' | 'moderate' | 'low';

  @IsEnum(['high', 'moderate', 'low'])
  reading!: 'high' | 'moderate' | 'low';

  @IsEnum(['high', 'moderate', 'low'])
  writing!: 'high' | 'moderate' | 'low';
}

export class SubmitApplicationFormDto {
  @IsString()
  @IsNotEmpty()
  universityId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  middleName?: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PlaceOfBirthDto)
  placeOfBirth!: PlaceOfBirthDto;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  citizenship!: string;

  @IsEnum(['single', 'married'])
  maritalStatus!: 'single' | 'married';

  @IsEnum(['male', 'female', 'other'])
  gender!: 'male' | 'female' | 'other';

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  permanentAddress!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  permanentCity!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  permanentState!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  permanentZip!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  permanentCountry!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  embassyLocation!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LanguageAbilityDto)
  language1!: LanguageAbilityDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LanguageAbilityDto)
  language2?: LanguageAbilityDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  otherLanguages?: string[];

  @IsEnum(['pre-medical', 'general-medicine', 'dentistry', 'post-graduate'])
  selectedProgram!:
    | 'pre-medical'
    | 'general-medicine'
    | 'dentistry'
    | 'post-graduate';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  postGraduateDetail?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  signature!: string;

  @IsDateString()
  signatureDate!: string;
}

export class UpdateApplicationStatusDto {
  @IsString()
  @IsNotEmpty()
  status!: string;
}

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsObject()
  formData?: Record<string, unknown>;
}
