import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { StorageService } from '../common/services/storage.service';

@Injectable()
export class GalleryService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private redis: RedisService,
  ) {}

  async getAll() {
    return this.redis.getOrSet(
      'gallery:images:all',
      () => this.prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      3600, // Cache for 1 hour
    );
  }

  async uploadImage(file: Express.Multer.File, title?: string) {
    // Store in a separate folder named "gallery-images"
    const uploadResult = await this.storage.upload(file, 'gallery-images');
    const result = await this.prisma.galleryImage.create({
      data: {
        id: randomUUID(),
        title: title || file.originalname,
        url: uploadResult.url,
        key: uploadResult.key,
        updatedAt: new Date(),
      },
    });
    
    // Invalidate gallery cache
    await this.redis.del('gallery:images:all');
    
    return result;
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
    const result = await this.prisma.galleryImage.delete({
      where: { id },
    });
    
    // Invalidate gallery cache
    await this.redis.del('gallery:images:all');
    
    return result;
  }
}
