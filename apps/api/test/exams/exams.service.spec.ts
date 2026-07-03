import { Test, TestingModule } from '@nestjs/testing';
import { ExamsService } from '../../src/exams/exams.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TimelineService } from '../../src/common/services/timeline.service';
import { NotificationService } from '../../src/common/services/notification.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockPrisma = {
  examRecord: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  universityApplication: {
    findUnique: jest.fn(),
  },
  student: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockTimeline = {
  onExamScheduled: jest.fn(),
  onExamResultDeclared: jest.fn(),
  onStageAdvanced: jest.fn(),
};

const mockNotification = {
  create: jest.fn(),
};

describe('ExamsService', () => {
  let service: ExamsService;
  let prisma: typeof mockPrisma;
  let timeline: typeof mockTimeline;
  let notification: typeof mockNotification;

  const baseDate = new Date('2026-06-15');
  const mockApplication = {
    id: 'app-1',
    studentId: 'stu-1',
    student: {
      id: 'stu-1',
      userId: 'user-1',
      currentStage: 3,
      applicationStatus: 'STAGE_3_EXAM',
      user: { id: 'user-1', email: 'student@test.com' },
    },
  };

  const mockExam = {
    id: 'exam-1',
    applicationId: 'app-1',
    studentId: 'stu-1',
    examDate: baseDate,
    examSubject: 'Biology',
    examCenter: 'Center A',
    attemptNumber: 1,
    result: 'AWAITED',
    resultDeclaredAt: null,
    resultRemarks: null,
    createdAt: baseDate,
    updatedAt: baseDate,
  };

  const mockScheduleDto = {
    applicationId: 'app-1',
    examDate: '2026-06-15',
    examSubject: 'Biology',
    examCenter: 'Center A',
    attemptNumber: 1,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: TimelineService, useValue: mockTimeline },
        { provide: NotificationService, useValue: mockNotification },
      ],
    }).compile();

    service = module.get<ExamsService>(ExamsService);
    prisma = mockPrisma;
    timeline = mockTimeline;
    notification = mockNotification;
  });

  describe('scheduleExam', () => {
    it('should create a new exam record and trigger timeline + notification', async () => {
      prisma.universityApplication.findUnique.mockResolvedValue(mockApplication);
      prisma.examRecord.findUnique.mockResolvedValue(null);
      prisma.examRecord.create.mockResolvedValue(mockExam);

      const result = await service.scheduleExam('admin-1', mockScheduleDto);

      expect(prisma.universityApplication.findUnique).toHaveBeenCalledWith({
        where: { id: 'app-1' },
        include: { student: { include: { user: true } } },
      });
      expect(prisma.examRecord.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          applicationId: 'app-1',
          studentId: 'stu-1',
          examSubject: 'Biology',
          examCenter: 'Center A',
          attemptNumber: 1,
          result: 'AWAITED',
        }),
      });
      expect(timeline.onExamScheduled).toHaveBeenCalledWith(
        'app-1', 'stu-1', '2026-06-15', 'Center A',
      );
      expect(notification.create).toHaveBeenCalledWith({
        userId: 'user-1',
        type: 'EXAM_SCHEDULED',
        title: 'Entrance Exam Scheduled',
        message: expect.stringContaining('2026-06-15'),
        data: { applicationId: 'app-1', examId: 'exam-1' },
      });
      expect(result).toEqual(mockExam);
    });

    it('should throw NotFoundException when application does not exist', async () => {
      prisma.universityApplication.findUnique.mockResolvedValue(null);

      await expect(service.scheduleExam('admin-1', mockScheduleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when student stage < 3', async () => {
      prisma.universityApplication.findUnique.mockResolvedValue({
        ...mockApplication,
        student: { ...mockApplication.student, currentStage: 1 },
      });

      await expect(service.scheduleExam('admin-1', mockScheduleDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update existing exam record on re-schedule', async () => {
      prisma.universityApplication.findUnique.mockResolvedValue(mockApplication);
      prisma.examRecord.findUnique.mockResolvedValue(mockExam);
      prisma.examRecord.update.mockResolvedValue({ ...mockExam, attemptNumber: 2 });

      const result = await service.scheduleExam('admin-1', {
        ...mockScheduleDto,
        attemptNumber: 2,
      });

      expect(prisma.examRecord.update).toHaveBeenCalledWith({
        where: { id: 'exam-1' },
        data: expect.objectContaining({ attemptNumber: 2 }),
      });
      expect(result.attemptNumber).toBe(2);
    });
  });

  describe('declareResult', () => {
    const examWithRelations = {
      ...mockExam,
      application: {
        ...mockApplication,
        student: {
          ...mockApplication.student,
          id: 'stu-1',
          currentStage: 3,
          applicationStatus: 'STAGE_3_EXAM',
          user: { id: 'user-1' },
        },
      },
    };

    it('should update exam with PASSED and auto-advance student stage', async () => {
      prisma.examRecord.findUnique.mockResolvedValue(examWithRelations);
      prisma.examRecord.update.mockResolvedValue({
        ...mockExam,
        result: 'PASSED',
        resultDeclaredAt: expect.any(Date),
        resultRemarks: 'Excellent',
      });
      prisma.student.update.mockResolvedValue(undefined);

      const result = await service.declareResult('admin-1', {
        examId: 'exam-1',
        result: 'PASSED',
        remarks: 'Excellent',
      });

      expect(prisma.examRecord.update).toHaveBeenCalledWith({
        where: { id: 'exam-1' },
        data: expect.objectContaining({
          result: 'PASSED',
          resultRemarks: 'Excellent',
        }),
      });
      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { id: 'stu-1' },
        data: { currentStage: 4, applicationStatus: 'STAGE_4_PENDING' },
      });
      expect(timeline.onExamResultDeclared).toHaveBeenCalledWith(
        'app-1', 'stu-1', true, 'Excellent',
      );
      expect(timeline.onStageAdvanced).toHaveBeenCalledWith(
        'app-1', 'stu-1', 3, 4,
      );
      expect(notification.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'EXAM_PASSED' }),
      );
    });

    it('should update exam with FAILED and not advance stage', async () => {
      prisma.examRecord.findUnique.mockResolvedValue(examWithRelations);
      prisma.examRecord.update.mockResolvedValue({
        ...mockExam,
        result: 'FAILED',
        resultDeclaredAt: new Date(),
        resultRemarks: 'Needs improvement',
      });

      await service.declareResult('admin-1', {
        examId: 'exam-1',
        result: 'FAILED',
        remarks: 'Needs improvement',
      });

      expect(prisma.student.update).not.toHaveBeenCalled();
      expect(timeline.onStageAdvanced).not.toHaveBeenCalled();
      expect(timeline.onExamResultDeclared).toHaveBeenCalledWith(
        'app-1', 'stu-1', false, 'Needs improvement',
      );
      expect(notification.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'EXAM_FAILED' }),
      );
    });

    it('should throw NotFoundException when exam does not exist', async () => {
      prisma.examRecord.findUnique.mockResolvedValue(null);

      await expect(
        service.declareResult('admin-1', { examId: 'bad-id', result: 'PASSED' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getExamByApplication', () => {
    const examWithApplication = {
      ...mockExam,
      application: { ...mockApplication, student: { id: 'stu-1', userId: 'user-1' } },
    };

    it('should return exam for admin regardless of ownership', async () => {
      prisma.examRecord.findUnique.mockResolvedValue(examWithApplication);

      const result = await service.getExamByApplication('app-1', 'other-user', 'ADMIN');

      expect(result).toEqual(examWithApplication);
    });

    it('should return exam when student owns the application', async () => {
      prisma.examRecord.findUnique.mockResolvedValue(examWithApplication);

      const result = await service.getExamByApplication('app-1', 'user-1', 'STUDENT');

      expect(result).toEqual(examWithApplication);
    });

    it('should throw NotFoundException for wrong student', async () => {
      prisma.examRecord.findUnique.mockResolvedValue(examWithApplication);

      await expect(
        service.getExamByApplication('app-1', 'other-user', 'STUDENT'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when exam not found', async () => {
      prisma.examRecord.findUnique.mockResolvedValue(null);

      await expect(
        service.getExamByApplication('bad-app', 'user-1', 'STUDENT'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMyExam', () => {
    it('should return the latest exam for the student', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 'stu-1', userId: 'user-1' });
      prisma.examRecord.findFirst.mockResolvedValue(mockExam);

      const result = await service.getMyExam('user-1');

      expect(prisma.student.findUnique).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
      expect(prisma.examRecord.findFirst).toHaveBeenCalledWith({
        where: { studentId: 'stu-1' },
        orderBy: { attemptNumber: 'desc' },
      });
      expect(result).toEqual(mockExam);
    });

    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.getMyExam('bad-user')).rejects.toThrow(NotFoundException);
    });

    it('should return null when no exam record exists', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 'stu-1', userId: 'user-1' });
      prisma.examRecord.findFirst.mockResolvedValue(null);

      const result = await service.getMyExam('user-1');

      expect(result).toBeNull();
    });
  });

  describe('getAllExams', () => {
    it('should return paginated exams with metadata', async () => {
      prisma.examRecord.findMany.mockResolvedValue([mockExam]);
      prisma.examRecord.count.mockResolvedValue(1);

      const result = await service.getAllExams(1, 20);

      expect(prisma.examRecord.findMany).toHaveBeenCalledWith({
        include: {
          application: {
            select: {
              id: true,
              university: { select: { name: true, shortName: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
      expect(prisma.examRecord.count).toHaveBeenCalled();
      expect(result).toEqual({
        items: [mockExam],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should handle empty results', async () => {
      prisma.examRecord.findMany.mockResolvedValue([]);
      prisma.examRecord.count.mockResolvedValue(0);

      const result = await service.getAllExams(1, 20);

      expect(result.totalPages).toBe(0);
      expect(result.items).toEqual([]);
    });
  });
});
