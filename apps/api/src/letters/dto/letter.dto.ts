import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class UploadLetterDto {
  @IsUUID()
  applicationId: string;

  @IsString()
  fileUrl: string;

  @IsOptional()
  @IsString()
  fileName?: string;
}

export class UpdateLetterDto {
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsBoolean()
  isDownloadable?: boolean;
}

export class LetterResponseDto {
  id: string;
  applicationId: string;
  fileUrl: string;
  fileName?: string;
  uploadedBy: string;
  uploadedAt: Date;
  viewCount: number;
  downloadCount: number;
  isDownloadable?: boolean;
  lastViewedAt?: Date;
  lastDownloadedAt?: Date;
}