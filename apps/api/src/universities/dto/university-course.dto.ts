import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @IsString() name!: string;
  @IsNumber() @Min(1) duration!: number;
  @IsNumber() @Min(0) fees!: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() eligibility?: string;
  @IsOptional() @IsNumber() @Min(0) seats?: number;
}

export class UpdateCourseDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsNumber() @Min(1) duration?: number;
  @IsOptional() @IsNumber() @Min(0) fees?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() eligibility?: string;
  @IsOptional() @IsNumber() @Min(0) seats?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
