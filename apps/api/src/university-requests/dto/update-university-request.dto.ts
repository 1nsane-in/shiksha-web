import { PartialType } from '@nestjs/mapped-types';
import { CreateUniversityRequestDto } from './create-university-request.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UniversityRequestStatus } from '@prisma/client';

export class UpdateUniversityRequestDto extends PartialType(
  CreateUniversityRequestDto,
) {
  @IsEnum(UniversityRequestStatus)
  @IsOptional()
  status?: UniversityRequestStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}
