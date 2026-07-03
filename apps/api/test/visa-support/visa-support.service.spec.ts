import { Test, TestingModule } from '@nestjs/testing';
import { VisaSupportService } from '../../src/visa-support/visa-support.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { RedisService } from '../../src/redis/redis.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockPrisma = {
  visaCenter: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  visaChecklist: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  visaApplication: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockRedis = {
  getOrSet: jest.fn(),
  del: jest.fn(),
  deletePattern: jest.fn(),
};

describe('VisaSupportService', () => {
  let service: VisaSupportService;
  let prisma: typeof mockPrisma;
  let redis: typeof mockRedis;

  const mockCenter = {
    id: 'center-1',
    name: 'Mumbai Visa Center',
    address: '123 Street',
    city: 'Mumbai',
    country: 'India',
    contactNo: '9876543210',
    email: 'visa@example.com',
    website: 'https://example.com',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockChecklist = {
    id: 'cl-1',
    country: 'India',
    title: 'Student Visa Documents',
    description: 'Required documents',
    documents: ['Passport', 'Photo'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockVisaApp = {
    id: 'va-1',
    studentId: 'stu-1',
    visaCenterId: 'center-1',
    checklistId: 'cl-1',
    status: 'DRAFT',
    passportNumber: 'P123456',
    submittedAt: null,
    decidedAt: null,
    decidedBy: null,
    remarks: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    visaCenter: mockCenter,
    checklist: mockChecklist,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisaSupportService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<VisaSupportService>(VisaSupportService);
    prisma = mockPrisma;
    redis = mockRedis;
  });

  // ===== Visa Centers ===== //
  describe('createVisaCenter', () => {
    it('should create a visa center and invalidate cache', async () => {
      prisma.visaCenter.create.mockResolvedValue(mockCenter);

      const result = await service.createVisaCenter({
        name: 'Mumbai Visa Center',
        city: 'Mumbai',
        country: 'India',
      });

      expect(prisma.visaCenter.create).toHaveBeenCalled();
      expect(redis.del).toHaveBeenCalledWith('visa:centers:all');
      expect(result).toEqual(mockCenter);
    });
  });

  describe('getAllVisaCenters', () => {
    it('should return cached centers', async () => {
      redis.getOrSet.mockResolvedValue([mockCenter]);

      const result = await service.getAllVisaCenters();

      expect(redis.getOrSet).toHaveBeenCalledWith(
        'visa:centers:all',
        expect.any(Function),
        86400,
      );
      expect(result).toEqual([mockCenter]);
    });

    it('should fetch from prisma on cache miss', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown[]>) => factory(),
      );
      prisma.visaCenter.findMany.mockResolvedValue([mockCenter]);

      const result = await service.getAllVisaCenters();

      expect(prisma.visaCenter.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockCenter]);
    });
  });

  describe('getVisaCenter', () => {
    it('should return a visa center by id', async () => {
      prisma.visaCenter.findUnique.mockResolvedValue(mockCenter);

      const result = await service.getVisaCenter('center-1');

      expect(prisma.visaCenter.findUnique).toHaveBeenCalledWith({ where: { id: 'center-1' } });
      expect(result).toEqual(mockCenter);
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.visaCenter.findUnique.mockResolvedValue(null);

      await expect(service.getVisaCenter('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateVisaCenter', () => {
    it('should update and invalidate cache', async () => {
      prisma.visaCenter.findUnique.mockResolvedValue(mockCenter);
      prisma.visaCenter.update.mockResolvedValue({ ...mockCenter, name: 'Updated Center' });

      const result = await service.updateVisaCenter('center-1', { name: 'Updated Center' });

      expect(prisma.visaCenter.findUnique).toHaveBeenCalledWith({ where: { id: 'center-1' } });
      expect(prisma.visaCenter.update).toHaveBeenCalledWith({
        where: { id: 'center-1' },
        data: { name: 'Updated Center' },
      });
      expect(redis.del).toHaveBeenCalledWith('visa:centers:all');
      expect(result.name).toBe('Updated Center');
    });

    it('should throw NotFoundException', async () => {
      prisma.visaCenter.findUnique.mockResolvedValue(null);

      await expect(service.updateVisaCenter('bad-id', { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteVisaCenter', () => {
    it('should delete and invalidate cache', async () => {
      prisma.visaCenter.findUnique.mockResolvedValue(mockCenter);
      prisma.visaCenter.delete.mockResolvedValue(mockCenter);

      const result = await service.deleteVisaCenter('center-1');

      expect(prisma.visaCenter.delete).toHaveBeenCalledWith({ where: { id: 'center-1' } });
      expect(redis.del).toHaveBeenCalledWith('visa:centers:all');
      expect(result).toEqual(mockCenter);
    });

    it('should throw NotFoundException', async () => {
      prisma.visaCenter.findUnique.mockResolvedValue(null);

      await expect(service.deleteVisaCenter('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ===== Visa Checklists ===== //
  describe('createVisaChecklist', () => {
    it('should create a checklist and invalidate cache', async () => {
      prisma.visaChecklist.create.mockResolvedValue(mockChecklist);

      const result = await service.createVisaChecklist({
        country: 'India',
        title: 'Student Visa Documents',
        documents: ['Passport', 'Photo'],
      });

      expect(prisma.visaChecklist.create).toHaveBeenCalled();
      expect(redis.deletePattern).toHaveBeenCalledWith('visa:checklists:*');
      expect(result).toEqual(mockChecklist);
    });
  });

  describe('getAllVisaChecklists', () => {
    it('should return cached checklists without country filter', async () => {
      redis.getOrSet.mockResolvedValue([mockChecklist]);

      const result = await service.getAllVisaChecklists();

      expect(redis.getOrSet).toHaveBeenCalledWith(
        'visa:checklists:all',
        expect.any(Function),
        86400,
      );
      expect(result).toEqual([mockChecklist]);
    });

    it('should return cached checklists with country filter', async () => {
      redis.getOrSet.mockResolvedValue([mockChecklist]);

      const result = await service.getAllVisaChecklists('India');

      expect(redis.getOrSet).toHaveBeenCalledWith(
        'visa:checklists:India',
        expect.any(Function),
        86400,
      );
      expect(result).toEqual([mockChecklist]);
    });
  });

  describe('getVisaChecklist', () => {
    it('should return a checklist by id', async () => {
      prisma.visaChecklist.findUnique.mockResolvedValue(mockChecklist);

      const result = await service.getVisaChecklist('cl-1');

      expect(result).toEqual(mockChecklist);
    });

    it('should throw NotFoundException', async () => {
      prisma.visaChecklist.findUnique.mockResolvedValue(null);

      await expect(service.getVisaChecklist('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateVisaChecklist', () => {
    it('should update and invalidate cache', async () => {
      prisma.visaChecklist.findUnique.mockResolvedValue(mockChecklist);
      prisma.visaChecklist.update.mockResolvedValue({ ...mockChecklist, title: 'Updated' });

      const result = await service.updateVisaChecklist('cl-1', { title: 'Updated' });

      expect(prisma.visaChecklist.update).toHaveBeenCalledWith({
        where: { id: 'cl-1' },
        data: { title: 'Updated' },
      });
      expect(redis.deletePattern).toHaveBeenCalledWith('visa:checklists:*');
      expect(result.title).toBe('Updated');
    });

    it('should throw NotFoundException', async () => {
      prisma.visaChecklist.findUnique.mockResolvedValue(null);

      await expect(service.updateVisaChecklist('bad-id', { title: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteVisaChecklist', () => {
    it('should delete and invalidate cache', async () => {
      prisma.visaChecklist.findUnique.mockResolvedValue(mockChecklist);
      prisma.visaChecklist.delete.mockResolvedValue(mockChecklist);

      const result = await service.deleteVisaChecklist('cl-1');

      expect(prisma.visaChecklist.delete).toHaveBeenCalledWith({ where: { id: 'cl-1' } });
      expect(redis.deletePattern).toHaveBeenCalledWith('visa:checklists:*');
      expect(result).toEqual(mockChecklist);
    });

    it('should throw NotFoundException', async () => {
      prisma.visaChecklist.findUnique.mockResolvedValue(null);

      await expect(service.deleteVisaChecklist('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ===== Visa Applications ===== //
  describe('createVisaApplication', () => {
    it('should create a visa application with relations', async () => {
      prisma.visaApplication.create.mockResolvedValue(mockVisaApp);

      const result = await service.createVisaApplication({
        studentId: 'stu-1',
        visaCenterId: 'center-1',
        checklistId: 'cl-1',
      });

      expect(prisma.visaApplication.create).toHaveBeenCalledWith({
        data: { studentId: 'stu-1', visaCenterId: 'center-1', checklistId: 'cl-1' },
        include: { visaCenter: true, checklist: true },
      });
      expect(result).toEqual(mockVisaApp);
    });
  });

  describe('getStudentVisaApplications', () => {
    it('should return applications for a student', async () => {
      prisma.visaApplication.findMany.mockResolvedValue([mockVisaApp]);

      const result = await service.getStudentVisaApplications('stu-1');

      expect(prisma.visaApplication.findMany).toHaveBeenCalledWith({
        where: { studentId: 'stu-1' },
        include: { visaCenter: true, checklist: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockVisaApp]);
    });
  });

  describe('getAllVisaApplications', () => {
    it('should return all applications without status filter', async () => {
      prisma.visaApplication.findMany.mockResolvedValue([mockVisaApp]);

      const result = await service.getAllVisaApplications();

      expect(prisma.visaApplication.findMany).toHaveBeenCalledWith({
        where: {},
        include: { visaCenter: true, checklist: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockVisaApp]);
    });

    it('should filter by status', async () => {
      prisma.visaApplication.findMany.mockResolvedValue([mockVisaApp]);

      await service.getAllVisaApplications('SUBMITTED');

      expect(prisma.visaApplication.findMany).toHaveBeenCalledWith({
        where: { status: 'SUBMITTED' },
        include: { visaCenter: true, checklist: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getVisaApplication', () => {
    it('should return an application by id', async () => {
      prisma.visaApplication.findUnique.mockResolvedValue(mockVisaApp);

      const result = await service.getVisaApplication('va-1');

      expect(result).toEqual(mockVisaApp);
    });

    it('should throw NotFoundException', async () => {
      prisma.visaApplication.findUnique.mockResolvedValue(null);

      await expect(service.getVisaApplication('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateVisaApplication', () => {
    it('should update and return with relations', async () => {
      prisma.visaApplication.findUnique.mockResolvedValue(mockVisaApp);
      prisma.visaApplication.update.mockResolvedValue({
        ...mockVisaApp,
        passportNumber: 'Q999999',
      });

      const result = await service.updateVisaApplication('va-1', {
        passportNumber: 'Q999999',
      });

      expect(prisma.visaApplication.update).toHaveBeenCalledWith({
        where: { id: 'va-1' },
        data: { passportNumber: 'Q999999' },
        include: { visaCenter: true, checklist: true },
      });
      expect(result.passportNumber).toBe('Q999999');
    });

    it('should throw NotFoundException', async () => {
      prisma.visaApplication.findUnique.mockResolvedValue(null);

      await expect(service.updateVisaApplication('bad-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('submitVisaApplication', () => {
    it('should submit a DRAFT application', async () => {
      prisma.visaApplication.findUnique.mockResolvedValue(mockVisaApp);
      prisma.visaApplication.update.mockResolvedValue({
        ...mockVisaApp,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      });

      const result = await service.submitVisaApplication('va-1');

      expect(prisma.visaApplication.update).toHaveBeenCalledWith({
        where: { id: 'va-1' },
        data: { status: 'SUBMITTED', submittedAt: expect.any(Date) },
        include: { visaCenter: true, checklist: true },
      });
      expect(result.status).toBe('SUBMITTED');
    });

    it('should throw BadRequestException when not DRAFT', async () => {
      prisma.visaApplication.findUnique.mockResolvedValue({
        ...mockVisaApp,
        status: 'SUBMITTED',
      });

      await expect(service.submitVisaApplication('va-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('decideVisaApplication', () => {
    it('should approve a SUBMITTED application', async () => {
      prisma.visaApplication.findUnique.mockResolvedValue({
        ...mockVisaApp,
        status: 'SUBMITTED',
      });
      prisma.visaApplication.update.mockResolvedValue({
        ...mockVisaApp,
        status: 'APPROVED',
        decidedAt: new Date(),
        decidedBy: 'admin-1',
      });

      const result = await service.decideVisaApplication('va-1', 'APPROVED', 'admin-1', 'All good');

      expect(prisma.visaApplication.update).toHaveBeenCalledWith({
        where: { id: 'va-1' },
        data: {
          status: 'APPROVED',
          decidedAt: expect.any(Date),
          decidedBy: 'admin-1',
          remarks: 'All good',
        },
        include: { visaCenter: true, checklist: true },
      });
      expect(result.status).toBe('APPROVED');
    });

    it('should reject a PROCESSING application', async () => {
      prisma.visaApplication.findUnique.mockResolvedValue({
        ...mockVisaApp,
        status: 'PROCESSING',
      });
      prisma.visaApplication.update.mockResolvedValue({
        ...mockVisaApp,
        status: 'REJECTED',
        decidedAt: new Date(),
        decidedBy: 'admin-1',
      });

      const result = await service.decideVisaApplication('va-1', 'REJECTED', 'admin-1');

      expect(result.status).toBe('REJECTED');
    });

    it('should throw BadRequestException for DRAFT application', async () => {
      prisma.visaApplication.findUnique.mockResolvedValue(mockVisaApp);

      await expect(
        service.decideVisaApplication('va-1', 'APPROVED', 'admin-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getVisaCountries', () => {
    it('should return sorted unique countries from centers and checklists', async () => {
      prisma.visaCenter.findMany.mockResolvedValue([
        { country: 'India' },
        { country: 'USA' },
      ]);
      prisma.visaChecklist.findMany.mockResolvedValue([
        { country: 'India' },
        { country: 'UK' },
      ]);

      const result = await service.getVisaCountries();

      expect(result).toEqual(['India', 'UK', 'USA']);
    });

    it('should return empty array when no data', async () => {
      prisma.visaCenter.findMany.mockResolvedValue([]);
      prisma.visaChecklist.findMany.mockResolvedValue([]);

      const result = await service.getVisaCountries();

      expect(result).toEqual([]);
    });
  });
});
