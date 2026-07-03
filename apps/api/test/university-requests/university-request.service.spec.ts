import { Test, TestingModule } from '@nestjs/testing';
import { UniversityRequestService } from '../../src/university-requests/university-request.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

enum UniversityRequestStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ADDED = 'ADDED',
}

const mockPrisma = {
  universityRequest: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('UniversityRequestService', () => {
  let service: UniversityRequestService;
  let prisma: typeof mockPrisma;

  const mockRequest = {
    id: 'req-1',
    universityName: 'Test University',
    country: 'India',
    state: 'Karnataka',
    website: 'https://test.edu',
    type: 'GOVERNMENT',
    programs: ['MBBS'],
    otherPrograms: null,
    contactEmail: 'admin@test.edu',
    contactPhone: '+911234567890',
    additionalInfo: null,
    status: UniversityRequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversityRequestService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UniversityRequestService>(UniversityRequestService);
    prisma = mockPrisma;
  });

  describe('create', () => {
    it('should create a university request with PENDING status', async () => {
      const dto = {
        universityName: 'Test University',
        country: 'India',
        state: 'Karnataka',
        website: 'https://test.edu',
        type: 'GOVERNMENT',
        programs: ['MBBS'],
        contactEmail: 'admin@test.edu',
        contactPhone: '+911234567890',
      };
      prisma.universityRequest.create.mockResolvedValue(mockRequest);

      const result = await service.create(dto as any);

      expect(result).toEqual(mockRequest);
      expect(prisma.universityRequest.create).toHaveBeenCalledWith({
        data: {
          universityName: dto.universityName,
          country: dto.country,
          state: dto.state,
          website: dto.website,
          type: dto.type,
          programs: dto.programs,
          otherPrograms: undefined,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
          additionalInfo: undefined,
          status: UniversityRequestStatus.PENDING,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all requests when no status filter', async () => {
      prisma.universityRequest.findMany.mockResolvedValue([mockRequest]);

      const result = await service.findAll();

      expect(result).toEqual([mockRequest]);
      expect(prisma.universityRequest.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by status when provided', async () => {
      prisma.universityRequest.findMany.mockResolvedValue([mockRequest]);

      const result = await service.findAll(UniversityRequestStatus.PENDING);

      expect(result).toEqual([mockRequest]);
      expect(prisma.universityRequest.findMany).toHaveBeenCalledWith({
        where: { status: UniversityRequestStatus.PENDING },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return request by id', async () => {
      prisma.universityRequest.findUnique.mockResolvedValue(mockRequest);

      const result = await service.findOne('req-1');

      expect(result).toEqual(mockRequest);
      expect(prisma.universityRequest.findUnique).toHaveBeenCalledWith({
        where: { id: 'req-1' },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.universityRequest.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when not found', async () => {
      prisma.universityRequest.findUnique.mockResolvedValue(null);

      await expect(service.update('bad-id', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update and return the request', async () => {
      prisma.universityRequest.findUnique.mockResolvedValue(mockRequest);
      const updated = {
        ...mockRequest,
        status: UniversityRequestStatus.APPROVED,
      };
      prisma.universityRequest.update.mockResolvedValue(updated);

      const dto = { status: UniversityRequestStatus.APPROVED };
      const result = await service.update('req-1', dto as any);

      expect(result).toEqual(updated);
      expect(prisma.universityRequest.update).toHaveBeenCalledWith({
        where: { id: 'req-1' },
        data: dto,
      });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when not found', async () => {
      prisma.universityRequest.findUnique.mockResolvedValue(null);

      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('should delete and return the request', async () => {
      prisma.universityRequest.findUnique.mockResolvedValue(mockRequest);
      prisma.universityRequest.delete.mockResolvedValue(mockRequest);

      const result = await service.remove('req-1');

      expect(result).toEqual(mockRequest);
      expect(prisma.universityRequest.delete).toHaveBeenCalledWith({
        where: { id: 'req-1' },
      });
    });
  });

  describe('getStats', () => {
    it('should return counts grouped by status', async () => {
      prisma.universityRequest.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(4) // pending
        .mockResolvedValueOnce(2) // under_review
        .mockResolvedValueOnce(3) // approved
        .mockResolvedValueOnce(1) // rejected
        .mockResolvedValueOnce(0); // added

      const result = await service.getStats();

      expect(result).toEqual({
        total: 10,
        pending: 4,
        underReview: 2,
        approved: 3,
        rejected: 1,
        added: 0,
      });
      expect(prisma.universityRequest.count).toHaveBeenCalledTimes(6);
    });
  });
});
