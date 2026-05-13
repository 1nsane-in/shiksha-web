import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStudentProfileDto, UpdateAcademicDto, AdminUpdateStudentDto, AssignUniversityDto } from './students.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

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
          include: {
            documentType: true,
          },
        },
        payments: true,
        applications: {
          include: {
            course: {
              include: {
                university: true,
              },
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

  async updateProfile(userId: string, dto: UpdateStudentProfileDto | UpdateAcademicDto) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const updatedStudent = await this.prisma.student.update({
      where: { userId },
      data: dto,
    });

    return updatedStudent;
  }

  async getStageInfo(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      select: {
        currentStage: true,
        applicationStatus: true,
        documents: {
          include: {
            documentType: true,
          },
        },
        payments: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const stageRequirements = {
      1: {
        documents: ['passport', 'aadhaar', '12th_marksheet', 'neet_result'],
        payment: 10000,
      },
      2: {
        documents: ['passport_translated', '12th_marksheet_translated'],
        payment: 5000,
      },
      4: {
        payment: 5000,
      },
    };

    const currentStageRequirements = stageRequirements[student.currentStage] || null;

    return {
      currentStage: student.currentStage,
      applicationStatus: student.applicationStatus,
      requirements: currentStageRequirements,
      documents: student.documents,
      payments: student.payments,
    };
  }

  async findAll(page: number = 1, limit: number = 10, status?: string, stage?: number) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.applicationStatus = status;
    }

    if (stage) {
      where.currentStage = stage;
    }

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
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
                include: {
                  university: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      data: students,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        documents: {
          include: {
            documentType: true,
          },
        },
        payments: true,
        applications: {
          include: {
            course: {
              include: {
                university: true,
              },
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
    await this.findOne(id);

    const student = await this.prisma.student.update({
      where: { id },
      data: dto,
    });

    return student;
  }

  async updateStage(id: string, stage: number, status?: string) {
    await this.findOne(id);

    const updateData: any = { currentStage: stage };
    if (status) {
      updateData.applicationStatus = status;
    }

    const student = await this.prisma.student.update({
      where: { id },
      data: updateData,
    });

    return student;
  }

  async assignUniversity(id: string, dto: AssignUniversityDto) {
    const student = await this.findOne(id);

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
    const [
      total,
      byStage,
      byStatus,
    ] = await Promise.all([
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
      byStage: byStage.reduce((acc, item) => {
        acc[item.currentStage] = item._count;
        return acc;
      }, {} as Record<number, number>),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.applicationStatus] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
