import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty({
    description: 'Section title',
    example: 'Introduction to Medicine',
  })
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    description: 'Section description',
    example: 'Overview of medical studies',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Course ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  courseId!: string;

  @ApiPropertyOptional({ description: 'Section order', example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;
}
