import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import {
  UpdateStudentProfileDto,
  UpdateAcademicDto,
  AdminUpdateStudentDto,
  AssignUniversityDto,
} from './students.dto';
import { SubmitApplicationFormDto } from './dto/application-form.dto';
import { PaginatorService } from '../common/services/paginator.service';
import { createQueryBuilder } from '../common/helpers/prisma-query-builder';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private paginator: PaginatorService,
    private redis: RedisService,
  ) {}

  async getProfile(userId: string) {
    return this.redis.getOrSet(
      `student:profile:${userId}`,
      async () => {
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
                university: true,
              },
            },
          },
        });

        if (!student) {
          throw new NotFoundException('Student not found');
        }

        return student;
      },
      300, // Cache for 5 minutes
    );
  }

  async updateProfile(
    userId: string,
    dto: UpdateStudentProfileDto | UpdateAcademicDto,
  ) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const result = await this.prisma.student.update({
      where: { userId },
      data: dto,
    });
    
    // Invalidate profile cache
    await this.redis.del(`student:profile:${userId}`);
    
    return result;
  }

  async getStageInfo(userId: string) {
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

  async findAll(page = 1, limit = 10, status?: string, stage?: number, fields?: string) {
    const where = createQueryBuilder()
      .where('applicationStatus', status)
      .where('currentStage', stage)
      .build();

    const cacheKey = `students:list:${page}:${limit}:${status || 'all'}:${stage || 'all'}:${fields || 'default'}`;

    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const select = this.buildStudentSelect(fields);

        const [students, total] = await Promise.all([
          this.prisma.student.findMany({
            where,
            skip: this.paginator.getSkip({ page, limit }),
            take: limit,
            orderBy: { createdAt: 'desc' },
            select,
          }),
          this.prisma.student.count({ where }),
        ]);

        return this.paginator.wrapResult(students, total, { page, limit });
      },
      300,
    );
  }

  private buildStudentSelect(fields?: string) {
    const defaultSelect: any = {
      id: true,
      userId: true,
      currentStage: true,
      applicationStatus: true,
      neetScore: true,
      neetRank: true,
      twelfthPercentage: true,
      tenthPercentage: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    };

    if (!fields) return defaultSelect;

    const fieldList = fields.split(',').map(f => f.trim()).filter(Boolean);
    if (fieldList.length === 0) return defaultSelect;

    const select: any = { id: true }; // Always include id

    const allowed = {
      scalars: ['userId', 'currentStage', 'applicationStatus', 'neetScore', 'neetRank', 'twelfthPercentage', 'tenthPercentage', 'createdAt', 'updatedAt'],
      user: ['id', 'name', 'email', 'phone', 'avatarUrl'],
    };

    for (const field of allowed.scalars) {
      if (fieldList.includes(field)) {
        select[field] = true;
      }
    }

    // Handle user relation fields
    const userFields = fieldList.filter(f => f.startsWith('user.'));
    if (userFields.length > 0) {
      select.user = { select: {} as Record<string, boolean> };
      for (const uf of userFields) {
        const key = uf.replace('user.', '');
        if (allowed.user.includes(key)) {
          select.user.select[key] = true;
        }
      }
      // Always include user id if user fields requested
      if (!select.user.select.id) {
        select.user.select.id = true;
      }
    }

    return select;
  }

  async findOne(id: string, fields?: string) {
    const cacheKey = fields
      ? `student:${id}:fields:${fields}`
      : `student:${id}`;

    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const select = this.buildStudentDetailSelect(fields);

        const student = await this.prisma.student.findUnique({
          where: { id },
          ...(select ? { select } : { include: { user: true, documents: { include: { documentType: true } }, payments: true, applications: { include: { university: true } } } }) as any,
        });

        if (!student) {
          throw new NotFoundException('Student not found');
        }

        return student;
      },
      300,
    );
  }

  private buildStudentDetailSelect(fields?: string) {
    if (!fields) return undefined;

    const fieldList = fields.split(',').map(f => f.trim()).filter(Boolean);
    if (fieldList.length === 0) return undefined;

    const select: any = { id: true };

    const allowedScalars = ['userId', 'currentStage', 'applicationStatus', 'neetScore', 'neetRank', 'twelfthPercentage', 'tenthPercentage', 'createdAt', 'updatedAt'];
    const allowedUsers = ['id', 'name', 'email', 'phone', 'avatarUrl', 'role', 'isActive'];

    for (const field of allowedScalars) {
      if (fieldList.includes(field)) {
        select[field] = true;
      }
    }

    // Handle user relation fields
    const userFields = fieldList.filter(f => f.startsWith('user.'));
    if (userFields.length > 0) {
      select.user = { select: {} as Record<string, boolean> };
      for (const uf of userFields) {
        const key = uf.replace('user.', '');
        if (allowedUsers.includes(key)) {
          select.user.select[key] = true;
        }
      }
      if (!select.user.select.id) {
        select.user.select.id = true;
      }
    }

    if (fieldList.includes('documents')) {
      select.documents = { include: { documentType: true } };
    }

    if (fieldList.includes('payments')) {
      select.payments = true;
    }

    if (fieldList.includes('applications') || fieldList.some(f => f.startsWith('applications.'))) {
      select.applications = { include: { university: true } };
    }

    return select;
  }

  async adminUpdate(id: string, dto: AdminUpdateStudentDto) {
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

  async submitApplication(userId: string, dto: SubmitApplicationFormDto) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException(
        'Student profile not found. Please complete your profile first.',
      );
    }

    const dob = new Date(dto.dateOfBirth);
    const age = new Date().getFullYear() - dob.getFullYear();
    if (age < 16) {
      throw new BadRequestException('Applicant must be at least 16 years old');
    }

    const signatureDate = new Date(dto.signatureDate);
    if (signatureDate > new Date()) {
      throw new BadRequestException('Signature date cannot be in the future');
    }

    const university = await this.prisma.university.findUnique({
      where: { id: dto.universityId },
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    if (university.status !== 'ACTIVE') {
      throw new ConflictException(
        'This university is not currently accepting applications',
      );
    }

    const existingApplication =
      await this.prisma.universityApplication.findFirst({
        where: {
          studentId: student.id,
          universityId: dto.universityId,
          status: { not: 'rejected' },
        },
      });

    if (existingApplication) {
      throw new ConflictException(
        'You have already applied to this university',
      );
    }

    const formData = {
      middleName: dto.middleName,
      dateOfBirth: dto.dateOfBirth,
      placeOfBirth: { ...dto.placeOfBirth },
      citizenship: dto.citizenship,
      maritalStatus: dto.maritalStatus,
      gender: dto.gender,
      permanentAddress: dto.permanentAddress,
      permanentCity: dto.permanentCity,
      permanentState: dto.permanentState,
      permanentZip: dto.permanentZip,
      permanentCountry: dto.permanentCountry,
      embassyLocation: dto.embassyLocation,
      language1: { ...dto.language1 },
      language2: dto.language2 ? { ...dto.language2 } : undefined,
      otherLanguages: dto.otherLanguages,
      postGraduateDetail: dto.postGraduateDetail,
    } as any;

    const application = await this.prisma.universityApplication.create({
      data: {
        studentId: student.id,
        universityId: dto.universityId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        selectedProgram: dto.selectedProgram,
        submittedAt: new Date(),
        status: 'pending',
        formData,
      },
    });

    return {
      message: 'Application submitted successfully',
      applicationId: application.id,
    };
  }

  async getMyApplications(userId: string, page = 1, limit = 10) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const [applications, total] = await Promise.all([
      this.prisma.universityApplication.findMany({
        where: { studentId: student.id },
        skip: this.paginator.getSkip({ page, limit }),
        take: limit,
        orderBy: { submittedAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          selectedProgram: true,
          status: true,
          submittedAt: true,
          university: {
            select: {
              id: true,
              name: true,
              shortName: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.universityApplication.count({
        where: { studentId: student.id },
      }),
    ]);

    return this.paginator.wrapResult(applications, total, { page, limit });
  }

  async getMyApplicationById(userId: string, applicationId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const application = await this.prisma.universityApplication.findFirst({
      where: {
        id: applicationId,
        studentId: student.id,
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            shortName: true,
            slug: true,
            type: true,
            status: true,
            location: {
              select: {
                country: true,
                city: true,
              },
            },
            contact: {
              select: {
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async checkApplication(userId: string, universityId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      return { applied: false };
    }

    const application = await this.prisma.universityApplication.findFirst({
      where: {
        studentId: student.id,
        universityId,
        status: { not: 'rejected' },
      },
      select: {
        id: true,
        selectedProgram: true,
        status: true,
        submittedAt: true,
      },
    });

    if (!application) {
      return { applied: false };
    }

    return {
      applied: true,
      application,
    };
  }

  async assignUniversity(id: string, dto: AssignUniversityDto) {
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
        universityId: course.universityId,
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
