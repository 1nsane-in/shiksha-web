import { Test, TestingModule } from '@nestjs/testing';
import { GalleryService } from '../../src/gallery/gallery.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { RedisService } from '../../src/redis/redis.service';
import { StorageService } from '../../src/common/services/storage.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  galleryImage: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
};

const mockRedis = {
  getOrSet: jest.fn(),
  del: jest.fn(),
};

const mockStorage = {
  upload: jest.fn(),
  delete: jest.fn(),
};

describe('GalleryService', () => {
  let service: GalleryService;
  let prisma: typeof mockPrisma;
  let redis: typeof mockRedis;
  let storage: typeof mockStorage;

  const mockImage = {
    id: 'img-1',
    title: 'Test Image',
    url: 'https://r2.example.com/gallery-img.jpg',
    key: 'gallery-images/img-1.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFile = {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test'),
    size: 1024,
  } as Express.Multer.File;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GalleryService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: StorageService, useValue: mockStorage },
      ],
    }).compile();

    service = module.get<GalleryService>(GalleryService);
    prisma = mockPrisma;
    redis = mockRedis;
    storage = mockStorage;
  });

  describe('getAll', () => {
    it('should return cached images from redis', async () => {
      redis.getOrSet.mockResolvedValue([mockImage]);

      const result = await service.getAll();

      expect(result).toEqual([mockImage]);
      expect(redis.getOrSet).toHaveBeenCalledWith(
        'gallery:images:all',
        expect.any(Function),
        3600,
      );
    });

    it('should fetch from prisma on cache miss', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown[]>) => factory(),
      );
      prisma.galleryImage.findMany.mockResolvedValue([mockImage]);

      const result = await service.getAll();

      expect(result).toEqual([mockImage]);
      expect(prisma.galleryImage.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('uploadImage', () => {
    const uploadResult = {
      url: 'https://r2.example.com/gallery-img.jpg',
      key: 'gallery-images/test.jpg',
    };

    it('should upload file and create db record with title', async () => {
      storage.upload.mockResolvedValue(uploadResult);
      prisma.galleryImage.create.mockResolvedValue(mockImage);

      const result = await service.uploadImage(mockFile, 'My Title');

      expect(storage.upload).toHaveBeenCalledWith(mockFile, 'gallery-images');
      expect(prisma.galleryImage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          id: expect.any(String),
          title: 'My Title',
          url: uploadResult.url,
          key: uploadResult.key,
        }),
      });
      expect(result).toEqual(mockImage);
    });

    it('should use original filename as title when not provided', async () => {
      storage.upload.mockResolvedValue(uploadResult);
      prisma.galleryImage.create.mockResolvedValue(mockImage);

      await service.uploadImage(mockFile);

      expect(prisma.galleryImage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'test.jpg',
        }),
      });
    });

    it('should invalidate gallery cache after upload', async () => {
      storage.upload.mockResolvedValue(uploadResult);
      prisma.galleryImage.create.mockResolvedValue(mockImage);

      await service.uploadImage(mockFile, 'My Title');

      expect(redis.del).toHaveBeenCalledWith('gallery:images:all');
    });
  });

  describe('deleteImage', () => {
    it('should throw NotFoundException when image not found', async () => {
      prisma.galleryImage.findUnique.mockResolvedValue(null);

      await expect(service.deleteImage('bad-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.galleryImage.findUnique).toHaveBeenCalledWith({
        where: { id: 'bad-id' },
      });
    });

    it('should delete from storage and db, then invalidate cache', async () => {
      prisma.galleryImage.findUnique.mockResolvedValue(mockImage);
      storage.delete.mockResolvedValue(undefined);
      prisma.galleryImage.delete.mockResolvedValue(mockImage);

      const result = await service.deleteImage('img-1');

      expect(storage.delete).toHaveBeenCalledWith(mockImage.key);
      expect(prisma.galleryImage.delete).toHaveBeenCalledWith({
        where: { id: 'img-1' },
      });
      expect(redis.del).toHaveBeenCalledWith('gallery:images:all');
      expect(result).toEqual(mockImage);
    });
  });
});
