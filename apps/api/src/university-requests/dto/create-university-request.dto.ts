import { IsString, IsOptional, IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUniversityRequestDto {
  @IsString()
  @IsNotEmpty()
  universityName!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsArray()
  @IsString({ each: true })
  programs!: string[];

  @IsString()
  @IsOptional()
  otherPrograms?: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail!: string;

  @IsString()
  @IsNotEmpty()
  contactPhone!: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;
}
