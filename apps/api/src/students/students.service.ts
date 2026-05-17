import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateStudentProfileDto,
  UpdateAcademicDto,
  AdminUpdateStudentDto,
  AssignUniversityDto,
} from './students.dto';
import { PaginatorService } from '../common/services/paginator.service';
import { createQueryBuilder } from '../common/helpers/prisma-query-builder';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private paginator: PaginatorService,
  ) {}

  async getProfile(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            avatarUrl: true,
          },
        },
        documents: {
          include: { documentType: true },
        },
        payments: true,
        applications: {
          include: {
            course: {
              include: { university: true },
            },
          },
        },
      },
    });

    if (!student) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async updateProfile(
    userId: string,
    dto: UpdateStudentProfileDto | UpdateAcademicDto,
  ) {
    const { NotFoundException } = await import('@nestjs/common');

    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.student.update({
      where: { userId },
      data: dto,
    });
  }

  async getStageInfo(userId: string) {
    const { NotFoundException } = await import('@nestjs/common');

    const student = await this.prisma.student.findUnique({
      where: { userId },
      select: {
        currentStage: true,
        applicationStatus: true,
        documents: {
          include: { documentType: true },
        },
        payments: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const requirements = await (this.prisma as any).stageRequirement.findMany({
      where: { stage: student.currentStage, isActive: true },
    });

    return {
      currentStage: student.currentStage,
      applicationStatus: student.applicationStatus,
      requirements,
      documents: student.documents,
      payments: student.payments,
    };
  }

  async findAll(page = 1, limit = 10, status?: string, stage?: number) {
    const where = createQueryBuilder()
      .where('applicationStatus', status)
      .where('currentStage', stage)
      .build();

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip: this.paginator.getSkip({ page, limit }),
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
            },
          },
          applications: {
            include: {
              course: {
                include: { university: true },
              },
            },
          },
        },
      }),
      this.prisma.student.count({ where }),
    ]);

    return this.paginator.wrapResult(students, total, { page, limit });
  }

  async findOne(id: string) {
    const { NotFoundException } = await import('@nestjs/common');

    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        documents: {
          include: { documentType: true },
        },
        payments: true,
        applications: {
          include: {
            course: {
              include: { university: true },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async adminUpdate(id: string, dto: AdminUpdateStudentDto) {
    const { NotFoundException } = await import('@nestjs/common');

    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    return this.prisma.student.update({
      where: { id },
      data: updateData,
    });
  }

  async updateStage(id: string, stage: number, status?: string) {
    const { NotFoundException } = await import('@nestjs/common');

    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const updateData: Record<string, number | string> = {
      currentStage: stage,
    };
    if (status) {
      updateData.applicationStatus = status;
    }

    return this.prisma.student.update({
      where: { id },
      data: updateData,
    });
  }

  async assignUniversity(id: string, dto: AssignUniversityDto) {
    const { NotFoundException } = await import('@nestjs/common');

    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const course = await this.prisma.universityCourse.findUnique({
      where: { id: dto.courseId },
      include: { university: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const application = await this.prisma.universityApplication.create({
      data: {
        studentId: id,
        courseId: dto.courseId,
        status: 'pending',
      },
    });

    return {
      message: 'University assigned successfully',
      application,
      university: course.university,
      course,
    };
  }

  async getStats() {
    const [total, byStage, byStatus] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.groupBy({
        by: ['currentStage'],
        _count: true,
      }),
      this.prisma.student.groupBy({
        by: ['applicationStatus'],
        _count: true,
      }),
    ]);

    return {
      total,
      byStage: byStage.reduce(
        (acc, item) => {
          acc[item.currentStage] = item._count;
          return acc;
        },
        {} as Record<number, number>,
      ),
      byStatus: byStatus.reduce(
        (acc, item) => {
          acc[item.applicationStatus] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
