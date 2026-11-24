import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { SAFE_UPLOAD_MIMES } from '../common/helpers/file-type';

const ALLOWED_MIMES: readonly string[] = SAFE_UPLOAD_MIMES.filter(
  (mime) => mime.startsWith('image/') || mime.startsWith('video/'),
);

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  @Public()
  async getGallery(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.galleryService.getAll(
      page ? Math.max(1, parseInt(page, 10)) : 1,
      limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : 12,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 55 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        if (ALLOWED_MIMES.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Unsupported file type. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM, MOV',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title?: string,
    @Body('duration') duration?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.galleryService.uploadImage(
      file,
      title,
      duration ? parseInt(duration, 10) : undefined,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async deleteImage(@Param('id') id: string) {
    return this.galleryService.deleteImage(id);
  }
}
