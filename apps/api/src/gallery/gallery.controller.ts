import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
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

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  @Public()
  async getGallery() {
    return this.galleryService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, callback) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/webp',
          'image/gif',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Unsupported file type: ' +
                file.mimetype +
                '. Allowed: JPEG, PNG, JPG, WEBP, GIF',
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
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.galleryService.uploadImage(file, title);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async deleteImage(@Param('id') id: string) {
    return this.galleryService.deleteImage(id);
  }
}
