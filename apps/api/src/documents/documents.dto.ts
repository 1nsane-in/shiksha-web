import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  documentTypeId!: string;

  @IsString()
  fileUrl!: string;

  @IsString()
  fileName!: string;

  @IsNumber()
  fileSize!: number;
}

export class VerifyDocumentDto {
  @IsEnum(['APPROVED', 'REJECTED'])
  status!: 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CreateDocumentTypeDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  requiredForStage!: number;
}

export class UpdateDocumentTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  requiredForStage?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
