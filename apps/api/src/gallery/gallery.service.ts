import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/services/storage.service';

@Injectable()
export class GalleryService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async getAll() {
    return this.prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async uploadImage(file: Express.Multer.File, title?: string) {
    // Store in a separate folder named "gallery-images"
    const uploadResult = await this.storage.upload(file, 'gallery-images');
    return this.prisma.galleryImage.create({
      data: {
        title: title || file.originalname,
        url: uploadResult.url,
        key: uploadResult.key,
      },
    });
  }

  async deleteImage(id: string) {
    const image = await this.prisma.galleryImage.findUnique({
      where: { id },
    });
    if (!image) {
      throw new NotFoundException('Gallery image not found');
    }
    // Delete from R2 storage
    await this.storage.delete(image.key);
    // Delete from database
    return this.prisma.galleryImage.delete({
      where: { id },
    });
  }
}
