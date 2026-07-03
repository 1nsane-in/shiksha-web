import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { PaginatorService } from '../common/services/paginator.service';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

const mockPrisma = {
  student: {
    findUnique: jest.fn(),
  },
  documentType: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  studentDocument: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

const mockRedis = {
  getOrSet: jest.fn(),
  del: jest.fn(),
};

const mockPaginator = {
  getSkip: jest.fn().mockReturnValue(0),
  wrapResult: jest.fn((docs, total, meta) => ({
    data: docs,
    meta: { total, ...meta, totalPages: Math.ceil(total / meta.limit) },
  })),
};

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: typeof mockPrisma;
  let redis: typeof mockRedis;

  const mockStudent = { id: 'student-1', userId: 'user-1' };
  const mockDocumentType = {
    id: 'dt-1',
    code: 'PASSPORT',
    name: 'Passport',
    requiredForStage: 1,
    isActive: true,
  };
  const mockDoc = {
    id: 'doc-1',
    studentId: 'student-1',
    documentTypeId: 'dt-1',
    fileUrl: 'https://r2.example.com/doc.pdf',
    fileName: 'passport.pdf',
    fileSize: 1024,
    status: 'UPLOADED',
    createdAt: new Date(),
    documentType: mockDocumentType,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: PaginatorService, useValue: mockPaginator },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    prisma = mockPrisma;
    redis = mockRedis;
  });

  describe('getStudentDocuments', () => {
    it('should return documents for a student', async () => {
      prisma.studentDocument.findMany.mockResolvedValue([mockDoc]);

      const result = await service.getStudentDocuments('student-1');

      expect(result).toEqual([mockDoc]);
      expect(prisma.studentDocument.findMany).toHaveBeenCalledWith({
        where: { studentId: 'student-1' },
        include: { documentType: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('uploadDocument', () => {
    const dto = {
      documentTypeId: 'dt-1',
      fileUrl: 'https://r2.example.com/doc.pdf',
      fileName: 'passport.pdf',
      fileSize: 1024,
    };

    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(
        service.uploadDocument('student-1', dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when document type not found', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.documentType.findUnique.mockResolvedValue(null);

      await expect(
        service.uploadDocument('student-1', dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when pending doc exists', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.documentType.findUnique.mockResolvedValue(mockDocumentType);
      prisma.studentDocument.findFirst.mockResolvedValue(mockDoc);

      await expect(
        service.uploadDocument('student-1', dto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create document when no existing pending doc', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.documentType.findUnique.mockResolvedValue(mockDocumentType);
      prisma.studentDocument.findFirst.mockResolvedValue(null);
      prisma.studentDocument.create.mockResolvedValue(mockDoc);

      const result = await service.uploadDocument('student-1', dto);

      expect(result).toEqual(mockDoc);
      expect(prisma.studentDocument.create).toHaveBeenCalledWith({
        data: {
          studentId: 'student-1',
          documentTypeId: 'dt-1',
          fileUrl: dto.fileUrl,
          fileName: dto.fileName,
          fileSize: dto.fileSize,
          status: 'UPLOADED',
        },
        include: { documentType: true },
      });
    });

    it('should allow re-upload when previous doc was rejected', async () => {
      const rejectedDoc = { ...mockDoc, status: 'REJECTED' };
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.documentType.findUnique.mockResolvedValue(mockDocumentType);
      prisma.studentDocument.findFirst.mockResolvedValue(rejectedDoc);
      prisma.studentDocument.create.mockResolvedValue(mockDoc);

      const result = await service.uploadDocument('student-1', dto);

      expect(result).toEqual(mockDoc);
    });
  });

  describe('getMyDocuments', () => {
    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.getMyDocuments('user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return documents for current user', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.studentDocument.findMany.mockResolvedValue([mockDoc]);

      const result = await service.getMyDocuments('user-1');

      expect(result).toEqual([mockDoc]);
    });
  });

  describe('uploadMyDocument', () => {
    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(
        service.uploadMyDocument('user-1', {
          documentTypeId: 'dt-1',
          fileUrl: 'https://r2.example.com/doc.pdf',
          fileName: 'passport.pdf',
          fileSize: 1024,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should upload document for current user', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.documentType.findUnique.mockResolvedValue(mockDocumentType);
      prisma.studentDocument.findFirst.mockResolvedValue(null);
      prisma.studentDocument.create.mockResolvedValue(mockDoc);

      const result = await service.uploadMyDocument('user-1', {
        documentTypeId: 'dt-1',
        fileUrl: 'https://r2.example.com/doc.pdf',
        fileName: 'passport.pdf',
        fileSize: 1024,
      });

      expect(result).toEqual(mockDoc);
    });
  });

  describe('getPendingDocuments', () => {
    it('should return paginated pending documents', async () => {
      prisma.studentDocument.findMany.mockResolvedValue([mockDoc]);
      prisma.studentDocument.count.mockResolvedValue(1);

      const result = await service.getPendingDocuments();

      expect(result.data).toEqual([mockDoc]);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('verifyDocument', () => {
    it('should throw NotFoundException when document not found', async () => {
      prisma.studentDocument.findUnique.mockResolvedValue(null);

      await expect(
        service.verifyDocument('bad-id', 'admin-1', {
          status: 'APPROVED',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when document not verifiable', async () => {
      prisma.studentDocument.findUnique.mockResolvedValue({
        ...mockDoc,
        status: 'APPROVED',
      });

      await expect(
        service.verifyDocument('doc-1', 'admin-1', { status: 'APPROVED' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should approve document successfully', async () => {
      const approved = {
        ...mockDoc,
        status: 'APPROVED',
        verifiedBy: 'admin-1',
        verifiedAt: new Date(),
        student: { user: { id: 'user-1', name: 'Test', email: 'test@test.com' } },
      };
      prisma.studentDocument.findUnique.mockResolvedValue(mockDoc);
      prisma.studentDocument.update.mockResolvedValue(approved);

      const result = await service.verifyDocument('doc-1', 'admin-1', {
        status: 'APPROVED',
        remarks: 'Looks good',
      });

      expect(result.status).toBe('APPROVED');
      expect(result.verifiedBy).toBe('admin-1');
    });

    it('should reject document with remarks', async () => {
      const rejected = {
        ...mockDoc,
        status: 'REJECTED',
        remarks: 'Blurry image',
        verifiedBy: 'admin-1',
        verifiedAt: new Date(),
      };
      prisma.studentDocument.findUnique.mockResolvedValue(mockDoc);
      prisma.studentDocument.update.mockResolvedValue(rejected);

      const result = await service.verifyDocument('doc-1', 'admin-1', {
        status: 'REJECTED',
        remarks: 'Blurry image',
      });

      expect(result.status).toBe('REJECTED');
      expect(result.remarks).toBe('Blurry image');
    });
  });

  describe('markForReupload', () => {
    it('should throw NotFoundException when document not found', async () => {
      prisma.studentDocument.findUnique.mockResolvedValue(null);

      await expect(
        service.markForReupload('bad-id', 'Please re-upload'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should mark document for re-upload', async () => {
      prisma.studentDocument.findUnique.mockResolvedValue(mockDoc);
      prisma.studentDocument.update.mockResolvedValue({
        ...mockDoc,
        status: 'REUPLOAD_REQUIRED',
        remarks: 'Please re-upload',
      });

      const result = await service.markForReupload(
        'doc-1',
        'Please re-upload',
      );

      expect(result.status).toBe('REUPLOAD_REQUIRED');
      expect(result.remarks).toBe('Please re-upload');
    });
  });

  describe('getDocumentTypes', () => {
    it('should return cached document types', async () => {
      redis.getOrSet.mockResolvedValue([mockDocumentType]);

      const result = await service.getDocumentTypes();

      expect(result).toEqual([mockDocumentType]);
      expect(redis.getOrSet).toHaveBeenCalledWith(
        'document:types',
        expect.any(Function),
        86400,
      );
    });
  });

  describe('createDocumentType', () => {
    it('should throw BadRequestException when code exists', async () => {
      prisma.documentType.findUnique.mockResolvedValue(mockDocumentType);

      await expect(
        service.createDocumentType({
          name: 'Passport',
          code: 'PASSPORT',
          requiredForStage: 1,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create document type and invalidate cache', async () => {
      prisma.documentType.findUnique.mockResolvedValue(null);
      prisma.documentType.create.mockResolvedValue(mockDocumentType);

      const result = await service.createDocumentType({
        name: 'Passport',
        code: 'PASSPORT',
        requiredForStage: 1,
      });

      expect(result).toEqual(mockDocumentType);
      expect(redis.del).toHaveBeenCalledWith('document:types');
    });
  });

  describe('updateDocumentType', () => {
    it('should throw NotFoundException when type not found', async () => {
      prisma.documentType.findUnique.mockResolvedValue(null);

      await expect(
        service.updateDocumentType('bad-id', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update document type and invalidate cache', async () => {
      prisma.documentType.findUnique.mockResolvedValue(mockDocumentType);
      prisma.documentType.update.mockResolvedValue({
        ...mockDocumentType,
        name: 'New Passport',
      });

      const result = await service.updateDocumentType('dt-1', {
        name: 'New Passport',
      });

      expect(result.name).toBe('New Passport');
      expect(redis.del).toHaveBeenCalledWith('document:types');
    });
  });

  describe('deleteDocumentType', () => {
    it('should soft-delete document type and invalidate cache', async () => {
      prisma.documentType.findUnique.mockResolvedValue(mockDocumentType);
      prisma.documentType.update.mockResolvedValue({
        ...mockDocumentType,
        isActive: false,
      });

      const result = await service.deleteDocumentType('dt-1');

      expect(result.isActive).toBe(false);
      expect(redis.del).toHaveBeenCalledWith('document:types');
    });
  });
});
