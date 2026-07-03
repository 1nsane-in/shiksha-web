import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { TimelineService } from '../common/services/timeline.service';
import { NotificationService } from '../common/services/notification.service';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { STAGE_PAYMENT_CONFIG, generatePayUHash, verifyPayUResponse } from './dto/payment.dto';
import { randomUUID } from 'crypto';

jest.mock('./dto/payment.dto', () => {
  const actual = jest.requireActual('./dto/payment.dto');
  return {
    ...actual,
    generatePayUHash: jest.fn(),
    verifyPayUResponse: jest.fn(),
  };
});

const mockPrisma = {
  student: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  universityApplication: {
    findUnique: jest.fn(),
  },
  payment: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

const mockConfig = {
  get: jest.fn((key: string, fallback?: string) => {
    const map: Record<string, string> = {
      PAYU_KEY: 'test-key',
      PAYU_SALT: 'test-salt',
      PAYU_BASE_URL: 'https://test.payu.in',
      FRONTEND_URL: 'http://localhost:3000',
    };
    return map[key] ?? fallback ?? '';
  }),
};

const mockRedis = {
  getOrSet: jest.fn(),
  deletePattern: jest.fn(),
};

const mockTimeline = {
  onStageAdvanced: jest.fn(),
  onStage2PaymentCompleted: jest.fn(),
};

const mockNotification = {
  create: jest.fn(),
};

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: typeof mockPrisma;
  let redis: typeof mockRedis;

  const mockStudent = {
    id: 'student-1',
    userId: 'user-1',
    currentStage: 2,
    applicationStatus: 'STAGE_2_ACTIVE',
  };

  const mockApplication = {
    id: 'app-1',
    studentId: 'student-1',
  };

  const mockPayment = {
    id: 'payment-1',
    studentId: 'student-1',
    applicationId: 'app-1',
    stage: 2,
    amount: 5000,
    currency: 'INR',
    status: 'PENDING',
    razorpayOrderId: 'TXN123',
    createdAt: new Date(),
  };

  const mockUser = {
    id: 'user-1',
    name: 'Test',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
        { provide: RedisService, useValue: mockRedis },
        { provide: TimelineService, useValue: mockTimeline },
        { provide: NotificationService, useValue: mockNotification },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = mockPrisma;
    redis = mockRedis;
  });

  describe('initiatePayment', () => {
    const dto = {
      applicationId: 'app-1',
      stage: 2,
      firstName: 'Test',
      email: 'test@example.com',
      phone: '9999999999',
    };

    it('should throw BadRequestException for invalid stage', async () => {
      await expect(
        service.initiatePayment('user-1', { ...dto, stage: 99 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(service.initiatePayment('user-1', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when stage not unlocked', async () => {
      prisma.student.findUnique.mockResolvedValue({
        ...mockStudent,
        currentStage: 1,
      });

      await expect(service.initiatePayment('user-1', dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when application not found', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.universityApplication.findUnique.mockResolvedValue(null);

      await expect(service.initiatePayment('user-1', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create a new payment and return PayU params', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.universityApplication.findUnique.mockResolvedValue(mockApplication);
      prisma.payment.findFirst.mockResolvedValue(null);
      prisma.payment.create.mockResolvedValue(mockPayment);
      (generatePayUHash as jest.Mock).mockReturnValue('mock-hash');

      const result = await service.initiatePayment('user-1', dto);

      expect(result.paymentId).toBe('payment-1');
      expect(result.hash).toBe('mock-hash');
      expect(result.key).toBe('test-key');
      expect(result.amount).toBe('5000.00');
      expect(result.surl).toContain('localhost:3000');
    });

    it('should reuse existing pending payment', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.universityApplication.findUnique.mockResolvedValue(mockApplication);
      prisma.payment.findFirst.mockResolvedValue(mockPayment);
      prisma.payment.update.mockResolvedValue(mockPayment);
      (generatePayUHash as jest.Mock).mockReturnValue('mock-hash');

      const result = await service.initiatePayment('user-1', dto);

      expect(result.paymentId).toBe('payment-1');
      expect(prisma.payment.update).toHaveBeenCalled();
    });
  });

  describe('verifyPayment', () => {
    const payuSuccessResponse = {
      status: 'success',
      txnid: 'TXN123',
      mihpayid: 'MIH456',
      amount: '5000.00',
      productinfo: 'Stage_2_Admission_Fee',
      firstname: 'Test',
      email: 'test@example.com',
      hash: 'valid-hash',
      mode: 'cc',
      bank_ref_num: 'BANK789',
    };

    it('should throw BadRequestException on hash mismatch', async () => {
      (verifyPayUResponse as jest.Mock).mockReturnValue('different-hash');

      await expect(
        service.verifyPayment(payuSuccessResponse),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when payment record missing', async () => {
      (verifyPayUResponse as jest.Mock).mockReturnValue('valid-hash');
      prisma.payment.findFirst.mockResolvedValue(null);

      await expect(
        service.verifyPayment(payuSuccessResponse),
      ).rejects.toThrow(NotFoundException);
    });

    it('should mark payment as SUCCESS and advance stage', async () => {
      (verifyPayUResponse as jest.Mock).mockReturnValue('valid-hash');
      prisma.payment.findFirst.mockResolvedValue(mockPayment);
      prisma.payment.update.mockResolvedValue({
        ...mockPayment,
        status: 'SUCCESS',
        razorpayPaymentId: 'MIH456',
      });
      prisma.student.findUnique
        .mockResolvedValueOnce(mockStudent) // for advanceAfterPayment lookup
        .mockResolvedValueOnce({ ...mockStudent, user: mockUser }); // for notification
      prisma.student.update.mockResolvedValue({ ...mockStudent, currentStage: 3 });

      const result = await service.verifyPayment(payuSuccessResponse);

      expect(result.success).toBe(true);
      expect(result.payment.status).toBe('SUCCESS');
      expect(mockTimeline.onStageAdvanced).toHaveBeenCalled();
    });

    it('should mark payment as FAILED on PayU failure', async () => {
      const failedDto = {
        ...payuSuccessResponse,
        status: 'failure',
        error: 'payment_failed',
      };
      (verifyPayUResponse as jest.Mock).mockReturnValue('valid-hash');
      prisma.payment.findFirst.mockResolvedValue(mockPayment);
      prisma.payment.update.mockResolvedValue({
        ...mockPayment,
        status: 'FAILED',
      });

      const result = await service.verifyPayment(failedDto);

      expect(result.success).toBe(false);
      expect(result.payment.status).toBe('FAILED');
      expect(mockTimeline.onStageAdvanced).not.toHaveBeenCalled();
    });
  });

  describe('getPaymentHistory', () => {
    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);
      redis.getOrSet.mockImplementation((_key: string, fn: Function) => fn());

      await expect(
        service.getPaymentHistory('user-none'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return cached payment history', async () => {
      redis.getOrSet.mockResolvedValue([mockPayment]);

      const result = await service.getPaymentHistory('user-1');

      expect(result).toEqual([mockPayment]);
    });
  });

  describe('getPaymentById', () => {
    it('should throw NotFoundException when payment not found', async () => {
      prisma.payment.findUnique.mockResolvedValue(null);

      await expect(
        service.getPaymentById('bad-id', 'user-1', 'STUDENT'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return payment for admin without ownership check', async () => {
      prisma.payment.findUnique.mockResolvedValue(mockPayment);

      const result = await service.getPaymentById(
        'payment-1',
        'admin-1',
        'ADMIN',
      );
      expect(result).toEqual(mockPayment);
    });

    it('should throw ForbiddenException when student accesses anothers payment', async () => {
      // First query uses select (excludes student) → need second query to verify
      prisma.payment.findUnique
        .mockResolvedValueOnce({ ...mockPayment }) // no student field
        .mockResolvedValueOnce({ ...mockPayment, student: { userId: 'other-user' } }); // from second fetch

      await expect(
        service.getPaymentById('payment-1', 'user-1', 'STUDENT', 'id,amount'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('manualApprove', () => {
    it('should throw NotFoundException when payment not found', async () => {
      prisma.payment.findUnique.mockResolvedValue(null);

      await expect(
        service.manualApprove('admin-1', { paymentId: 'bad-id' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should approve payment and send notification', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        ...mockPayment,
        student: { ...mockStudent, user: mockUser },
      });
      prisma.payment.update.mockResolvedValue(mockPayment);
      prisma.student.findUnique
        .mockResolvedValueOnce(mockStudent)
        .mockResolvedValueOnce({ ...mockStudent, user: mockUser });

      const result = await service.manualApprove('admin-1', {
        paymentId: 'payment-1',
        note: 'Approved manually',
      });

      expect(result.message).toBe('Payment approved successfully');
      expect(mockNotification.create).toHaveBeenCalled();
      expect(redis.deletePattern).toHaveBeenCalled();
    });
  });

  describe('getPendingPayments', () => {
    it('should return cached pending payments', async () => {
      redis.getOrSet.mockResolvedValue({
        items: [mockPayment],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });

      const result = await service.getPendingPayments();

      expect(result.items).toHaveLength(1);
    });
  });

  describe('getStageConfig', () => {
    it('should return stage config as array', () => {
      const result = service.getStageConfig();
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('stage');
      expect(result[0]).toHaveProperty('label');
      expect(result[0]).toHaveProperty('amount');
    });
  });
});
