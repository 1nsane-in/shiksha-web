import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateConsultationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(720)
  neetScore?: number;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  preferredUniversity?: string;

  @IsString()
  @IsOptional()
  preferredIntake?: string;
}
