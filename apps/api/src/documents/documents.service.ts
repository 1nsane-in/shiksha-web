import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadDocumentDto, VerifyDocumentDto, CreateDocumentTypeDto, UpdateDocumentTypeDto } from './documents.dto';
import { PaginatorService } from '../common/services/paginator.service';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private paginator: PaginatorService,
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
      throw new BadRequestException('Document already uploaded and pending review');
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
    return this.prisma.documentType.findMany({
      where: { isActive: true },
      orderBy: { requiredForStage: 'asc' },
    });
  }

  async createDocumentType(dto: CreateDocumentTypeDto) {
    const existing = await this.prisma.documentType.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException('Document type with this code already exists');
    }

    return this.prisma.documentType.create({ data: dto });
  }

  async updateDocumentType(id: string, dto: UpdateDocumentTypeDto) {
    const documentType = await this.prisma.documentType.findUnique({
      where: { id },
    });

    if (!documentType) {
      throw new NotFoundException('Document type not found');
    }

    return this.prisma.documentType.update({
      where: { id },
      data: dto,
    });
  }

  async deleteDocumentType(id: string) {
    const documentType = await this.prisma.documentType.findUnique({
      where: { id },
    });

    if (!documentType) {
      throw new NotFoundException('Document type not found');
    }

    return this.prisma.documentType.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
