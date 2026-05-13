import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadDocumentDto, VerifyDocumentDto, CreateDocumentTypeDto, UpdateDocumentTypeDto } from './documents.dto';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async getStudentDocuments(studentId: string) {
    const documents = await this.prisma.studentDocument.findMany({
      where: { studentId },
      include: {
        documentType: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return documents;
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

    const document = await this.prisma.studentDocument.create({
      data: {
        studentId,
        documentTypeId: dto.documentTypeId,
        fileUrl: dto.fileUrl,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        status: 'UPLOADED',
      },
      include: {
        documentType: true,
      },
    });

    return document;
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

  async getPendingDocuments(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      this.prisma.studentDocument.findMany({
        where: {
          status: 'UPLOADED',
        },
        skip,
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
      this.prisma.studentDocument.count({
        where: { status: 'UPLOADED' },
      }),
    ]);

    return {
      data: documents,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

    const updatedDocument = await this.prisma.studentDocument.update({
      where: { id },
      data: {
        status: dto.status,
        remarks: dto.remarks,
        verifiedBy: adminId,
        verifiedAt: new Date(),
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        documentType: true,
      },
    });

    return updatedDocument;
  }

  async markForReupload(id: string, remarks: string) {
    const document = await this.prisma.studentDocument.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const updatedDocument = await this.prisma.studentDocument.update({
      where: { id },
      data: {
        status: 'REUPLOAD_REQUIRED',
        remarks,
      },
    });

    return updatedDocument;
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

    return this.prisma.documentType.create({
      data: dto,
    });
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
