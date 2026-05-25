import { IsString, IsOptional, IsDateString, IsNumber, IsEnum, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleExamDto {
  @ApiProperty()
  @IsUUID()
  applicationId: string;

  @ApiProperty()
  @IsDateString()
  examDate: string;

  @ApiProperty()
  @IsString()
  examSubject: string;

  @ApiProperty()
  @IsString()
  examCenter: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  attemptNumber?: number;
}

export class DeclareExamResultDto {
  @ApiProperty()
  @IsUUID()
  examId: string;

  @ApiProperty({ enum: ['PASSED', 'FAILED'] })
  @IsString()
  result: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class ExamResponseDto {
  id: string;
  applicationId: string;
  examDate?: Date;
  examSubject?: string;
  examCenter?: string;
  result?: string;
  resultDeclaredAt?: Date;
  resultRemarks?: string;
  attemptNumber: number;
}