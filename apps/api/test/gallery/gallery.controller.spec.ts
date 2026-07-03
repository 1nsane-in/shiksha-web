import { Test, TestingModule } from '@nestjs/testing';
import { GalleryController } from '../../src/gallery/gallery.controller';
import { GalleryService } from '../../src/gallery/gallery.service';
import { BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/auth/guards/roles.guard';

const mockGalleryService = {
  getAll: jest.fn(),
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
};

describe('GalleryController', () => {
  let controller: GalleryController;
  let service: typeof mockGalleryService;

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
      controllers: [GalleryController],
      providers: [
        { provide: GalleryService, useValue: mockGalleryService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<GalleryController>(GalleryController);
    service = mockGalleryService;
  });

  describe('GET /gallery (getGallery)', () => {
    it('should return all gallery images', async () => {
      const mockResult = [{ id: 'img-1', title: 'Test' }];
      service.getAll.mockResolvedValue(mockResult);

      const result = await controller.getGallery();

      expect(result).toEqual(mockResult);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('POST /gallery (uploadImage)', () => {
    it('should throw BadRequestException when no file provided', async () => {
      await expect(
        controller.uploadImage(undefined as unknown as Express.Multer.File, 'title'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should upload image with title', async () => {
      const mockResult = { id: 'img-1', title: 'My Title' };
      service.uploadImage.mockResolvedValue(mockResult);

      const result = await controller.uploadImage(mockFile, 'My Title');

      expect(result).toEqual(mockResult);
      expect(service.uploadImage).toHaveBeenCalledWith(mockFile, 'My Title');
    });

    it('should upload image without title', async () => {
      const mockResult = { id: 'img-1', title: 'test.jpg' };
      service.uploadImage.mockResolvedValue(mockResult);

      const result = await controller.uploadImage(mockFile, undefined);

      expect(result).toEqual(mockResult);
      expect(service.uploadImage).toHaveBeenCalledWith(mockFile, undefined);
    });
  });

  describe('DELETE /gallery/:id (deleteImage)', () => {
    it('should delete an image by id', async () => {
      const mockResult = { id: 'img-1' };
      service.deleteImage.mockResolvedValue(mockResult);

      const result = await controller.deleteImage('img-1');

      expect(result).toEqual(mockResult);
      expect(service.deleteImage).toHaveBeenCalledWith('img-1');
    });
  });
});
