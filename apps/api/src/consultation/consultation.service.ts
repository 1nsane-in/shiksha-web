import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@Injectable()
export class ConsultationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateConsultationDto) {
    return this.prisma.consultation.create({
      data: dto,
    });
  }

  async getAll() {
    return this.prisma.consultation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOne(id: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
    });
    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }
    return consultation;
  }

  async updateStatus(id: string, status: string) {
    await this.getOne(id);
    return this.prisma.consultation.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string) {
    await this.getOne(id);
    return this.prisma.consultation.delete({
      where: { id },
    });
  }
}
