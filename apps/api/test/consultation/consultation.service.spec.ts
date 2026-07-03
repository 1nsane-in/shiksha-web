import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationService } from '../../src/consultation/consultation.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  consultation: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ConsultationService', () => {
  let service: ConsultationService;
  let prisma: typeof mockPrisma;

  const mockConsultation = {
    id: 'con-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+911234567890',
    neetScore: 650,
    state: 'Karnataka',
    country: 'India',
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ConsultationService>(ConsultationService);
    prisma = mockPrisma;
  });

  describe('create', () => {
    it('should create a consultation with generated id', async () => {
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+911234567890',
        neetScore: 650,
        state: 'Karnataka',
        country: 'India',
      };
      prisma.consultation.create.mockResolvedValue(mockConsultation);

      const result = await service.create(dto as any);

      expect(result).toEqual(mockConsultation);
      expect(prisma.consultation.create).toHaveBeenCalledWith({
        data: {
          id: expect.any(String),
          ...dto,
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('getAll', () => {
    it('should return all consultations ordered by newest first', async () => {
      prisma.consultation.findMany.mockResolvedValue([mockConsultation]);

      const result = await service.getAll();

      expect(result).toEqual([mockConsultation]);
      expect(prisma.consultation.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getOne', () => {
    it('should return consultation by id', async () => {
      prisma.consultation.findUnique.mockResolvedValue(mockConsultation);

      const result = await service.getOne('con-1');

      expect(result).toEqual(mockConsultation);
      expect(prisma.consultation.findUnique).toHaveBeenCalledWith({
        where: { id: 'con-1' },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.consultation.findUnique.mockResolvedValue(null);

      await expect(service.getOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should throw NotFoundException when not found', async () => {
      prisma.consultation.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus('bad-id', 'APPROVED')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update and return consultation status', async () => {
      prisma.consultation.findUnique.mockResolvedValue(mockConsultation);
      const updated = { ...mockConsultation, status: 'CONTACTED' };
      prisma.consultation.update.mockResolvedValue(updated);

      const result = await service.updateStatus('con-1', 'CONTACTED');

      expect(result).toEqual(updated);
      expect(prisma.consultation.update).toHaveBeenCalledWith({
        where: { id: 'con-1' },
        data: { status: 'CONTACTED' },
      });
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException when not found', async () => {
      prisma.consultation.findUnique.mockResolvedValue(null);

      await expect(service.delete('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('should delete and return consultation', async () => {
      prisma.consultation.findUnique.mockResolvedValue(mockConsultation);
      prisma.consultation.delete.mockResolvedValue(mockConsultation);

      const result = await service.delete('con-1');

      expect(result).toEqual(mockConsultation);
      expect(prisma.consultation.delete).toHaveBeenCalledWith({
        where: { id: 'con-1' },
      });
    });
  });
});
