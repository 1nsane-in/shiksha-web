import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSectionDto {
  @ApiPropertyOptional({
    description: 'Section title',
    example: 'Updated Introduction',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Section description',
    example: 'Updated overview',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Section order', example: 2 })
  @IsNumber()
  @IsOptional()
  order?: number;
}
