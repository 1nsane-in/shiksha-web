import { Test, TestingModule } from '@nestjs/testing';
import { SectionsService } from '../../src/modules/sections/sections.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockPrisma = {
  section: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('SectionsService', () => {
  let service: SectionsService;
  let prisma: typeof mockPrisma;

  const mockSection = {
    id: 'sec-1',
    title: 'Introduction',
    description: 'Overview',
    courseId: 'course-1',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SectionsService>(SectionsService);
    prisma = mockPrisma;
  });

  describe('create', () => {
    it('should create a section', async () => {
      prisma.section.findUnique.mockResolvedValue(null);
      prisma.section.create.mockResolvedValue(mockSection);

      const result = await service.create({
        title: 'Introduction',
        description: 'Overview',
        courseId: 'course-1',
        order: 1,
      });

      expect(prisma.section.findUnique).toHaveBeenCalledWith({
        where: { courseId_title: { courseId: 'course-1', title: 'Introduction' } },
      });
      expect(prisma.section.create).toHaveBeenCalledWith({
        data: { title: 'Introduction', description: 'Overview', courseId: 'course-1', order: 1 },
      });
      expect(result).toEqual(mockSection);
    });

    it('should throw ConflictException when title already exists for course', async () => {
      prisma.section.findUnique.mockResolvedValue(mockSection);

      await expect(
        service.create({ title: 'Introduction', courseId: 'course-1' }),
      ).rejects.toThrow(ConflictException);

      expect(prisma.section.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all sections ordered by order asc', async () => {
      prisma.section.findMany.mockResolvedValue([mockSection]);

      const result = await service.findAll();

      expect(prisma.section.findMany).toHaveBeenCalledWith({
        orderBy: { order: 'asc' },
      });
      expect(result).toEqual([mockSection]);
    });

    it('should return empty array when no sections', async () => {
      prisma.section.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a section by id', async () => {
      prisma.section.findUnique.mockResolvedValue(mockSection);

      const result = await service.findOne('sec-1');

      expect(prisma.section.findUnique).toHaveBeenCalledWith({ where: { id: 'sec-1' } });
      expect(result).toEqual(mockSection);
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.section.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a section', async () => {
      prisma.section.findUnique
        .mockResolvedValueOnce(mockSection)   // existing check
        .mockResolvedValueOnce(null);          // duplicate check (no conflict)
      prisma.section.update.mockResolvedValue({ ...mockSection, title: 'Updated Title' });

      const result = await service.update('sec-1', { title: 'Updated Title' });

      expect(prisma.section.update).toHaveBeenCalledWith({
        where: { id: 'sec-1' },
        data: { title: 'Updated Title' },
      });
      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.section.findUnique.mockResolvedValue(null);

      await expect(service.update('bad-id', { title: 'X' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when new title conflicts', async () => {
      prisma.section.findUnique
        .mockResolvedValueOnce(mockSection)  // exists
        .mockResolvedValueOnce({ id: 'sec-2', title: 'Existing', courseId: 'course-1' }); // duplicate

      await expect(service.update('sec-1', { title: 'Existing' })).rejects.toThrow(ConflictException);

      expect(prisma.section.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a section', async () => {
      prisma.section.findUnique.mockResolvedValue(mockSection);
      prisma.section.delete.mockResolvedValue(mockSection);

      await service.remove('sec-1');

      expect(prisma.section.findUnique).toHaveBeenCalledWith({ where: { id: 'sec-1' } });
      expect(prisma.section.delete).toHaveBeenCalledWith({ where: { id: 'sec-1' } });
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.section.findUnique.mockResolvedValue(null);

      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);

      expect(prisma.section.delete).not.toHaveBeenCalled();
    });
  });
});
