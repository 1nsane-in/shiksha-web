import { BadRequestException } from '@nestjs/common';
import { randomUUID, timingSafeEqual } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

export const MAX_OTP_ATTEMPTS = 5;

/**
 * Verifies an OTP, counts failed attempts on the record, and consumes it atomically.
 * Single place so every OTP flow gets lockout without per-caller guards.
 */
export async function verifyOtpRecord(
  prisma: PrismaService,
  identity: { email?: string; phone?: string },
  otp: string,
): Promise<{ id: string; token: string }> {
  const by = identity.email
    ? { email: identity.email }
    : identity.phone
      ? { phone: identity.phone }
      : null;
  if (!by) throw new BadRequestException('Invalid or expired OTP');

  const record = await prisma.otpVerification.findFirst({
    where: {
      ...by,
      verifiedAt: null,
      completedAt: null,
      expiresAt: { gte: new Date() },
      attempts: { lt: MAX_OTP_ATTEMPTS },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (!record) throw new BadRequestException('Invalid or expired OTP');

  const supplied = Buffer.from(otp);
  const expected = Buffer.from(record.otp);
  const matches =
    supplied.length === expected.length && timingSafeEqual(supplied, expected);

  if (!matches) {
    const attempts = (record.attempts ?? 0) + 1;
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: {
        attempts,
        ...(attempts >= MAX_OTP_ATTEMPTS ? { expiresAt: new Date() } : {}),
      },
    });
    throw new BadRequestException('Invalid or expired OTP');
  }

  const token = randomUUID();
  const consumed = await prisma.otpVerification.updateMany({
    where: {
      id: record.id,
      verifiedAt: null,
      completedAt: null,
      attempts: { lt: MAX_OTP_ATTEMPTS },
    },
    data: { verifiedAt: new Date(), token },
  });
  if (consumed.count !== 1) {
    throw new BadRequestException('Invalid or expired OTP');
  }
  return { id: record.id, token };
}
