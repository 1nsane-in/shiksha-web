import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TimelineService } from '../common/services/timeline.service';
import { NotificationService } from '../common/services/notification.service';
import { ScheduleExamDto, DeclareExamResultDto } from './dto/exam.dto';

@Injectable()
export class ExamsService {
  constructor(
    private prisma: PrismaService,
    private timeline: TimelineService,
    private notification: NotificationService,
  ) {}

  async scheduleExam(adminId: string, dto: ScheduleExamDto) {
    const application = await this.prisma.universityApplication.findUnique({
      where: { id: dto.applicationId },
      include: { student: { include: { user: true } } },
    });
    if (!application) throw new NotFoundException('Application not found');
    if (application.student.currentStage < 3) {
      throw new BadRequestException('Student must complete Stage 2 first');
    }

    const existing = await this.prisma.examRecord.findUnique({
      where: { applicationId: dto.applicationId },
    });

    let exam: any;
    if (existing) {
      exam = await this.prisma.examRecord.update({
        where: { id: existing.id },
        data: {
          examDate: new Date(dto.examDate),
          examSubject: dto.examSubject,
          examCenter: dto.examCenter,
          attemptNumber: dto.attemptNumber || existing.attemptNumber + 1,
        },
      });
    } else {
      exam = await this.prisma.examRecord.create({
        data: {
          applicationId: dto.applicationId,
          studentId: application.studentId,
          examDate: new Date(dto.examDate),
          examSubject: dto.examSubject,
          examCenter: dto.examCenter,
          attemptNumber: dto.attemptNumber || 1,
          result: 'AWAITED',
        },
      });
    }

    await this.timeline.onExamScheduled(
      dto.applicationId,
      application.studentId,
      dto.examDate,
      dto.examCenter,
    );

    await this.notification.create({
      userId: application.student.user.id,
      type: 'EXAM_SCHEDULED',
      title: 'Entrance Exam Scheduled',
      message:
        'Your exam is scheduled on ' +
        dto.examDate +
        ' at ' +
        dto.examCenter +
        '.',
      data: { applicationId: dto.applicationId, examId: exam.id },
    });

    return exam;
  }

  async declareResult(adminId: string, dto: DeclareExamResultDto) {
    const exam = await this.prisma.examRecord.findUnique({
      where: { id: dto.examId },
      include: {
        application: { include: { student: { include: { user: true } } } },
      },
    });
    if (!exam) throw new NotFoundException('Exam record not found');

    const passed = dto.result === 'PASSED';

    const updated = await this.prisma.examRecord.update({
      where: { id: exam.id },
      data: {
        result: passed ? 'PASSED' : 'FAILED',
        resultDeclaredAt: new Date(),
        resultRemarks: dto.remarks,
      },
    });

    await this.timeline.onExamResultDeclared(
      exam.applicationId,
      exam.studentId,
      passed,
      dto.remarks,
    );

    // Auto advance if passed
    if (passed && exam.application?.student) {
      const student = exam.application.student;
      if (student.currentStage < 4) {
        const oldStage = student.currentStage;
        await this.prisma.student.update({
          where: { id: student.id },
          data: { currentStage: 4, applicationStatus: 'STAGE_4_PENDING' },
        });
        await this.timeline.onStageAdvanced(
          exam.applicationId,
          student.id,
          oldStage,
          4,
        );
      }
    }

    const userId = exam.application?.student?.user?.id;
    if (userId) {
      await this.notification.create({
        userId,
        type: passed ? 'EXAM_PASSED' : 'EXAM_FAILED',
        title: passed ? 'Entrance Exam Passed' : 'Entrance Exam Failed',
        message: passed
          ? 'Congratulations! You passed the entrance exam. Proceeding to invitation letter stage.'
          : dto.remarks ||
            'You did not pass the exam. Contact support for next steps.',
        data: {
          applicationId: exam.applicationId,
          examId: exam.id,
          result: dto.result,
        },
      });
    }

    return updated;
  }

  async getExamByApplication(
    applicationId: string,
    userId: string,
    userRole: string,
  ) {
    const exam = await this.prisma.examRecord.findUnique({
      where: { applicationId },
      include: { application: { include: { student: true } } },
    });
    if (!exam) throw new NotFoundException('Exam record not found');
    if (
      userRole !== 'ADMIN' &&
      userRole !== 'SUPER_ADMIN' &&
      exam.application?.student?.userId !== userId
    ) {
      throw new NotFoundException('Exam record not found');
    }
    return exam;
  }

  async getMyExam(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found');
    return this.prisma.examRecord.findFirst({
      where: { studentId: student.id },
      orderBy: { attemptNumber: 'desc' },
    });
  }

  async getAllExams(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.examRecord.findMany({
        include: {
          application: {
            select: {
              id: true,
              university: { select: { name: true, shortName: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.examRecord.count(),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
