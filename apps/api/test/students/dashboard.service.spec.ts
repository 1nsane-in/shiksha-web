import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from '../../src/students/dashboard.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  student: {
    findUnique: jest.fn(),
  },
  studentDocument: {
    groupBy: jest.fn(),
  },
  payment: {
    groupBy: jest.fn(),
  },
  applicationTimeline: {
    findMany: jest.fn(),
  },
  notification: {
    count: jest.fn(),
  },
  examRecord: {
    findMany: jest.fn(),
  },
  visaApplication: {
    findMany: jest.fn(),
  },
};

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: typeof mockPrisma;

  const mockStudent = {
    id: 'student-1',
    userId: 'user-1',
    currentStage: 1,
    applicationStatus: 'STAGE_1_PENDING',
    fatherName: 'Father',
    motherName: 'Mother',
    dob: new Date('2000-01-01'),
    gender: 'male',
    address: '123 Street',
    city: 'City',
    state: 'State',
    country: 'Country',
    pincode: '123456',
    passportNumber: 'AB123456',
    passportExpiry: new Date('2030-01-01'),
    passportIssueDate: new Date('2020-01-01'),
    passportIssueCountry: 'Country',
    neetScore: 650,
    neetRank: 1000,
    twelfthPercentage: 85,
    tenthPercentage: 90,
    user: {
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      phone: '1234567890',
      avatarUrl: null,
    },
    applications: [
      {
        id: 'app-1',
        status: 'pending',
        selectedProgram: 'general-medicine',
        submittedAt: new Date(),
        university: { id: 'uni-1', name: 'Test Uni', shortName: 'TU' },
      },
    ],
    admissionLetter: { id: 'letter-1' },
    invitationLetter: null,
    examRecords: [{ id: 'exam-1', examDate: new Date(), result: 'PASSED' }],
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    prisma = mockPrisma;
  });

  describe('getOverview', () => {
    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.getOverview('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return complete overview with profile, stage, stats', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.studentDocument.groupBy.mockResolvedValue([
        { status: 'APPROVED', _count: 3 },
        { status: 'PENDING', _count: 1 },
      ]);
      prisma.payment.groupBy.mockResolvedValue([
        { status: 'SUCCESS', _sum: { amount: 5000 }, _count: 2 },
        { status: 'PENDING', _sum: { amount: 2000 }, _count: 1 },
      ]);

      const result = await service.getOverview('user-1');

      expect(prisma.student.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: {
          user: { select: { id: true, email: true, name: true, phone: true, avatarUrl: true } },
          applications: {
            select: { id: true, status: true, selectedProgram: true, submittedAt: true, university: { select: { id: true, name: true, shortName: true } } },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          admissionLetter: { select: { id: true } },
          invitationLetter: { select: { id: true } },
          examRecords: { select: { id: true, examDate: true, result: true }, take: 1, orderBy: { createdAt: 'desc' } },
        },
      });

      expect(result.profile.studentId).toBe('student-1');
      expect(result.profile.name).toBe('Test User');
      expect(result.stage.currentStage).toBe(1);
      expect(result.documentStats).toEqual({ total: 4, approved: 3, pending: 1, rejected: 0 });
      expect(result.paymentStats).toEqual({ totalPaid: 5000, pendingAmount: 2000, totalPayments: 3 });
      expect(result.applicationSummary.total).toBe(1);
      expect(result.examSummary).toEqual({ id: 'exam-1', examDate: expect.any(Date), result: 'PASSED' });
      expect(result.lettersAvailability).toEqual({ admissionLetter: true, invitationLetter: false });
    });

    it('should handle missing documents and payments', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.studentDocument.groupBy.mockResolvedValue([]);
      prisma.payment.groupBy.mockResolvedValue([]);

      const result = await service.getOverview('user-1');

      expect(result.documentStats).toEqual({ total: 0, approved: 0, pending: 0, rejected: 0 });
      expect(result.paymentStats).toEqual({ totalPaid: 0, pendingAmount: 0, totalPayments: 0 });
    });

    it('should return null examSummary when no exam records', async () => {
      prisma.student.findUnique.mockResolvedValue({
        ...mockStudent,
        examRecords: [],
      });
      prisma.studentDocument.groupBy.mockResolvedValue([]);
      prisma.payment.groupBy.mockResolvedValue([]);

      const result = await service.getOverview('user-1');

      expect(result.examSummary).toBeNull();
    });
  });

  describe('getActivity', () => {
    const mockTimelineEvents = [
      {
        id: 'evt-1',
        stage: 1,
        event: 'stage_completed',
        title: 'Stage 1 Completed',
        description: '',
        occurredAt: new Date(),
      },
    ];

    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.getActivity('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return activity with timeline, notifications, and deadlines', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 'student-1' });
      prisma.applicationTimeline.findMany.mockResolvedValue(mockTimelineEvents);
      prisma.notification.count.mockResolvedValue(3);
      prisma.examRecord.findMany.mockResolvedValue([
        { id: 'exam-1', examDate: new Date('2026-07-15'), examSubject: 'Medical', examCenter: 'Center A' },
      ]);
      prisma.visaApplication.findMany.mockResolvedValue([
        { id: 'visa-1', appointmentDate: new Date('2026-08-01'), visaType: 'Student' },
      ]);

      const result = await service.getActivity('user-1');

      expect(result.recentEvents).toEqual(mockTimelineEvents);
      expect(result.unreadNotifications).toBe(3);
      expect(result.upcomingDeadlines).toHaveLength(2);
      expect(result.upcomingDeadlines[0].type).toBe('exam');
      expect(result.upcomingDeadlines[1].type).toBe('visa');
    });

    it('should return empty deadlines when no upcoming events', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 'student-1' });
      prisma.applicationTimeline.findMany.mockResolvedValue([]);
      prisma.notification.count.mockResolvedValue(0);
      prisma.examRecord.findMany.mockResolvedValue([]);
      prisma.visaApplication.findMany.mockResolvedValue([]);

      const result = await service.getActivity('user-1');

      expect(result.recentEvents).toEqual([]);
      expect(result.unreadNotifications).toBe(0);
      expect(result.upcomingDeadlines).toEqual([]);
    });
  });

  describe('getNextSteps', () => {
    const mockStudentWithRelations = {
      id: 'student-1',
      currentStage: 1,
      applicationStatus: 'STAGE_1_PENDING',
      fatherName: 'Father',
      motherName: 'Mother',
      dob: new Date('2000-01-01'),
      address: '123 Street',
      country: 'Country',
      passportNumber: null,
      passportExpiry: null,
      user: { name: 'Test User', phone: '1234567890' },
      documents: [],
      payments: [],
      applications: [],
      admissionLetter: null,
      invitationLetter: null,
      examRecords: [],
    };

    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.getNextSteps('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return next actions for stage 1', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudentWithRelations);

      const result = await service.getNextSteps('user-1');

      expect(result.nextActions).toBeDefined();
      expect(result.completionPercentage).toBeGreaterThanOrEqual(0);
      expect(result.pendingItems).toBeDefined();
      expect(result.nextActions.length).toBeGreaterThan(0);

      // Stage 1 should include profile, documents, payment, and application
      const types = result.nextActions.map((a: { type: string }) => a.type);
      expect(types).toContain('profile');
      expect(types).toContain('documents');
      expect(types).toContain('payment');
      expect(types).toContain('application');
    });

    it('should mark profile as complete when all fields present', async () => {
      const completeStudent = {
        ...mockStudentWithRelations,
        user: { name: 'Test User', phone: '1234567890' },
        dob: new Date('2000-01-01'),
        address: '123 Street',
        country: 'Country',
        passportNumber: 'AB123456',
        passportExpiry: new Date('2030-01-01'),
      };
      prisma.student.findUnique.mockResolvedValue(completeStudent);

      const result = await service.getNextSteps('user-1');

      const profileAction = result.nextActions.find(
        (a: { type: string }) => a.type === 'profile',
      );
      expect(profileAction.completed).toBe(true);
    });

    it('should include stage-appropriate actions for stage 3', async () => {
      const stage3Student = {
        ...mockStudentWithRelations,
        currentStage: 3,
        admissionLetter: null,
        applications: [{ id: 'app-1', status: 'approved' }],
        payments: [{ stage: 3, status: 'SUCCESS' }],
        documents: [{ status: 'APPROVED', documentType: { requiredForStage: 1 } }],
      };
      prisma.student.findUnique.mockResolvedValue(stage3Student);

      const result = await service.getNextSteps('user-1');

      const types = result.nextActions.map((a: { type: string }) => a.type);
      expect(types).toContain('admission_letter');
    });

    it('should include stage 5 visa action', async () => {
      const stage5Student = {
        ...mockStudentWithRelations,
        currentStage: 5,
      };
      prisma.student.findUnique.mockResolvedValue(stage5Student);

      const result = await service.getNextSteps('user-1');

      const types = result.nextActions.map((a: { type: string }) => a.type);
      expect(types).toContain('visa');
    });
  });
});
