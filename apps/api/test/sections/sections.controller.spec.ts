import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { SectionsController } from '../../src/modules/sections/sections.controller';
import { SectionsService } from '../../src/modules/sections/sections.service';

const mockSectionsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('SectionsController', () => {
  let controller: SectionsController;
  let service: typeof mockSectionsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionsController],
      providers: [
        { provide: SectionsService, useValue: mockSectionsService },
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        Reflector,
      ],
    }).compile();

    controller = module.get<SectionsController>(SectionsController);
    service = mockSectionsService;
  });

  describe('POST /', () => {
    it('should create a section', async () => {
      const dto = { title: 'Introduction', courseId: 'course-1' };
      service.create.mockResolvedValue({ id: 'sec-1', ...dto });

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('sec-1');
    });
  });

  describe('GET /', () => {
    it('should return all sections', async () => {
      service.findAll.mockResolvedValue([{ id: 'sec-1', title: 'Intro' }]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 'sec-1', title: 'Intro' }]);
    });
  });

  describe('GET /:id', () => {
    it('should return a section by id', async () => {
      service.findOne.mockResolvedValue({ id: 'sec-1', title: 'Intro' });

      const result = await controller.findOne('sec-1');

      expect(service.findOne).toHaveBeenCalledWith('sec-1');
      expect(result.id).toBe('sec-1');
    });
  });

  describe('PUT /:id', () => {
    it('should update a section', async () => {
      service.update.mockResolvedValue({ id: 'sec-1', title: 'Updated' });

      const result = await controller.update('sec-1', { title: 'Updated' });

      expect(service.update).toHaveBeenCalledWith('sec-1', { title: 'Updated' });
      expect(result.title).toBe('Updated');
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a section', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('sec-1');

      expect(service.remove).toHaveBeenCalledWith('sec-1');
    });
  });
});
