import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import {
  UploadDocumentDto,
  VerifyDocumentDto,
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
} from './documents.dto';
import { PaginatorService } from '../common/services/paginator.service';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private paginator: PaginatorService,
    private redis: RedisService,
  ) {}

  async getStudentDocuments(studentId: string) {
    return this.prisma.studentDocument.findMany({
      where: { studentId },
      include: { documentType: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async uploadDocument(studentId: string, dto: UploadDocumentDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const documentType = await this.prisma.documentType.findUnique({
      where: { id: dto.documentTypeId },
    });

    if (!documentType) {
      throw new NotFoundException('Document type not found');
    }

    const existingDocument = await this.prisma.studentDocument.findFirst({
      where: {
        studentId,
        documentTypeId: dto.documentTypeId,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingDocument && existingDocument.status === 'UPLOADED') {
      throw new BadRequestException(
        'Document already uploaded and pending review',
      );
    }

    return this.prisma.studentDocument.create({
      data: {
        studentId,
        documentTypeId: dto.documentTypeId,
        fileUrl: dto.fileUrl,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        status: 'UPLOADED',
      },
      include: { documentType: true },
    });
  }

  async getMyDocuments(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.getStudentDocuments(student.id);
  }

  async uploadMyDocument(userId: string, dto: UploadDocumentDto) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.uploadDocument(student.id, dto);
  }

  async getPendingDocuments(page = 1, limit = 20) {
    const where = { status: 'UPLOADED' as const };

    const [documents, total] = await Promise.all([
      this.prisma.studentDocument.findMany({
        where,
        skip: this.paginator.getSkip({ page, limit }),
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          documentType: true,
        },
      }),
      this.prisma.studentDocument.count({ where }),
    ]);

    return this.paginator.wrapResult(documents, total, { page, limit });
  }

  async verifyDocument(id: string, adminId: string, dto: VerifyDocumentDto) {
    const document = await this.prisma.studentDocument.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.status !== 'UPLOADED' && document.status !== 'IN_REVIEW') {
      throw new BadRequestException('Document cannot be verified');
    }

    return this.prisma.studentDocument.update({
      where: { id },
      data: {
        status: dto.status,
        remarks: dto.remarks,
        verifiedBy: adminId,
        verifiedAt: new Date(),
      },
      include: {
        student: {
          include: { user: true },
        },
        documentType: true,
      },
    });
  }

  async markForReupload(id: string, remarks: string) {
    const document = await this.prisma.studentDocument.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return this.prisma.studentDocument.update({
      where: { id },
      data: {
        status: 'REUPLOAD_REQUIRED',
        remarks,
      },
    });
  }

  async getDocumentTypes() {
    return this.redis.getOrSet(
      'document:types',
      async () => {
        let types = await this.prisma.documentType.findMany({
          where: { isActive: true },
          orderBy: { requiredForStage: 'asc' },
        });

        if (types.length === 0) {
          types = await this.createDefaultTypes();
        }

        return types;
      },
      86400, // Cache for 24 hours
    );
  }

  private async createDefaultTypes() {
    const defaults = [
      { code: 'aadhaar-front', name: 'Aadhaar Card (Front)', description: 'Front side — photo, DOB, Aadhaar number', requiredForStage: 1 },
      { code: 'aadhaar-back', name: 'Aadhaar Card (Back)', description: 'Back side — address', requiredForStage: 1 },
      { code: 'pan-front', name: 'PAN Card (Front)', description: 'Front side — photo, PAN number, name', requiredForStage: 1 },
      { code: 'pan-back', name: 'PAN Card (Back)', description: 'Back side', requiredForStage: 1 },
      { code: 'tenth', name: '10th Marksheet', description: 'Class X marksheet', requiredForStage: 1 },
      { code: 'twelfth', name: '12th Marksheet', description: 'Class XII marksheet', requiredForStage: 1 },
      { code: 'neet', name: 'NEET Scorecard', description: 'NEET UG admit card or scorecard', requiredForStage: 1 },
      { code: 'passport-front', name: 'Passport (Photo Page)', description: 'Photo, passport number, personal details', requiredForStage: 1 },
      { code: 'passport-back', name: 'Passport (Back Page)', description: 'Spouse, address, emergency info', requiredForStage: 1 },
    ];

    const created: any[] = [];
    for (const doc of defaults) {
      const existing = await this.prisma.documentType.findUnique({ where: { code: doc.code } });
      if (!existing) {
        created.push(await this.prisma.documentType.create({ data: doc }));
      } else {
        created.push(existing);
      }
    }
    return created;
  }

  async createDocumentType(dto: CreateDocumentTypeDto) {
    const existing = await this.prisma.documentType.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(
        'Document type with this code already exists',
      );
    }

    const result = await this.prisma.documentType.create({ data: dto });
    
    // Invalidate cache
    await this.redis.del('document:types');
    
    return result;
  }

  async updateDocumentType(id: string, dto: UpdateDocumentTypeDto) {
    const documentType = await this.prisma.documentType.findUnique({
      where: { id },
    });

    if (!documentType) {
      throw new NotFoundException('Document type not found');
    }

    const result = await this.prisma.documentType.update({
      where: { id },
      data: dto,
    });
    
    // Invalidate cache
    await this.redis.del('document:types');
    
    return result;
  }

  async deleteDocumentType(id: string) {
    const documentType = await this.prisma.documentType.findUnique({
      where: { id },
    });

    if (!documentType) {
      throw new NotFoundException('Document type not found');
    }

    const result = await this.prisma.documentType.update({
      where: { id },
      data: { isActive: false },
    });
    
    // Invalidate cache
    await this.redis.del('document:types');
    
    return result;
  }
}
