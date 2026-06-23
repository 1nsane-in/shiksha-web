import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to Computer Science' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'CS101' })
  @IsString()
  code!: string;

  @ApiProperty({
    example: 'An introductory course to computer science fundamentals',
  })
  @IsString()
  description!: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  credits!: number;

  @ApiProperty({ example: '2023-09-01' })
  @IsDateString()
  startDate!: Date;

  @ApiProperty({ example: '2023-12-31' })
  @IsDateString()
  endDate!: Date;

  @ApiProperty({ example: ['Programming Fundamentals', 'Data Structures'] })
  @IsArray()
  @IsString({ each: true })
  prerequisites!: string[];

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  department!: string;

  @ApiProperty({ example: 'Dr. John Smith' })
  @IsString()
  instructor!: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  maxStudents!: number;

  @ApiProperty({ example: 'Online' })
  @IsString()
  deliveryMethod!: string;

  @ApiProperty({ example: ['Lecture', 'Lab'] })
  @IsArray()
  @IsString({ each: true })
  courseTypes!: string[];
}
