import { IsUUID, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty({ example: 'Introduction to Programming' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'An introduction to programming concepts' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  courseId!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order!: number;
}

export class UpdateSectionDto {
  @ApiProperty({ example: 'Advanced Programming Concepts' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Advanced concepts in programming' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  courseId?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsOptional()
  order?: number;
}
