import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateExamDto, 
  UpdateExamDto, 
  CreateQuestionDto, 
  UpdateQuestionDto,
  ReorderQuestionsDto,
  ProctoringConfigDto 
} from './dto/create-exam.dto';
import { ExamStatus } from './types/exam.types';

@Injectable()
export class OnlineExamsService {
  constructor(private prisma: PrismaService) {}

  // ──────────────────────────────────────────────────────────────
  // EXAM CRUD
  // ──────────────────────────────────────────────────────────────

  async createExam(userId: string, dto: CreateExamDto) {
    const { 
      universityId, 
      dateWindowStart, 
      dateWindowEnd, 
      passingPercentage = 50,
      maxAttempts = 1,
      resultTiming = 'IMMEDIATE',
      shuffleQuestions = true,
      shuffleOptions = true,
      ...examData
    } = dto;

    // Validate date window
    if (new Date(dateWindowStart) >= new Date(dateWindowEnd)) {
      throw new BadRequestException('Start date must be before end date');
    }

    const exam = await this.prisma.exam.create({
      data: {
        ...examData,
        universityId,
        dateWindowStart: new Date(dateWindowStart),
        dateWindowEnd: new Date(dateWindowEnd),
        passingPercentage,
        maxAttempts,
        resultTiming,
        shuffleQuestions,
        shuffleOptions,
        status: ExamStatus.DRAFT,
        totalMarks: 0,
        createdBy: userId,
      },
      include: {
        university: {
          select: { id: true, name: true, shortName: true },
        },
      },
    });

    // Create default proctoring config
    await this.prisma.examProctoringConfig.create({
      data: {
        examId: exam.id,
        aiProctoringEnabled: true,
        webcamRequired: true,
        microphoneRequired: true,
        screenRecordingEnabled: true,
        faceDetectionEnabled: true,
        gazeTrackingEnabled: true,
        tabSwitchWarnings: 3,
        autoSubmitOnViolation: false,
        connectivityGraceMinutes: 2,
      },
    });

    return exam;
  }

  async updateExam(examId: string, userId: string, dto: UpdateExamDto) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    // Only allow updates if exam is in DRAFT or SCHEDULED status
    if (exam.status === ExamStatus.ACTIVE || exam.status === ExamStatus.COMPLETED) {
      throw new ForbiddenException('Cannot update active or completed exam');
    }

    const { dateWindowStart, dateWindowEnd, ...updateData } = dto;

    return this.prisma.exam.update({
      where: { id: examId },
      data: {
        ...updateData,
        ...(dateWindowStart && { dateWindowStart: new Date(dateWindowStart) }),
        ...(dateWindowEnd && { dateWindowEnd: new Date(dateWindowEnd) }),
        updatedAt: new Date(),
      },
      include: {
        university: {
          select: { id: true, name: true, shortName: true },
        },
      },
    });
  }

  async getExamById(examId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: {
        university: {
          select: { id: true, name: true, shortName: true },
        },
        questions: {
          include: { options: true },
          orderBy: { orderIndex: 'asc' },
        },
        proctoringConfig: true,
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return exam;
  }

  async getAllExams(query: {
    page?: number;
    limit?: number;
    status?: ExamStatus;
    universityId?: string;
  }) {
    const { page = 1, limit = 20, status, universityId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (universityId) where.universityId = universityId;

    const [exams, total] = await Promise.all([
      this.prisma.exam.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          university: {
            select: { id: true, name: true, shortName: true },
          },
          _count: {
            select: { questions: true, registrations: true },
          },
        },
      }),
      this.prisma.exam.count({ where }),
    ]);

    return {
      data: exams,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async publishExam(examId: string, userId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (exam.status !== ExamStatus.DRAFT) {
      throw new ForbiddenException('Only draft exams can be published');
    }

    // Validate exam has questions
    if (exam.questions.length === 0) {
      throw new BadRequestException('Exam must have at least one question');
    }

    // Calculate total marks
    const totalMarks = exam.questions.reduce((sum, q) => sum + Number(q.marks), 0);

    return this.prisma.exam.update({
      where: { id: examId },
      data: {
        status: ExamStatus.SCHEDULED,
        totalMarks,
        publishedAt: new Date(),
      },
      include: {
        university: {
          select: { id: true, name: true },
        },
      },
    });
  }

  // ──────────────────────────────────────────────────────────────
  // QUESTION CRUD
  // ──────────────────────────────────────────────────────────────

  async addQuestion(examId: string, dto: CreateQuestionDto) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: { orderBy: { orderIndex: 'desc' }, take: 1 } },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (exam.status !== ExamStatus.DRAFT) {
      throw new ForbiddenException('Cannot modify questions for published exam');
    }

    const orderIndex = exam.questions.length > 0 ? (exam.questions[0]?.orderIndex ?? 0) + 1 : 1;
    const { options, config, ...questionData } = dto;

    // Validate options for MCQ types
    if (['SINGLE_CHOICE', 'MULTI_CHOICE', 'TRUE_FALSE'].includes(dto.type)) {
      if (!options || options.length < 2) {
        throw new BadRequestException('MCQ questions must have at least 2 options');
      }
      if (!options.some(o => o.isCorrect)) {
        throw new BadRequestException('At least one option must be marked as correct');
      }
    }

    const question = await this.prisma.examQuestion.create({
      data: {
        ...questionData,
        examId,
        orderIndex,
        config: config || {},
      },
    });

    // Create options
    if (options && options.length > 0) {
      await this.prisma.examQuestionOption.createMany({
        data: options.map((opt, idx) => ({
          questionId: question.id,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          orderIndex: idx + 1,
        })),
      });
    }

    return this.prisma.examQuestion.findUnique({
      where: { id: question.id },
      include: { options: true },
    });
  }

  async updateQuestion(examId: string, questionId: string, dto: UpdateQuestionDto) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (exam.status !== ExamStatus.DRAFT) {
      throw new ForbiddenException('Cannot modify questions for published exam');
    }

    const question = await this.prisma.examQuestion.findUnique({
      where: { id: questionId, examId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const { options, config, ...updateData } = dto;

    // Update question
    await this.prisma.examQuestion.update({
      where: { id: questionId },
      data: {
        ...updateData,
        config: (config || question.config) as any,
      },
    });

    // Update options if provided
    if (options && options.length > 0) {
      // Delete old options
      await this.prisma.examQuestionOption.deleteMany({
        where: { questionId },
      });

      // Create new options
      await this.prisma.examQuestionOption.createMany({
        data: options.map((opt, idx) => ({
          questionId,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          orderIndex: idx + 1,
        })),
      });
    }

    return this.prisma.examQuestion.findUnique({
      where: { id: questionId },
      include: { options: true },
    });
  }

  async deleteQuestion(examId: string, questionId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (exam.status !== ExamStatus.DRAFT) {
      throw new ForbiddenException('Cannot delete questions from published exam');
    }

    const question = await this.prisma.examQuestion.findUnique({
      where: { id: questionId, examId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.prisma.examQuestion.delete({
      where: { id: questionId },
    });

    // Reorder remaining questions
    const remainingQuestions = await this.prisma.examQuestion.findMany({
      where: { examId },
      orderBy: { orderIndex: 'asc' },
    });

    await Promise.all(
      remainingQuestions.map((q, idx) =>
        this.prisma.examQuestion.update({
          where: { id: q.id },
          data: { orderIndex: idx + 1 },
        })
      )
    );

    return { success: true };
  }

  async reorderQuestions(examId: string, dto: ReorderQuestionsDto) {
    const { questionIds } = dto;

    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (exam.status !== ExamStatus.DRAFT) {
      throw new ForbiddenException('Cannot reorder questions in published exam');
    }

    // Verify all questions belong to this exam
    const existingQuestions = await this.prisma.examQuestion.findMany({
      where: { examId },
      select: { id: true },
    });

    const existingIds = existingQuestions.map(q => q.id);
    const allPresent = questionIds.every(id => existingIds.includes(id));

    if (!allPresent || questionIds.length !== existingIds.length) {
      throw new BadRequestException('Invalid question IDs');
    }

    // Update order indices
    await Promise.all(
      questionIds.map((id, index) =>
        this.prisma.examQuestion.update({
          where: { id },
          data: { orderIndex: index + 1 },
        })
      )
    );

    return { success: true };
  }

  // ──────────────────────────────────────────────────────────────
  // PROCTORING CONFIG
  // ──────────────────────────────────────────────────────────────

  async updateProctoringConfig(examId: string, dto: ProctoringConfigDto) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { proctoringConfig: true },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (exam.proctoringConfig) {
      return this.prisma.examProctoringConfig.update({
        where: { examId },
        data: dto,
      });
    }

    return this.prisma.examProctoringConfig.create({
      data: {
        examId,
        ...dto,
      },
    });
  }

  async getProctoringConfig(examId: string) {
    const config = await this.prisma.examProctoringConfig.findUnique({
      where: { examId },
    });

    if (!config) {
      throw new NotFoundException('Proctoring config not found');
    }

    return config;
  }
}
