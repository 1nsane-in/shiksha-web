import { UnauthorizedException } from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Atomically consumes a refresh token. Reuse of an already-consumed token
 * revokes every session in its family (standard rotation-theft detection).
 */
export async function rotateRefreshSession(
  prisma: PrismaService,
  refreshTokenHash: string,
): Promise<{ user: User; familyId: string }> {
  const session = await prisma.userSession.findUnique({
    where: { tokenHash: refreshTokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    throw new UnauthorizedException('Invalid or expired refresh token');
  }
  if (!session.user.isActive) {
    throw new UnauthorizedException('Account is deactivated');
  }

  const revokeFamily = async () => {
    if (session.familyId) {
      await prisma.userSession.updateMany({
        where: { familyId: session.familyId },
        data: { revokedAt: new Date() },
      });
    }
  };

  if (session.revokedAt) {
    await revokeFamily();
    throw new UnauthorizedException('Invalid refresh token');
  }

  const consumed = await prisma.userSession.updateMany({
    where: { id: session.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  if (consumed.count !== 1) {
    await revokeFamily();
    throw new UnauthorizedException('Invalid refresh token');
  }

  return { user: session.user, familyId: session.familyId ?? session.id };
}
