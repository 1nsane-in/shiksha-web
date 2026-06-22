import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUniversityRequestDto } from './dto/create-university-request.dto';
import { UpdateUniversityRequestDto } from './dto/update-university-request.dto';
import { UniversityRequestStatus } from '@prisma/client';

@Injectable()
export class UniversityRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUniversityRequestDto) {
    return this.prisma.universityRequest.create({
      data: {
        universityName: dto.universityName,
        country: dto.country,
        state: dto.state,
        website: dto.website,
        type: dto.type,
        programs: dto.programs,
        otherPrograms: dto.otherPrograms,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        additionalInfo: dto.additionalInfo,
        status: UniversityRequestStatus.PENDING,
      },
    });
  }

  async findAll(status?: UniversityRequestStatus) {
    const where = status ? { status } : {};
    return this.prisma.universityRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.universityRequest.findUnique({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('University request not found');
    }
    return request;
  }

  async update(id: string, dto: UpdateUniversityRequestDto) {
    await this.findOne(id);
    return this.prisma.universityRequest.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.universityRequest.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, pending, underReview, approved, rejected, added] = await Promise.all([
      this.prisma.universityRequest.count(),
      this.prisma.universityRequest.count({ where: { status: UniversityRequestStatus.PENDING } }),
      this.prisma.universityRequest.count({ where: { status: UniversityRequestStatus.UNDER_REVIEW } }),
      this.prisma.universityRequest.count({ where: { status: UniversityRequestStatus.APPROVED } }),
      this.prisma.universityRequest.count({ where: { status: UniversityRequestStatus.REJECTED } }),
      this.prisma.universityRequest.count({ where: { status: UniversityRequestStatus.ADDED } }),
    ]);

    return {
      total,
      pending,
      underReview,
      approved,
      rejected,
      added,
    };
  }
}
