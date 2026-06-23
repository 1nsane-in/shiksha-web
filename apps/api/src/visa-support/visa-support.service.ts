import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VisaApplicationStatus } from '@prisma/client';
import {
  CreateVisaCenterDto,
  UpdateVisaCenterDto,
  CreateVisaChecklistDto,
  UpdateVisaChecklistDto,
  CreateVisaApplicationDto,
  UpdateVisaApplicationDto,
} from './dto';

@Injectable()
export class VisaSupportService {
  constructor(private prisma: PrismaService) {}

  // ===== Visa Centers ===== //
  async createVisaCenter(dto: CreateVisaCenterDto) {
    return this.prisma.visaCenter.create({ data: dto });
  }
  async getAllVisaCenters() {
    return this.prisma.visaCenter.findMany({ orderBy: { createdAt: 'desc' } });
  }
  async getVisaCenter(id: string) {
    const c = await this.prisma.visaCenter.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Visa center not found');
    return c;
  }
  async updateVisaCenter(id: string, dto: UpdateVisaCenterDto) {
    await this.getVisaCenter(id);
    return this.prisma.visaCenter.update({ where: { id }, data: dto });
  }
  async deleteVisaCenter(id: string) {
    await this.getVisaCenter(id);
    return this.prisma.visaCenter.delete({ where: { id } });
  }

  // ===== Visa Checklists ===== //
  async createVisaChecklist(dto: CreateVisaChecklistDto) {
    return this.prisma.visaChecklist.create({ data: dto });
  }
  async getAllVisaChecklists(country?: string) {
    return this.prisma.visaChecklist.findMany({
      where: country ? { country } : {},
      orderBy: { createdAt: 'desc' },
    });
  }
  async getVisaChecklist(id: string) {
    const cl = await this.prisma.visaChecklist.findUnique({ where: { id } });
    if (!cl) throw new NotFoundException('Visa checklist not found');
    return cl;
  }
  async updateVisaChecklist(id: string, dto: UpdateVisaChecklistDto) {
    await this.getVisaChecklist(id);
    return this.prisma.visaChecklist.update({ where: { id }, data: dto });
  }
  async deleteVisaChecklist(id: string) {
    await this.getVisaChecklist(id);
    return this.prisma.visaChecklist.delete({ where: { id } });
  }

  // ===== Visa Applications ===== //
  async createVisaApplication(dto: CreateVisaApplicationDto) {
    return this.prisma.visaApplication.create({
      data: dto,
      include: { visaCenter: true, checklist: true },
    });
  }
  async getStudentVisaApplications(studentId: string) {
    return this.prisma.visaApplication.findMany({
      where: { studentId },
      include: { visaCenter: true, checklist: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  async getAllVisaApplications(status?: string) {
    return this.prisma.visaApplication.findMany({
      where: status ? { status: status as VisaApplicationStatus } : {},
      include: { visaCenter: true, checklist: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  async getVisaApplication(id: string) {
    const app = await this.prisma.visaApplication.findUnique({
      where: { id },
      include: { visaCenter: true, checklist: true },
    });
    if (!app) throw new NotFoundException('Visa application not found');
    return app;
  }
  async updateVisaApplication(id: string, dto: UpdateVisaApplicationDto) {
    await this.getVisaApplication(id);
    return this.prisma.visaApplication.update({
      where: { id },
      data: dto,
      include: { visaCenter: true, checklist: true },
    });
  }
  async submitVisaApplication(id: string) {
    const app = await this.getVisaApplication(id);
    if (app.status !== 'DRAFT')
      throw new BadRequestException('Only DRAFT can be submitted');
    return this.prisma.visaApplication.update({
      where: { id },
      data: { status: 'SUBMITTED', submittedAt: new Date() },
      include: { visaCenter: true, checklist: true },
    });
  }
  async decideVisaApplication(
    id: string,
    decision: 'APPROVED' | 'REJECTED',
    userId: string,
    remarks?: string,
  ) {
    const app = await this.getVisaApplication(id);
    if (app.status !== 'SUBMITTED' && app.status !== 'PROCESSING') {
      throw new BadRequestException('Must be SUBMITTED or PROCESSING');
    }
    return this.prisma.visaApplication.update({
      where: { id },
      data: {
        status: decision,
        decidedAt: new Date(),
        decidedBy: userId,
        remarks,
      },
      include: { visaCenter: true, checklist: true },
    });
  }
  async getVisaCountries() {
    const centers = await this.prisma.visaCenter.findMany({
      where: { isActive: true },
      select: { country: true },
      distinct: ['country'],
    });
    const checklists = await this.prisma.visaChecklist.findMany({
      where: { isActive: true },
      select: { country: true },
      distinct: ['country'],
    });
    const set = new Set(centers.map((c: any) => c.country));
    checklists.forEach((c: any) => set.add(c.country));
    return Array.from(set).sort();
  }
}
