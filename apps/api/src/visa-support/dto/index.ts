import { IsString, IsOptional, IsBoolean, IsArray, IsDateString, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateVisaCenterDto {
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiProperty() @IsString() city!: string;
  @ApiProperty() @IsString() country!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string;
}

export class UpdateVisaCenterDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

export class CreateVisaChecklistDto {
  @ApiProperty() @IsString() country!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsArray() @IsString({ each: true }) documents!: string[];
}

export class UpdateVisaChecklistDto {
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) documents?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

export class CreateVisaApplicationDto {
  @ApiProperty() @IsString() studentId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() applicationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() visaCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() checklistId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() passportNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() passportExpiry?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() visaType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() remarks?: string;
}

export class UpdateVisaApplicationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() visaCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() checklistId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() passportNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() passportExpiry?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() visaType?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) documentUrls?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() remarks?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class DecideVisaApplicationDto {
  @ApiProperty({ enum: ["APPROVED", "REJECTED"] }) decision!: "APPROVED" | "REJECTED";
  @ApiPropertyOptional() @IsOptional() @IsString() remarks?: string;
}