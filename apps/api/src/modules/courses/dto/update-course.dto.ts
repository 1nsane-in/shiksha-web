import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Advanced Computer Science' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'CS201' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ example: 'An advanced course to computer science' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 12 })
  @IsNumber()
  @IsOptional()
  credits?: number;

  @ApiPropertyOptional({ example: '2023-09-01' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2023-12-31' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({
    example: ['Programming Fundamentals', 'Data Structures', 'Algorithms'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  prerequisites?: string[];

  @ApiPropertyOptional({ example: 'Computer Science' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'Dr. Jane Doe' })
  @IsString()
  @IsOptional()
  instructor?: string;

  @ApiPropertyOptional({ example: 35 })
  @IsNumber()
  @IsOptional()
  maxStudents?: number;

  @ApiPropertyOptional({ example: 'Hybrid' })
  @IsString()
  @IsOptional()
  deliveryMethod?: string;

  @ApiPropertyOptional({ example: ['Lecture', 'Lab', 'Seminar'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  courseTypes?: string[];
}
