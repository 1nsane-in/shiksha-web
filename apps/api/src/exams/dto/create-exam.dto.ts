import { IsString, IsOptional, IsDate, IsNumber, IsBoolean, IsEnum, IsUUID, Min, Max, ValidateNested, ArrayMinSize, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionType, QuestionDifficulty } from '../types/exam.types';

export class CreateExamDto {
  @ApiProperty({ description: 'Exam name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Exam description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'University ID' })
  @IsUUID()
  universityId!: string;

  @ApiProperty({ description: 'Exam window start date' })
  @Type(() => Date)
  @IsDate()
  dateWindowStart!: Date;

  @ApiProperty({ description: 'Exam window end date' })
  @Type(() => Date)
  @IsDate()
  dateWindowEnd!: Date;

  @ApiProperty({ description: 'Exam duration in minutes' })
  @IsNumber()
  @Min(1)
  @Max(300)
  durationMinutes!: number;

  @ApiProperty({ description: 'Passing percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  passingPercentage!: number;

  @ApiPropertyOptional({ description: 'Maximum attempts allowed' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAttempts?: number;

  @ApiPropertyOptional({ description: 'Result timing: IMMEDIATE or SCHEDULED' })
  @IsOptional()
  @IsEnum(['IMMEDIATE', 'SCHEDULED'])
  resultTiming?: string;

  @ApiPropertyOptional({ description: 'Result date (for SCHEDULED results)' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  resultDate?: Date;

  @ApiPropertyOptional({ description: 'Shuffle questions' })
  @IsOptional()
  @IsBoolean()
  shuffleQuestions?: boolean;

  @ApiPropertyOptional({ description: 'Shuffle options' })
  @IsOptional()
  @IsBoolean()
  shuffleOptions?: boolean;
}

export class UpdateExamDto extends CreateExamDto {
  @ApiProperty({ description: 'Exam ID' })
  @IsUUID()
  id!: string;
}

export class QuestionOptionDto {
  @ApiProperty({ description: 'Option text' })
  @IsString()
  optionText!: string;

  @ApiProperty({ description: 'Is this option correct' })
  @IsBoolean()
  isCorrect!: boolean;
}

export class CreateQuestionDto {
  @ApiProperty({ description: 'Question type', enum: QuestionType })
  @IsEnum(QuestionType)
  type!: QuestionType;

  @ApiProperty({ description: 'Question text' })
  @IsString()
  questionText!: string;

  @ApiPropertyOptional({ description: 'Question image URL' })
  @IsOptional()
  @IsString()
  questionImageUrl?: string;

  @ApiProperty({ description: 'Marks for correct answer' })
  @IsNumber()
  @Min(0.5)
  marks!: number;

  @ApiPropertyOptional({ description: 'Negative marks for wrong answer' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  negativeMarks?: number;

  @ApiPropertyOptional({ description: 'Question difficulty', enum: QuestionDifficulty })
  @IsOptional()
  @IsEnum(QuestionDifficulty)
  difficulty?: QuestionDifficulty;

  @ApiPropertyOptional({ description: 'Question topic' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ description: 'Options for MCQ questions' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options?: QuestionOptionDto[];

  @ApiPropertyOptional({ description: 'Type-specific config (for subjective questions)' })
  @IsOptional()
  config?: {
    wordLimit?: number;
    keywords?: string[];
    manualReview?: boolean;
  };
}

export class UpdateQuestionDto extends CreateQuestionDto {
  @ApiProperty({ description: 'Question ID' })
  @IsUUID()
  id!: string;
}

export class ReorderQuestionsDto {
  @ApiProperty({ description: 'Array of question IDs in new order' })
  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  questionIds!: string[];
}

export class ProctoringConfigDto {
  @ApiPropertyOptional({ description: 'Enable AI proctoring' })
  @IsOptional()
  @IsBoolean()
  aiProctoringEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Require webcam' })
  @IsOptional()
  @IsBoolean()
  webcamRequired?: boolean;

  @ApiPropertyOptional({ description: 'Require microphone' })
  @IsOptional()
  @IsBoolean()
  microphoneRequired?: boolean;

  @ApiPropertyOptional({ description: 'Enable screen recording' })
  @IsOptional()
  @IsBoolean()
  screenRecordingEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable face detection' })
  @IsOptional()
  @IsBoolean()
  faceDetectionEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable gaze tracking' })
  @IsOptional()
  @IsBoolean()
  gazeTrackingEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Number of tab switch warnings before action' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  tabSwitchWarnings?: number;

  @ApiPropertyOptional({ description: 'Auto-submit on critical violation' })
  @IsOptional()
  @IsBoolean()
  autoSubmitOnViolation?: boolean;

  @ApiPropertyOptional({ description: 'Connectivity grace period in minutes' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  connectivityGraceMinutes?: number;
}

export class PublishExamDto {
  @ApiProperty({ description: 'Exam ID' })
  @IsUUID()
  id!: string;
}
