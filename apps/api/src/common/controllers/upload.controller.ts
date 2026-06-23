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

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly storage: StorageService) {}

  @Post()
  @Roles('STUDENT', 'ADMIN', 'SUPER_ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Unsupported file type: ' +
                file.mimetype +
                '. Allowed: JPEG, PNG, PDF, DOC, DOCX',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
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
      'avatars',
      'uploads',
      'admission-letters',
      'invitation-letters',
    ];
    const target = allowed.includes(folder || '') ? folder! : 'uploads';
    return this.storage.upload(file, target);
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
