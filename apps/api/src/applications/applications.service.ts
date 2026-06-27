import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { PaginatorService } from '../common/services/paginator.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private paginator: PaginatorService,
    private redis: RedisService,
  ) {}

  async findAll(page = 1, limit = 10, status?: string, search?: string, fields?: string) {
    const cacheKey = `applications:list:${page}:${limit}:${status || 'all'}:${search || 'none'}:${fields || 'default'}`;

    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const where: Record<string, unknown> = {};

        if (status) {
          where.status = status;
        }

        if (search) {
          where.OR = [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ];
        }

        const select = this.buildApplicationSelect(fields);

        const [applications, total] = await Promise.all([
          this.prisma.universityApplication.findMany({
            where,
            skip: this.paginator.getSkip({ page, limit }),
            take: limit,
            orderBy: { submittedAt: 'desc' },
            select,
          }),
          this.prisma.universityApplication.count({ where }),
        ]);

        return this.paginator.wrapResult(applications, total, { page, limit });
      },
      300, // Cache for 5 minutes
    );
  }

  async findOne(id: string, fields?: string) {
    const cacheKey = fields
      ? `application:${id}:fields:${fields}`
      : `application:${id}`;

    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const select = this.buildApplicationDetailSelect(fields);

        const application = await this.prisma.universityApplication.findUnique({
          where: { id },
          ...(select ? { select } : {
            include: {
              university: true,
              admissionLetter: true,
              student: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      phone: true,
                    },
                  },
                  documents: {
                    include: { documentType: true },
                  },
                  // Scope to this application only: Payment.studentId is shared
                  // across the student's applications, so without a filter every
                  // payment record (incl. pre-seeded or other applications)
                  // would surface in the per-application Payment Ledger.
                  payments: {
                    where: { applicationId: id },
                    orderBy: { createdAt: 'desc' },
                  },
                },
              },
              timelineEvents: {
                orderBy: { occurredAt: 'desc' },
              },
              tickets: {
                take: 5,
                orderBy: { createdAt: 'desc' },
              },
            },
          }) as any,
        });

        if (!application) {
          throw new NotFoundException('Application not found');
        }

        return application;
      },
      300, // Cache for 5 minutes
    );
  }

  private buildApplicationSelect(fields?: string) {
    if (!fields) {
      return {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        selectedProgram: true,
        status: true,
        submittedAt: true,
        createdAt: true,
        updatedAt: true,
        university: {
          select: {
            id: true,
            name: true,
            shortName: true,
            slug: true,
          },
        },
        student: {
          select: {
            id: true,
            currentStage: true,
            applicationStatus: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      };
    }

    const fieldList = fields.split(',').map(f => f.trim()).filter(Boolean);
    if (fieldList.length === 0) return undefined;

    const select: any = { id: true };

    const allowedScalars = ['firstName', 'lastName', 'email', 'selectedProgram', 'status', 'submittedAt', 'createdAt', 'updatedAt', 'studentId', 'universityId', 'courseId'];

    for (const field of allowedScalars) {
      if (fieldList.includes(field)) {
        select[field] = true;
      }
    }

    // Handle university fields
    const uniFields = fieldList.filter(f => f.startsWith('university.'));
    if (uniFields.length > 0) {
      select.university = { select: {} as Record<string, boolean> };
      const allowedUni = ['id', 'name', 'shortName', 'slug', 'logo', 'type', 'status'];
      for (const uf of uniFields) {
        const key = uf.replace('university.', '');
        if (allowedUni.includes(key)) {
          select.university.select[key] = true;
        }
      }
      if (!select.university.select.id) {
        select.university.select.id = true;
      }
    }

    // Handle student fields
    const studentFields = fieldList.filter(f => f.startsWith('student.'));
    if (studentFields.length > 0) {
      select.student = { select: {} as Record<string, any> };
      const allowedStudent = ['id', 'currentStage', 'applicationStatus'];
      const allowedStudentUser = ['id', 'name', 'email', 'phone'];

      for (const sf of studentFields) {
        if (sf.startsWith('student.user.')) {
          const key = sf.replace('student.user.', '');
          if (!select.student.select.user) {
            select.student.select.user = { select: {} as Record<string, boolean> };
          }
          if (allowedStudentUser.includes(key)) {
            select.student.select.user.select[key] = true;
          }
        } else {
          const key = sf.replace('student.', '');
          if (allowedStudent.includes(key)) {
            select.student.select[key] = true;
          }
        }
      }
      if (!select.student.select.id) {
        select.student.select.id = true;
      }
    }

    return select;
  }

  private buildApplicationDetailSelect(fields?: string) {
    if (!fields) return undefined;

    const fieldList = fields.split(',').map(f => f.trim()).filter(Boolean);
    if (fieldList.length === 0) return undefined;

    const select: any = { id: true };

    const allowedScalars = ['firstName', 'lastName', 'email', 'selectedProgram', 'status', 'submittedAt', 'createdAt', 'updatedAt', 'studentId', 'universityId', 'courseId', 'formData'];

    for (const field of allowedScalars) {
      if (fieldList.includes(field)) {
        select[field] = true;
      }
    }

    const uniFields = fieldList.filter(f => f.startsWith('university.'));
    if (uniFields.length > 0) {
      select.university = { select: {} as Record<string, boolean> };
      const allowedUni = ['id', 'name', 'shortName', 'slug', 'logo', 'bannerImage', 'type', 'status', 'website', 'establishedYear'];
      for (const uf of uniFields) {
        const key = uf.replace('university.', '');
        if (allowedUni.includes(key)) {
          select.university.select[key] = true;
        }
      }
      if (!select.university.select.id) {
        select.university.select.id = true;
      }
    }

    if (fieldList.includes('admissionLetter')) {
      select.admissionLetter = true;
    }

    if (fieldList.includes('timelineEvents')) {
      select.timelineEvents = { orderBy: { occurredAt: 'desc' as const } };
    }

    if (fieldList.includes('tickets')) {
      select.tickets = { take: 5, orderBy: { createdAt: 'desc' as const } };
    }

    // Student fields for detail
    const studentFields = fieldList.filter(f => f.startsWith('student.') || f === 'student');
    if (studentFields.length > 0) {
      select.student = { include: {} as Record<string, any> };
      if (fieldList.includes('student') || studentFields.some(f => f.startsWith('student.user'))) {
        select.student.include.user = { select: { id: true, name: true, email: true, phone: true } };
      }
      if (fieldList.includes('student') || studentFields.some(f => f.startsWith('student.documents'))) {
        select.student.include.documents = { include: { documentType: true } };
      }
      if (fieldList.includes('student') || studentFields.some(f => f.startsWith('student.payments'))) {
        select.student.include.payments = { where: {} };
      }
    }

    return select;
  }

  async updateStatus(id: string, status: string) {
    const application = await this.prisma.universityApplication.findUnique({
      where: { id },
      include: { student: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const validStatuses = ['approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      );
    }

    const updated = await this.prisma.universityApplication.update({
      where: { id },
      data: { status },
    });

    // Invalidate caches
    await this.redis.del(`application:${id}`);
    await this.redis.deletePattern('applications:list:*');

    if (status === 'approved') {
      await this.prisma.student.update({
        where: { id: application.studentId },
        data: {
          currentStage: 2,
          applicationStatus: 'STAGE_1_APPROVED',
        },
      });

      await this.prisma.applicationTimeline.create({
        data: {
          applicationId: id,
          studentId: application.studentId,
          stage: 1,
          event: 'APPLICATION_APPROVED',
          title: 'Application Approved',
          description: 'Your university application has been approved.',
          occurredAt: new Date(),
        },
      });
    } else if (status === 'rejected') {
      await this.prisma.applicationTimeline.create({
        data: {
          applicationId: id,
          studentId: application.studentId,
          stage: 1,
          event: 'APPLICATION_REJECTED',
          title: 'Application Rejected',
          description: 'Your university application has been rejected.',
          occurredAt: new Date(),
        },
      });
    }

    return {
      message: `Application ${status} successfully`,
      application: updated,
    };
  }
}
