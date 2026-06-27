import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from '../../src/students/students.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { RedisService } from '../../src/redis/redis.service';
import { PaginatorService } from '../../src/common/services/paginator.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

const mockPrisma = {
  student: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    groupBy: jest.fn(),
  },
  university: {
    findUnique: jest.fn(),
  },
  universityApplication: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
  universityCourse: {
    findUnique: jest.fn(),
  },
  stageRequirement: {
    findMany: jest.fn(),
  },
};

const mockRedis = {
  getOrSet: jest.fn(),
  del: jest.fn(),
};

const mockPaginator = {
  getSkip: jest.fn().mockImplementation(({ page, limit }) => (page - 1) * limit),
  wrapResult: jest
    .fn()
    .mockImplementation((data, total, { page, limit }) => ({
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })),
};

describe('StudentsService', () => {
  let service: StudentsService;
  let prisma: typeof mockPrisma;
  let redis: typeof mockRedis;
  let paginator: typeof mockPaginator;

  const mockStudent = {
    id: 'student-1',
    userId: 'user-1',
    currentStage: 1,
    applicationStatus: 'STAGE_1_PENDING',
    neetScore: 650,
    neetRank: 1000,
    twelfthPercentage: 85,
    tenthPercentage: 90,
    fatherName: 'Father',
    motherName: 'Mother',
    dob: new Date('2000-01-01'),
    gender: 'male',
    address: '123 Street',
    city: 'City',
    state: 'State',
    country: 'Country',
    pincode: '123456',
    passportNumber: 'AB123456',
    passportExpiry: new Date('2030-01-01'),
    passportIssueDate: new Date('2020-01-01'),
    passportIssueCountry: 'Country',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    user: {
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      phone: '1234567890',
      avatarUrl: null,
    },
    documents: [],
    payments: [],
    applications: [],
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: PaginatorService, useValue: mockPaginator },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    prisma = mockPrisma;
    redis = mockRedis;
    paginator = mockPaginator;
  });

  describe('getProfile', () => {
    it('should return cached student profile from redis', async () => {
      redis.getOrSet.mockResolvedValue(mockStudent);

      const result = await service.getProfile('user-1');

      expect(result).toEqual(mockStudent);
      expect(redis.getOrSet).toHaveBeenCalledWith(
        'student:profile:user-1',
        expect.any(Function),
        300,
      );
    });

    it('should fetch from prisma on cache miss', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown>) => factory(),
      );
      prisma.student.findUnique.mockResolvedValue(mockStudent);

      const result = await service.getProfile('user-1');

      expect(result).toEqual(mockStudent);
      expect(prisma.student.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: {
          user: { select: { id: true, email: true, name: true, phone: true, avatarUrl: true } },
          documents: { include: { documentType: true } },
          payments: true,
          applications: { include: { university: true } },
        },
      });
    });

    it('should throw NotFoundException when student not found', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown>) => factory(),
      );
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    const dto = { fatherName: 'New Father', motherName: 'New Mother' };

    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.updateProfile('bad-id', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update student and invalidate cache', async () => {
      const updated = { ...mockStudent, fatherName: 'New Father' };
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.student.update.mockResolvedValue(updated);

      const result = await service.updateProfile('user-1', dto);

      expect(prisma.student.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: dto,
      });
      expect(redis.del).toHaveBeenCalledWith('student:profile:user-1');
      expect(result).toEqual(updated);
    });
  });

  describe('getStageInfo', () => {
    const mockStageStudent = {
      currentStage: 1,
      applicationStatus: 'STAGE_1_PENDING',
      documents: [],
      payments: [],
    };

    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.getStageInfo('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return stage info with requirements', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStageStudent);
      const mockRequirements = [{ id: 'req-1', stage: 1, isActive: true }];
      (prisma as any).stageRequirement.findMany.mockResolvedValue(mockRequirements);

      const result = await service.getStageInfo('user-1');

      expect(result).toEqual({
        currentStage: 1,
        applicationStatus: 'STAGE_1_PENDING',
        requirements: mockRequirements,
        documents: [],
        payments: [],
      });
      expect(prisma.student.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        select: {
          currentStage: true,
          applicationStatus: true,
          documents: { include: { documentType: true } },
          payments: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return cached paginated students from redis', async () => {
      const mockResult = { data: [mockStudent], meta: { total: 1, page: 1, limit: 10, totalPages: 1 } };
      redis.getOrSet.mockResolvedValue(mockResult);

      const result = await service.findAll();

      expect(result).toEqual(mockResult);
      expect(redis.getOrSet).toHaveBeenCalledWith(
        'students:list:1:10:all:all:default',
        expect.any(Function),
        300,
      );
    });

    it('should fetch from prisma on cache miss', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown>) => factory(),
      );
      prisma.student.findMany.mockResolvedValue([mockStudent]);
      prisma.student.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(prisma.student.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
      expect(prisma.student.count).toHaveBeenCalledWith({ where: {} });
      expect(paginator.wrapResult).toHaveBeenCalled();
      expect(result.data).toEqual([mockStudent]);
    });
  });

  describe('findOne', () => {
    it('should return cached student from redis', async () => {
      redis.getOrSet.mockResolvedValue(mockStudent);

      const result = await service.findOne('student-1');

      expect(result).toEqual(mockStudent);
      expect(redis.getOrSet).toHaveBeenCalledWith(
        'student:student-1',
        expect.any(Function),
        300,
      );
    });

    it('should throw NotFoundException when student not found', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown>) => factory(),
      );
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('adminUpdate', () => {
    const dto = { currentStage: 2, fatherName: 'Admin Edit' };

    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.adminUpdate('bad-id', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update student', async () => {
      const updated = { ...mockStudent, currentStage: 2, fatherName: 'Admin Edit' };
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.student.update.mockResolvedValue(updated);

      const result = await service.adminUpdate('student-1', dto);

      expect(prisma.student.findUnique).toHaveBeenCalledWith({
        where: { id: 'student-1' },
      });
      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { id: 'student-1' },
        data: { currentStage: 2, fatherName: 'Admin Edit' },
      });
      expect(result).toEqual(updated);
    });

    it('should only include defined values in update', async () => {
      const partialDto = { currentStage: 3, fatherName: undefined };
      const updated = { ...mockStudent, currentStage: 3 };
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.student.update.mockResolvedValue(updated);

      await service.adminUpdate('student-1', partialDto);

      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { id: 'student-1' },
        data: { currentStage: 3 },
      });
    });
  });

  describe('updateStage', () => {
    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.updateStage('bad-id', 2)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update stage only', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      const updated = { ...mockStudent, currentStage: 2 };
      prisma.student.update.mockResolvedValue(updated);

      const result = await service.updateStage('student-1', 2);

      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { id: 'student-1' },
        data: { currentStage: 2 },
      });
      expect(result).toEqual(updated);
    });

    it('should update stage and status', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      const updated = { ...mockStudent, currentStage: 3, applicationStatus: 'STAGE_3_ACTIVE' };
      prisma.student.update.mockResolvedValue(updated);

      const result = await service.updateStage('student-1', 3, 'STAGE_3_ACTIVE');

      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { id: 'student-1' },
        data: { currentStage: 3, applicationStatus: 'STAGE_3_ACTIVE' },
      });
      expect(result).toEqual(updated);
    });
  });

  describe('submitApplication', () => {
    const validDto = {
      universityId: 'uni-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      dateOfBirth: '2000-01-01',
      placeOfBirth: { city: 'City', state: 'State', country: 'Country' },
      citizenship: 'Country',
      maritalStatus: 'single' as const,
      gender: 'male' as const,
      permanentAddress: '123 Street',
      permanentCity: 'City',
      permanentState: 'State',
      permanentZip: '123456',
      permanentCountry: 'Country',
      embassyLocation: 'Embassy',
      language1: { name: 'English', speaking: 'high' as const, reading: 'high' as const, writing: 'high' as const },
      selectedProgram: 'general-medicine' as const,
      signature: 'John Doe',
      signatureDate: new Date().toISOString().split('T')[0],
    };

    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.submitApplication('bad-id', validDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when university not found', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.university.findUnique.mockResolvedValue(null);

      await expect(
        service.submitApplication('user-1', validDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when university is not active', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.university.findUnique.mockResolvedValue({
        id: 'uni-1',
        status: 'INACTIVE',
      });

      await expect(
        service.submitApplication('user-1', validDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when already applied', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.university.findUnique.mockResolvedValue({
        id: 'uni-1',
        status: 'ACTIVE',
      });
      prisma.universityApplication.findFirst.mockResolvedValue({
        id: 'app-1',
        status: 'pending',
      });

      await expect(
        service.submitApplication('user-1', validDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should create application successfully', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.university.findUnique.mockResolvedValue({
        id: 'uni-1',
        status: 'ACTIVE',
      });
      prisma.universityApplication.findFirst.mockResolvedValue(null);
      prisma.universityApplication.create.mockResolvedValue({ id: 'app-1' });

      const result = await service.submitApplication('user-1', validDto);

      expect(prisma.universityApplication.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          studentId: 'student-1',
          universityId: 'uni-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          status: 'pending',
        }),
      });
      expect(result).toEqual({
        message: 'Application submitted successfully',
        applicationId: 'app-1',
      });
    });

    it('should throw BadRequestException when applicant is under 16', async () => {
      const youngDto = {
        ...validDto,
        dateOfBirth: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      };
      prisma.student.findUnique.mockResolvedValue(mockStudent);

      await expect(
        service.submitApplication('user-1', youngDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getMyApplications', () => {
    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.getMyApplications('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return paginated applications', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.universityApplication.findMany.mockResolvedValue([
        { id: 'app-1', university: { id: 'uni-1', name: 'Test Uni', shortName: 'TU', slug: 'test-uni' } },
      ]);
      prisma.universityApplication.count.mockResolvedValue(1);

      const result = await service.getMyApplications('user-1', 1, 10);

      expect(prisma.universityApplication.findMany).toHaveBeenCalledWith({
        where: { studentId: 'student-1' },
        skip: 0,
        take: 10,
        orderBy: { submittedAt: 'desc' },
        select: expect.any(Object),
      });
      expect(paginator.wrapResult).toHaveBeenCalled();
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getMyApplicationById', () => {
    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(
        service.getMyApplicationById('bad-id', 'app-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when application not found or not owned', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.universityApplication.findFirst.mockResolvedValue(null);

      await expect(
        service.getMyApplicationById('user-1', 'bad-app'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return application with university details', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      const mockApp = {
        id: 'app-1',
        university: { id: 'uni-1', name: 'Test Uni', shortName: 'TU', slug: 'test-uni', type: 'PUBLIC', status: 'ACTIVE', location: { country: 'Country', city: 'City' }, contact: { email: 'uni@test.com', phone: '1234567890' } },
      };
      prisma.universityApplication.findFirst.mockResolvedValue(mockApp);

      const result = await service.getMyApplicationById('user-1', 'app-1');

      expect(prisma.universityApplication.findFirst).toHaveBeenCalledWith({
        where: { id: 'app-1', studentId: 'student-1' },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockApp);
    });
  });

  describe('checkApplication', () => {
    it('should return { applied: false } when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      const result = await service.checkApplication('bad-id', 'uni-1');

      expect(result).toEqual({ applied: false });
    });

    it('should return { applied: false } when no application exists', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.universityApplication.findFirst.mockResolvedValue(null);

      const result = await service.checkApplication('user-1', 'uni-1');

      expect(result).toEqual({ applied: false });
    });

    it('should return application info when already applied', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      const mockApp = { id: 'app-1', selectedProgram: 'general-medicine', status: 'pending', submittedAt: new Date() };
      prisma.universityApplication.findFirst.mockResolvedValue(mockApp);

      const result = await service.checkApplication('user-1', 'uni-1');

      expect(result).toEqual({ applied: true, application: mockApp });
    });
  });

  describe('assignUniversity', () => {
    const dto = { courseId: 'course-1' };

    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.assignUniversity('bad-id', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when course not found', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.universityCourse.findUnique.mockResolvedValue(null);

      await expect(service.assignUniversity('student-1', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should assign university and create application', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      const mockCourse = { id: 'course-1', universityId: 'uni-1', university: { id: 'uni-1', name: 'Test Uni' } };
      prisma.universityCourse.findUnique.mockResolvedValue(mockCourse);
      prisma.universityApplication.create.mockResolvedValue({ id: 'app-1' });

      const result = await service.assignUniversity('student-1', dto);

      expect(prisma.universityCourse.findUnique).toHaveBeenCalledWith({
        where: { id: 'course-1' },
        include: { university: true },
      });
      expect(prisma.universityApplication.create).toHaveBeenCalledWith({
        data: {
          studentId: 'student-1',
          universityId: 'uni-1',
          courseId: 'course-1',
          status: 'pending',
        },
      });
      expect(result).toEqual({
        message: 'University assigned successfully',
        application: { id: 'app-1' },
        university: { id: 'uni-1', name: 'Test Uni' },
        course: mockCourse,
      });
    });
  });

  describe('getStats', () => {
    it('should return aggregated stats', async () => {
      prisma.student.count.mockResolvedValue(10);
      prisma.student.groupBy
        .mockResolvedValueOnce([
          { currentStage: 1, _count: 5 },
          { currentStage: 2, _count: 3 },
        ])
        .mockResolvedValueOnce([
          { applicationStatus: 'STAGE_1_PENDING', _count: 5 },
          { applicationStatus: 'STAGE_2_PENDING', _count: 3 },
        ]);

      const result = await service.getStats();

      expect(result).toEqual({
        total: 10,
        byStage: { 1: 5, 2: 3 },
        byStatus: { STAGE_1_PENDING: 5, STAGE_2_PENDING: 3 },
      });
      expect(prisma.student.count).toHaveBeenCalled();
      expect(prisma.student.groupBy).toHaveBeenCalledTimes(2);
    });
  });
});
