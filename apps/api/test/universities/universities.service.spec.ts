import { Test, TestingModule } from '@nestjs/testing';
import { UniversitiesService } from '../../src/universities/universities.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { StorageService } from '../../src/common/services/storage.service';
import { RedisService } from '../../src/redis/redis.service';
import { PaginatorService } from '../../src/common/services/paginator.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UniversityStatus, UniversityType } from '../../src/universities/universities.dto';
import { createQueryBuilder } from '../../src/common/helpers/prisma-query-builder';

const mockPrisma = {
  university: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  universityDocument: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  universityCourse: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  universityLocation: {
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
};

const mockRedis = {
  getOrSet: jest.fn(),
  del: jest.fn(),
  deletePattern: jest.fn(),
};

const mockPaginator = {
  parseOptions: jest.fn(),
  getSkip: jest.fn(),
  wrapResult: jest.fn(),
};

const mockStorage = {
  upload: jest.fn(),
  delete: jest.fn(),
  getSignedUrl: jest.fn(),
  deleteFromUrl: jest.fn().mockResolvedValue(undefined),
};

describe('UniversitiesService', () => {
  let service: UniversitiesService;
  let prisma: typeof mockPrisma;
  let redis: typeof mockRedis;
  let paginator: typeof mockPaginator;
  let storage: typeof mockStorage;

  const mockUniversity = {
    id: 'uni-1',
    name: 'Test University',
    shortName: 'TU',
    slug: 'test-university',
    establishedYear: 2000,
    type: UniversityType.GOVERNMENT,
    status: UniversityStatus.ACTIVE,
    logo: null,
    bannerImage: null,
    brochureUrl: null,
    website: 'https://test.edu',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDocument = {
    id: 'doc-1',
    universityId: 'uni-1',
    type: 'BROCHURE',
    fileUrl: 'https://r2.example.com/doc.pdf',
    fileName: 'doc.pdf',
    fileSize: 1024,
    uploadedAt: new Date(),
  };

  const mockCourse = {
    id: 'course-1',
    universityId: 'uni-1',
    name: 'MBBS',
    duration: '5 years',
    fees: 50000,
    seats: 100,
    isActive: true,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversitiesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: PaginatorService, useValue: mockPaginator },
        { provide: StorageService, useValue: mockStorage },
      ],
    }).compile();

    service = module.get<UniversitiesService>(UniversitiesService);
    prisma = mockPrisma;
    redis = mockRedis;
    paginator = mockPaginator;
    storage = mockStorage;
  });

  describe('findAll', () => {
    const query = { page: '1', limit: '10' } as any;

    it('should return cached paginated active universities', async () => {
      const paginatedResult = { data: [mockUniversity], meta: { total: 1, page: 1, limit: 10, totalPages: 1 } };
      paginator.parseOptions.mockReturnValue({ page: 1, limit: 10 });
      redis.getOrSet.mockResolvedValue(paginatedResult);

      const result = await service.findAll(query);

      expect(result).toEqual(paginatedResult);
      expect(redis.getOrSet).toHaveBeenCalledWith(
        expect.stringContaining('universities:list:'),
        expect.any(Function),
        3600,
      );
    });

    it('should fetch from prisma on cache miss', async () => {
      paginator.parseOptions.mockReturnValue({ page: 1, limit: 10 });
      paginator.getSkip.mockReturnValue(0);
      paginator.wrapResult.mockReturnValue({ data: [mockUniversity], meta: { total: 1, page: 1, limit: 10, totalPages: 1 } });
      redis.getOrSet.mockImplementation((_key: string, factory: () => Promise<unknown>) => factory());
      prisma.university.findMany.mockResolvedValue([mockUniversity]);
      prisma.university.count.mockResolvedValue(1);

      const result = await service.findAll(query);

      expect(result).toEqual({ data: [mockUniversity], meta: { total: 1, page: 1, limit: 10, totalPages: 1 } });
      expect(prisma.university.findMany).toHaveBeenCalled();
      expect(prisma.university.count).toHaveBeenCalled();
    });
  });

  describe('findAllAdmin', () => {
    it('should return all universities for admin without cache', async () => {
      paginator.parseOptions.mockReturnValue({ page: 1, limit: 10 });
      paginator.getSkip.mockReturnValue(0);
      paginator.wrapResult.mockReturnValue({ data: [mockUniversity], meta: { total: 1, page: 1, limit: 10, totalPages: 1 } });
      prisma.university.findMany.mockResolvedValue([mockUniversity]);
      prisma.university.count.mockResolvedValue(1);

      const query = { page: '1', limit: '10' } as any;
      const result = await service.findAllAdmin(query);

      expect(result).toEqual({ data: [mockUniversity], meta: { total: 1, page: 1, limit: 10, totalPages: 1 } });
      expect(prisma.university.findMany).toHaveBeenCalled();
      // Admin uses 'include' not 'select'
      expect((prisma.university.findMany.mock.calls[0][0] as any).include).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return cached university by id', async () => {
      redis.getOrSet.mockResolvedValue(mockUniversity);

      const result = await service.findOne('uni-1');

      expect(result).toEqual(mockUniversity);
      expect(redis.getOrSet).toHaveBeenCalledWith(
        'university:uni-1',
        expect.any(Function),
        1800,
      );
    });

    it('should fetch from prisma on cache miss', async () => {
      redis.getOrSet.mockImplementation((_key: string, factory: () => Promise<unknown>) => factory());
      prisma.university.findFirst.mockResolvedValue(mockUniversity);

      const result = await service.findOne('uni-1');

      expect(result).toEqual(mockUniversity);
      expect(prisma.university.findFirst).toHaveBeenCalledWith({
        where: { OR: [{ id: 'uni-1' }, { slug: 'uni-1' }] },
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException when not found', async () => {
      redis.getOrSet.mockImplementation((_key: string, factory: () => Promise<unknown>) => factory());
      prisma.university.findFirst.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneAdmin', () => {
    it('should return university with full includes', async () => {
      prisma.university.findFirst.mockResolvedValue(mockUniversity);

      const result = await service.findOneAdmin('uni-1');

      expect(result).toEqual(mockUniversity);
      expect(prisma.university.findFirst).toHaveBeenCalledWith({
        where: { OR: [{ id: 'uni-1' }, { slug: 'uni-1' }] },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.university.findFirst.mockResolvedValue(null);

      await expect(service.findOneAdmin('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto = { name: 'New University', website: 'https://new.edu' } as any;

    it('should throw ConflictException when name is empty', async () => {
      await expect(service.create({} as any)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when slug already exists', async () => {
      prisma.university.findUnique.mockResolvedValue(mockUniversity);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should create university and invalidate cache', async () => {
      prisma.university.findUnique.mockResolvedValue(null);
      prisma.university.create.mockResolvedValue(mockUniversity);

      const result = await service.create(dto);

      expect(result).toEqual(mockUniversity);
      expect(prisma.university.create).toHaveBeenCalled();
      expect(redis.deletePattern).toHaveBeenCalledWith('universities:list:*');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when not found', async () => {
      prisma.university.findUnique.mockResolvedValue(null);

      await expect(service.update('bad-id', {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on seat mismatch', async () => {
      prisma.university.findUnique.mockResolvedValue(mockUniversity);
      prisma.university.findFirst.mockResolvedValue(null);

      const dto = {
        academic: { totalSeats: 100, governmentSeats: 50, managementSeats: 30, nriSeats: 10 },
      } as any;

      await expect(service.update('uni-1', dto)).rejects.toThrow(BadRequestException);
    });

    it('should update university and invalidate caches', async () => {
      prisma.university.findUnique.mockResolvedValue(mockUniversity);
      prisma.university.findFirst.mockResolvedValue(null);
      prisma.university.update.mockResolvedValue(mockUniversity);

      const dto = { name: 'Updated University' } as any;
      const result = await service.update('uni-1', dto);

      expect(result).toEqual(mockUniversity);
      expect(redis.del).toHaveBeenCalledWith('university:uni-1');
      expect(redis.deletePattern).toHaveBeenCalledWith('universities:list:*');
    });

    it('should delete old logo from storage when replaced', async () => {
      const uniWithLogo = { ...mockUniversity, logo: 'https://r2.example.com/logo.jpg' };
      prisma.university.findUnique.mockResolvedValue(uniWithLogo);
      prisma.university.findFirst.mockResolvedValue(null);
      prisma.university.update.mockResolvedValue(uniWithLogo);

      const dto = { logo: 'https://r2.example.com/new-logo.jpg' } as any;
      await service.update('uni-1', dto);

      expect(storage.deleteFromUrl).toHaveBeenCalledWith('https://r2.example.com/logo.jpg');
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException when not found', async () => {
      prisma.university.findUnique.mockResolvedValue(null);

      await expect(service.delete('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('should soft-delete and invalidate caches', async () => {
      prisma.university.findUnique.mockResolvedValue(mockUniversity);
      prisma.university.update.mockResolvedValue(mockUniversity);

      const result = await service.delete('uni-1');

      expect(result).toEqual({ message: 'University deleted successfully', university: mockUniversity });
      expect(prisma.university.update).toHaveBeenCalledWith({
        where: { id: 'uni-1' },
        data: { status: UniversityStatus.INACTIVE },
      });
      expect(redis.del).toHaveBeenCalledWith('university:uni-1');
      expect(redis.deletePattern).toHaveBeenCalledWith('universities:list:*');
    });
  });

  describe('updateStatus', () => {
    it('should throw NotFoundException when not found', async () => {
      prisma.university.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus('bad-id', UniversityStatus.ACTIVE)).rejects.toThrow(NotFoundException);
    });

    it('should update status and invalidate caches', async () => {
      prisma.university.findUnique.mockResolvedValue(mockUniversity);
      const updated = { ...mockUniversity, status: UniversityStatus.ACTIVE, verifiedAt: new Date() };
      prisma.university.update.mockResolvedValue(updated);

      const result = await service.updateStatus('uni-1', UniversityStatus.ACTIVE);

      expect(result).toEqual(updated);
      expect(prisma.university.update).toHaveBeenCalledWith({
        where: { id: 'uni-1' },
        data: { status: UniversityStatus.ACTIVE, verifiedAt: expect.any(Date) },
      });
      expect(redis.del).toHaveBeenCalledWith('university:uni-1');
      expect(redis.deletePattern).toHaveBeenCalledWith('universities:list:*');
    });

    it('should not set verifiedAt for non-ACTIVE status', async () => {
      prisma.university.findUnique.mockResolvedValue(mockUniversity);
      prisma.university.update.mockResolvedValue({ ...mockUniversity, status: UniversityStatus.DRAFT });

      await service.updateStatus('uni-1', UniversityStatus.DRAFT);

      expect(prisma.university.update).toHaveBeenCalledWith({
        where: { id: 'uni-1' },
        data: { status: UniversityStatus.DRAFT },
      });
    });
  });

  describe('uploadDocument', () => {
    it('should throw NotFoundException when university not found', async () => {
      prisma.university.findUnique.mockResolvedValue(null);

      await expect(service.uploadDocument('bad-id', {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should create document record', async () => {
      prisma.university.findUnique.mockResolvedValue(mockUniversity);
      prisma.universityDocument.create.mockResolvedValue(mockDocument);

      const dto = { type: 'BROCHURE', fileUrl: 'https://r2.example.com/doc.pdf', fileName: 'doc.pdf', fileSize: 1024 };
      const result = await service.uploadDocument('uni-1', dto);

      expect(result).toEqual(mockDocument);
      expect(prisma.universityDocument.create).toHaveBeenCalledWith({
        data: { universityId: 'uni-1', ...dto },
      });
    });
  });

  describe('getDocuments', () => {
    it('should throw NotFoundException when university not found', async () => {
      prisma.university.findUnique.mockResolvedValue(null);

      await expect(service.getDocuments('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('should return documents for university', async () => {
      prisma.university.findUnique.mockResolvedValue(mockUniversity);
      prisma.universityDocument.findMany.mockResolvedValue([mockDocument]);

      const result = await service.getDocuments('uni-1');

      expect(result).toEqual([mockDocument]);
      expect(prisma.universityDocument.findMany).toHaveBeenCalledWith({
        where: { universityId: 'uni-1' },
        orderBy: { uploadedAt: 'desc' },
      });
    });
  });

  describe('deleteDocument', () => {
    it('should throw NotFoundException when document not found', async () => {
      prisma.universityDocument.findUnique.mockResolvedValue(null);

      await expect(service.deleteDocument('bad-doc')).rejects.toThrow(NotFoundException);
    });

    it('should delete document', async () => {
      prisma.universityDocument.findUnique.mockResolvedValue(mockDocument);
      prisma.universityDocument.delete.mockResolvedValue(mockDocument);

      const result = await service.deleteDocument('doc-1');

      expect(result).toEqual({ message: 'Document deleted successfully' });
      expect(prisma.universityDocument.delete).toHaveBeenCalledWith({
        where: { id: 'doc-1' },
      });
    });
  });

  describe('addCourse', () => {
    it('should throw NotFoundException when university not found', async () => {
      prisma.university.findUnique.mockResolvedValue(null);

      await expect(service.addCourse('bad-id', {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should create course', async () => {
      prisma.university.findUnique.mockResolvedValue(mockUniversity);
      prisma.universityCourse.create.mockResolvedValue(mockCourse);

      const dto = { name: 'MBBS', duration: '5 years', fees: 50000, seats: 100 };
      const result = await service.addCourse('uni-1', dto as any);

      expect(result).toEqual(mockCourse);
      expect(prisma.universityCourse.create).toHaveBeenCalledWith({
        data: { ...dto, universityId: 'uni-1' },
      });
    });
  });

  describe('updateCourse', () => {
    it('should throw NotFoundException when course not found', async () => {
      prisma.universityCourse.findUnique.mockResolvedValue(null);

      await expect(service.updateCourse('bad-course', {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should update course', async () => {
      prisma.universityCourse.findUnique.mockResolvedValue(mockCourse);
      prisma.universityCourse.update.mockResolvedValue({ ...mockCourse, fees: 60000 });

      const dto = { fees: 60000 };
      const result = await service.updateCourse('course-1', dto as any);

      expect(result.fees).toBe(60000);
      expect(prisma.universityCourse.update).toHaveBeenCalledWith({
        where: { id: 'course-1' },
        data: dto,
      });
    });
  });

  describe('deleteCourse', () => {
    it('should throw NotFoundException when course not found', async () => {
      prisma.universityCourse.findUnique.mockResolvedValue(null);

      await expect(service.deleteCourse('bad-course')).rejects.toThrow(NotFoundException);
    });

    it('should soft-delete course', async () => {
      prisma.universityCourse.findUnique.mockResolvedValue(mockCourse);
      prisma.universityCourse.update.mockResolvedValue({ ...mockCourse, isActive: false });

      const result = await service.deleteCourse('course-1');

      expect(result).toEqual({ message: 'Course deleted successfully' });
      expect(prisma.universityCourse.update).toHaveBeenCalledWith({
        where: { id: 'course-1' },
        data: { isActive: false },
      });
    });
  });

  describe('getCountries', () => {
    it('should return distinct countries', async () => {
      prisma.universityLocation.findMany.mockResolvedValue([
        { country: 'India' },
        { country: 'Russia' },
      ]);

      const result = await service.getCountries();

      expect(result).toEqual(['India', 'Russia']);
      expect(prisma.universityLocation.findMany).toHaveBeenCalledWith({
        select: { country: true },
        distinct: ['country'],
        orderBy: { country: 'asc' },
      });
    });
  });

  describe('getSignedBrochureUrl', () => {
    it('should throw NotFoundException when brochure not found', async () => {
      prisma.university.findFirst.mockResolvedValue(null);

      await expect(service.getSignedBrochureUrl('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when brochureUrl is empty', async () => {
      prisma.university.findFirst.mockResolvedValue({ brochureUrl: null });

      await expect(service.getSignedBrochureUrl('uni-1')).rejects.toThrow(NotFoundException);
    });

    it('should return signed URL', async () => {
      prisma.university.findFirst.mockResolvedValue({
        brochureUrl: 'https://pub-xxx.r2.dev/brochures/test.pdf',
      });
      storage.getSignedUrl.mockResolvedValue('https://signed.r2.dev/brochures/test.pdf?token=abc');

      const result = await service.getSignedBrochureUrl('uni-1');

      expect(result).toEqual({ url: 'https://signed.r2.dev/brochures/test.pdf?token=abc', expiresIn: 900 });
      expect(storage.getSignedUrl).toHaveBeenCalledWith('brochures/test.pdf', 900);
    });
  });

  describe('getStatistics', () => {
    it('should return cached statistics', async () => {
      const stats = {
        total: 10,
        active: 5,
        draft: 3,
        underReview: 2,
        byType: [],
        byCountry: [],
        recentlyAdded: 1,
      };
      prisma.university.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1);
      prisma.university.groupBy.mockResolvedValue([]);
      prisma.universityLocation.groupBy.mockResolvedValue([]);

      const result = await service.getStatistics();

      expect(result).toEqual(stats);
      // total, active, draft, underReview, recentlyAdded = 5 calls
      expect(prisma.university.count).toHaveBeenCalledTimes(5);
    });
  });
});
