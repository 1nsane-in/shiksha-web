import { IsUUID, IsString, IsOptional, IsBoolean, IsDateString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to Computer Science' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'CS101' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'An introductory course to computer science fundamentals' })
  @IsString()
  description: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  credits: number;

  @ApiProperty({ example: '2023-09-01' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2023-12-31' })
  @IsDateString()
  endDate: Date;

  @ApiProperty({ example: ['Programming Fundamentals', 'Data Structures'] })
  @IsArray()
  @IsString({ each: true })
  prerequisites: string[];

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  department: string;

  @ApiProperty({ example: 'Dr. John Smith' })
  @IsString()
  instructor: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  maxStudents: number;

  @ApiProperty({ example: 'Online' })
  @IsString()
  deliveryMethod: string;

  @ApiProperty({ example: ['Lecture', 'Lab'] })
  @IsArray()
  @IsString({ each: true })
  courseTypes: string[];
}

export class UpdateCourseDto {
  @ApiProperty({ example: 'Advanced Computer Science' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'CS201' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ example: 'An advanced course to computer science' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @IsOptional()
  credits?: number;

  @ApiProperty({ example: '2023-09-01' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ example: '2023-12-31' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ example: ['Programming Fundamentals', 'Data Structures', 'Algorithms'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  prerequisites?: string[];

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ example: 'Dr. Jane Doe' })
  @IsString()
  @IsOptional()
  instructor?: string;

  @ApiProperty({ example: 35 })
  @IsNumber()
  @IsOptional()
  maxStudents?: number;

  @ApiProperty({ example: 'Hybrid' })
  @IsString()
  @IsOptional()
  deliveryMethod?: string;

  @ApiProperty({ example: ['Lecture', 'Lab', 'Seminar'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  courseTypes?: string[];
}