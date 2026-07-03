import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatorService } from '../common/services/paginator.service';
import { RedisService } from '../redis/redis.service';

/**
 * Regression test: Payment Ledger on the admin application details page
 * was leaking payments from other applications of the same student (and
 * pre-seeded records) because `student.payments` was loaded unfiltered.
 * Fix scopes the include to the current application id.
 */
describe('ApplicationsService.findOne - per-application payment scoping', () => {
  let service: ApplicationsService;
  let prisma: { universityApplication: { findUnique: jest.Mock } };

  const APP_ID = 'app-123';
  const STUDENT_ID = 'student-456';

  beforeEach(async () => {
    prisma = {
      universityApplication: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: PaginatorService,
          useValue: { getSkip: () => 0, wrapResult: (items: unknown) => items },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            getOrSet: jest.fn().mockImplementation((_key, factory) => factory()),
          },
        },
      ],
    }).compile();

    service = module.get(ApplicationsService);
  });

  it('scopes student.payments to the current applicationId', async () => {
    prisma.universityApplication.findUnique.mockResolvedValue({
      id: APP_ID,
      studentId: STUDENT_ID,
      student: {},
      timelineEvents: [],
      tickets: [],
    });

    await service.findOne(APP_ID);

    const call = prisma.universityApplication.findUnique.mock.calls[0][0];
    const paymentsInclude = call.include.student.include.payments;

    // Must be a filtered include, not a bare `true`.
    expect(paymentsInclude).not.toBe(true);
    expect(paymentsInclude).toBeDefined();
    expect(paymentsInclude.where).toBeDefined();
    expect(paymentsInclude.where.applicationId).toBe(APP_ID);
    // Order is required so the most recent payment shows first.
    expect(paymentsInclude.orderBy).toEqual({ createdAt: 'desc' });
  });

  it('throws NotFoundException when the application does not exist', async () => {
    prisma.universityApplication.findUnique.mockResolvedValue(null);
    await expect(service.findOne(APP_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
