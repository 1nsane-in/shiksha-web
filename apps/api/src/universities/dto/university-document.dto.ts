import { IsString, IsNumber, IsEnum, Min, IsUrl } from 'class-validator';
import { UniversityDocType } from './university-enums';

export class UploadUniversityDocumentDto {
  @IsEnum(UniversityDocType) type!: UniversityDocType;
  @IsUrl() fileUrl!: string;
  @IsString() fileName!: string;
  @IsNumber() @Min(1) fileSize!: number;
}
