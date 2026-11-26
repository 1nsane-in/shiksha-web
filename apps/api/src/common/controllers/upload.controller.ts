import {
  Controller,
  Post,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { StorageService } from '../services/storage.service';
import { SAFE_UPLOAD_MIMES } from '../helpers/file-type';
import { AuthUser } from '../../auth/decorators/user.decorator';
import type { AuthenticatedUser } from '../types/request.type';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly storage: StorageService) {}

  @Post()
  @Roles('STUDENT', 'ADMIN', 'SUPER_ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 55 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const allowedMimes: readonly string[] = SAFE_UPLOAD_MIMES;
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Unsupported file type. Allowed: JPEG, PNG, GIF, WebP, MP4, WebM, MOV, PDF, DOC, DOCX',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: AuthenticatedUser,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const allowed = [
      'logos',
      'banners',
      'brochures',
      'documents',
      'gallery',
      'gallery-images',
      'video-tours',
      'avatars',
      'uploads',
      'admission-letters',
      'invitation-letters',
    ];
    // Students may only upload into their own documents folder — the server
    // picks the folder, the client cannot choose a destination.
    if (user.role === 'STUDENT') {
      return this.storage.upload(file, 'documents', user.id);
    }
    // Allow subfolder patterns: "gallery/abc-123" matches "gallery" prefix
    const target = allowed.includes(folder || '')
      ? folder!
      : allowed.some((a) => folder?.startsWith(a + '/'))
        ? folder!
        : 'uploads';
    return this.storage.upload(file, target, user.id);
  }

  @Delete()
  @Roles('ADMIN', 'SUPER_ADMIN')
  async deleteFile(@Query('key') key: string) {
    if (!key) {
      throw new BadRequestException('No key provided');
    }
    await this.storage.delete(key);
    return { success: true };
  }
}
