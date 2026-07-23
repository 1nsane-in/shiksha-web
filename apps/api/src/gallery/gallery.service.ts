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

  async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.galleryImage.count(),
    ]);
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async uploadImage(file: Express.Multer.File, title?: string, duration?: number) {
    const type = file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE';
    const uploadResult = await this.storage.upload(file, 'gallery-images');
    const result = await this.prisma.galleryImage.create({
      data: {
        id: randomUUID(),
        title: title || file.originalname,
        url: uploadResult.url,
        key: uploadResult.key,
        type,
        duration: type === 'VIDEO' ? (duration ?? null) : null,
        updatedAt: new Date(),
      },
    });
    return result;
  }

  async deleteImage(id: string) {
    const image = await this.prisma.galleryImage.findUnique({
      where: { id },
    });
    if (!image) {
      throw new NotFoundException('Gallery image not found');
    }
    await this.storage.delete(image.key);
    const result = await this.prisma.galleryImage.delete({
      where: { id },
    });
    return result;
  }
}
