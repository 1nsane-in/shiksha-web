import { BadRequestException } from '@nestjs/common';
import { verifyOtpRecord } from './otp-verification';

const email = 'student@example.com';
const record = {
  id: 'otp-1',
  email,
  otp: '123456',
  attempts: 0,
  expiresAt: new Date(Date.now() + 600_000),
  verifiedAt: null,
  completedAt: null,
};

function prismaMock(otpRecord: unknown) {
  return {
    otpVerification: {
      findFirst: jest.fn().mockResolvedValue(otpRecord),
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  } as any;
}

describe('verifyOtpRecord', () => {
  it('consumes a correct OTP atomically', async () => {
    const prisma = prismaMock(record);
    const result = await verifyOtpRecord(prisma, { email }, '123456');
    expect(result.id).toBe('otp-1');
    expect(result.token).toBeTruthy();
    expect(prisma.otpVerification.updateMany).toHaveBeenCalled();
  });

  it('increments attempts on a wrong OTP', async () => {
    const prisma = prismaMock(record);
    await expect(
      verifyOtpRecord(prisma, { email }, '000000'),
    ).rejects.toThrow(BadRequestException);
    expect(prisma.otpVerification.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ attempts: 1 }) }),
    );
  });

  it('invalidates the OTP on the fifth wrong attempt', async () => {
    const prisma = prismaMock({ ...record, attempts: 4 });
    await expect(
      verifyOtpRecord(prisma, { email }, '000000'),
    ).rejects.toThrow(BadRequestException);
    const update = prisma.otpVerification.update.mock.calls[0][0];
    expect(update.data.attempts).toBe(5);
    expect(update.data.expiresAt).toBeInstanceOf(Date);
  });
});
