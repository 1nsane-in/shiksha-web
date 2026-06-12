import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatorService } from '../common/services/paginator.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private paginator: PaginatorService,
  ) {}

  async findAll(page = 1, limit = 10, status?: string, search?: string) {
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

    const [applications, total] = await Promise.all([
      this.prisma.universityApplication.findMany({
        where,
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
        },
      }),
      this.prisma.universityApplication.count({ where }),
    ]);

    return this.paginator.wrapResult(applications, total, { page, limit });
  }

  async findOne(id: string) {
    const application = await this.prisma.universityApplication.findUnique({
      where: { id },
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
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
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
