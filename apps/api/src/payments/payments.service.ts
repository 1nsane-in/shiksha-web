import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { TimelineService } from '../common/services/timeline.service';
import { NotificationService } from '../common/services/notification.service';
import {
  STAGE_PAYMENT_CONFIG,
  InitiatePayUPaymentDto,
  VerifyPayUPaymentDto,
  ManualPaymentApprovalDto,
  generatePayUHash,
  verifyPayUResponse,
} from './dto/payment.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PaymentsService {
  private payuKey: string;
  private payuSalt: string;
  private payuBaseUrl: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private timeline: TimelineService,
    private notification: NotificationService,
    private redis: RedisService,
  ) {
    this.payuKey = this.config.get<string>('PAYU_KEY') || '';
    this.payuSalt = this.config.get<string>('PAYU_SALT') || '';
    this.payuBaseUrl =
      this.config.get<string>('PAYU_BASE_URL') || 'https://secure.payu.in';
  }

  async initiatePayment(userId: string, dto: InitiatePayUPaymentDto) {
    const config = STAGE_PAYMENT_CONFIG[dto.stage];
    if (!config) {
      throw new BadRequestException(
        'Invalid payment stage. Valid stages: 2 (admission fee), 3 (exam fee)',
      );
    }

    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found');
    if (student.currentStage < dto.stage) {
      throw new BadRequestException('Please complete previous stages first');
    }

    const application = await this.prisma.universityApplication.findUnique({
      where: { id: dto.applicationId, studentId: student.id },
    });
    if (!application) throw new NotFoundException('Application not found');

    // Check existing pending payment for same stage
    const existing = await this.prisma.payment.findFirst({
      where: {
        applicationId: dto.applicationId,
        stage: dto.stage,
        status: { in: ['PENDING', 'PROCESSING'] },
      },
    });

    let txnid: string;
    let paymentId: string;

    if (existing) {
      // Always generate a new txnid — PayU rejects reused captured txnids
      txnid = 'TXN' + randomUUID().replace(/-/g, '').substring(0, 20);
      paymentId = existing.id;
      await this.prisma.payment.update({
        where: { id: existing.id },
        data: { razorpayOrderId: txnid },
      });
    } else {
      txnid = 'TXN' + randomUUID().replace(/-/g, '').substring(0, 20);
      const payment = await this.prisma.payment.create({
        data: {
          studentId: student.id,
          applicationId: dto.applicationId,
          stage: dto.stage,
          amount: config.amount,
          currency: 'INR',
          status: 'PENDING',
          razorpayOrderId: txnid,
        },
      });
      paymentId = payment.id;
    }

    const productinfo =
      'Stage_' + dto.stage + '_' + config.label.replace(/\s+/g, '_');
    const amount = config.amount.toFixed(2);

    const hash = generatePayUHash({
      key: this.payuKey,
      txnid: txnid,
      amount: amount,
      productinfo: productinfo,
      firstname: dto.firstName,
      email: dto.email,
      salt: this.payuSalt,
      udf1: dto.applicationId,
      udf2: dto.stage.toString(),
    });

    return {
      paymentId,
      hash,
      key: this.payuKey,
      txnid,
      amount,
      productinfo,
      firstname: dto.firstName,
      email: dto.email,
      phone: dto.phone || '',
      surl:
        this.config.get<string>('PAYU_SURL') ||
        this.config.get<string>('FRONTEND_URL') + '/payments/success',
      furl:
        this.config.get<string>('PAYU_FURL') ||
        this.config.get<string>('FRONTEND_URL') + '/payments/failure',
      service_provider: 'payu_paisa',
      udf1: dto.applicationId,
      udf2: dto.stage.toString(),
      udf3: '',
      udf4: '',
      udf5: '',
      payuBaseUrl: this.payuBaseUrl,
    };
  }

  async verifyPayment(dto: VerifyPayUPaymentDto) {
    // Verify PayU response hash
    const expectedHash = verifyPayUResponse({
      status: dto.status,
      txnid: dto.txnid,
      amount: dto.amount,
      productinfo: dto.productinfo,
      firstname: dto.firstname,
      email: dto.email,
      salt: this.payuSalt,
      key: this.payuKey,
      udf1: dto.udf1,
      udf2: dto.udf2,
      udf3: dto.udf3,
      udf4: dto.udf4,
      udf5: dto.udf5,
      additionalCharges: dto.additionalCharges,
    });

    if (expectedHash !== dto.hash.toLowerCase()) {
      throw new BadRequestException('Invalid payment response hash');
    }

    // Find payment record
    const payment = await this.prisma.payment.findFirst({
      where: { razorpayOrderId: dto.txnid },
      include: { student: true },
    });
    if (!payment) throw new NotFoundException('Payment record not found');

    const isSuccess = dto.status === 'success';

    // Update payment record
    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: dto.mihpayid || dto.payumoney_id,
        status: isSuccess ? 'SUCCESS' : 'FAILED',
        paidAt: isSuccess ? new Date() : null,
        paymentMethod: dto.mode || 'payu',
        bankReference: dto.bank_ref_num,
        ...(dto.error ? { approvalNote: dto.error_Message || dto.error } : {}),
      },
    });

    // Clear Redis payment history cache so next fetch shows updated status
    await this.redis.deletePattern(`payments:history:${payment.student.userId}:*`);

    if (isSuccess) {
      await this.advanceAfterPayment(payment);
    }

    return { success: isSuccess, payment: updated };
  }

  private async advanceAfterPayment(payment: {
    id: string;
    stage: number;
    applicationId: string | null;
    studentId: string;
  }) {
    let nextStage: number | null = null;
    let nextStatus: string | null = null;

    if (payment.stage === 2) {
      nextStage = 3;
      nextStatus = 'STAGE_3_ACTIVE';
    } else if (payment.stage === 3) {
      nextStage = 4;
      nextStatus = 'STAGE_4_PENDING';
    }

    if (nextStage && payment.applicationId) {
      const student = await this.prisma.student.findUnique({
        where: { id: payment.studentId },
      });
      if (student && student.currentStage < nextStage) {
        const oldStage = student.currentStage;
        await this.prisma.student.update({
          where: { id: payment.studentId },
          data: {
            currentStage: nextStage,
            applicationStatus: nextStatus as any,
          },
        });
        await this.timeline.onStageAdvanced(
          payment.applicationId,
          payment.studentId,
          oldStage,
          nextStage,
        );

        const user = await this.prisma.student.findUnique({
          where: { id: payment.studentId },
          include: { user: true },
        });
        if (user?.user) {
          await this.notification.create({
            userId: user.user.id,
            type: 'STAGE_ADVANCED',
            title: 'Stage ' + nextStage + ' Unlocked',
            message: 'Your payment was successful! Proceed to the next stage.',
            data: { applicationId: payment.applicationId, stage: nextStage },
          });
        }
      }
    }

    if (payment.applicationId) {
      if (payment.stage === 2) {
        await this.timeline.onStage2PaymentCompleted(
          payment.applicationId,
          payment.studentId,
          5000,
        );
      }
    }
  }

  async getPaymentHistory(userId: string, applicationId?: string, fields?: string) {
    const cacheKey = `payments:history:${userId}:${applicationId || 'all'}:${fields || 'default'}`;
    
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student) throw new NotFoundException('Student profile not found');
        const where: any = { studentId: student.id };
        if (applicationId) where.applicationId = applicationId;

        const select = this.buildPaymentSelect(fields);
        const queryOptions: any = { where, orderBy: { createdAt: 'desc' as const } };
        if (select) queryOptions.select = select;

        return this.prisma.payment.findMany(queryOptions);
      },
      300, // Cache for 5 minutes
    );
  }

  async getPaymentById(paymentId: string, userId: string, userRole: string, fields?: string) {
    const select = this.buildPaymentSelect(fields);
    const queryOptions: any = { where: { id: paymentId } };
    if (select) {
      queryOptions.select = select;
    } else {
      queryOptions.include = { student: true };
    }

    const payment = await this.prisma.payment.findUnique(queryOptions);
    if (!payment) throw new NotFoundException('Payment not found');
    if (
      userRole !== 'ADMIN' &&
      userRole !== 'SUPER_ADMIN' &&
      (payment as any).student?.userId !== userId
    ) {
      // If no student included, fetch to check
      if (!(payment as any).student) {
        const full = await this.prisma.payment.findUnique({ where: { id: paymentId }, include: { student: true } });
        if (full?.student?.userId !== userId) throw new ForbiddenException('Access denied');
      }
    }
    return payment;
  }

  async manualApprove(adminId: string, dto: ManualPaymentApprovalDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.paymentId },
      include: { student: { include: { user: true } } },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'MANUALLY_APPROVED',
        manuallyApproved: true,
        approvedBy: adminId,
        approvalNote: dto.note,
        paidAt: new Date(),
      },
    });

    // Invalidate caches
    await this.redis.deletePattern('payments:history:*');
    await this.redis.deletePattern('payments:pending:*');

    await this.advanceAfterPayment(payment);

    await this.notification.create({
      userId: payment.student.user.id,
      type: 'PAYMENT_APPROVED',
      title: 'Payment Approved',
      message:
        'Your payment of ₹' + payment.amount + ' has been manually approved.',
      data: { paymentId: payment.id, stage: payment.stage },
    });

    return { message: 'Payment approved successfully' };
  }

  async getPendingPayments(page: number = 1, limit: number = 20, fields?: string) {
    const cacheKey = `payments:pending:${page}:${limit}:${fields || 'default'}`;
    
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const skip = (page - 1) * limit;

        if (fields) {
          const select = this.buildPaymentSelect(fields);
          const [items, total] = await Promise.all([
            this.prisma.payment.findMany({
              where: { status: { in: ['PENDING', 'PROCESSING'] } },
              select,
              orderBy: { createdAt: 'desc' },
              skip,
              take: limit,
            }),
            this.prisma.payment.count({
              where: { status: { in: ['PENDING', 'PROCESSING'] } },
            }),
          ]);
          return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
        }

        const [items, total] = await Promise.all([
          this.prisma.payment.findMany({
            where: { status: { in: ['PENDING', 'PROCESSING'] } },
            include: {
              student: {
                include: { user: { select: { name: true, email: true } } },
              },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
          }),
          this.prisma.payment.count({
            where: { status: { in: ['PENDING', 'PROCESSING'] } },
          }),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
      },
      300, // Cache for 5 minutes
    );
  }

  private buildPaymentSelect(fields?: string) {
    if (!fields) return undefined;

    const fieldList = fields.split(',').map(f => f.trim()).filter(Boolean);
    if (fieldList.length === 0) return undefined;

    const select: any = { id: true };

    const allowedScalars = ['stage', 'amount', 'currency', 'status', 'razorpayOrderId', 'razorpayPaymentId', 'paymentMethod', 'bankReference', 'paidAt', 'createdAt', 'updatedAt', 'studentId', 'applicationId', 'approvalNote', 'manuallyApproved'];

    for (const field of allowedScalars) {
      if (fieldList.includes(field)) {
        select[field] = true;
      }
    }

    // Handle student.user nested fields
    const studentFields = fieldList.filter(f => f.startsWith('student.'));
    if (studentFields.length > 0) {
      select.student = { include: {} as Record<string, any> };
      const studentUserFields = studentFields.filter(f => f.startsWith('student.user.'));
      if (studentUserFields.length > 0 || studentFields.includes('student.user')) {
        select.student.include.user = { select: {} as Record<string, boolean> };
        const allowedUser = ['name', 'email', 'phone'];
        if (studentFields.includes('student.user')) {
          for (const u of allowedUser) select.student.include.user.select[u] = true;
        } else {
          for (const sf of studentUserFields) {
            const key = sf.replace('student.user.', '');
            if (allowedUser.includes(key)) select.student.include.user.select[key] = true;
          }
        }
      }
    }

    return select;
  }

  getStageConfig() {
    return Object.entries(STAGE_PAYMENT_CONFIG).map(([stage, config]) => ({
      stage: Number(stage),
      ...config,
    }));
  }
}
