import { IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { UniversityDocType } from './university-enums';

export class UploadUniversityDocumentDto {
  @IsEnum(UniversityDocType) type!: UniversityDocType;
  /** Bucket key returned by POST /upload (never a client URL). */
  @IsString() fileKey!: string;
  @IsString() fileName!: string;
  @IsNumber() @Min(1) fileSize!: number;
}
