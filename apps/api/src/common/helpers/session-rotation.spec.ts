import { UnauthorizedException } from '@nestjs/common';
import { rotateRefreshSession } from './session-rotation';

const user = {
  id: 'user-1',
  email: 'student@example.com',
  role: 'STUDENT',
  isActive: true,
};

function mockSession(overrides: Record<string, unknown> = {}) {
  return {
    id: 'session-1',
    userId: user.id,
    tokenHash: 'hash',
    familyId: 'family-1',
    revokedAt: null,
    expiresAt: new Date(Date.now() + 86_400_000),
    user,
    ...overrides,
  };
}

function prismaMock(session: unknown) {
  return {
    userSession: {
      findUnique: jest.fn().mockResolvedValue(session),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  } as any;
}

describe('rotateRefreshSession', () => {
  it('consumes a valid token and returns its family', async () => {
    const prisma = prismaMock(mockSession());
    const result = await rotateRefreshSession(prisma, 'hash');
    expect(result.familyId).toBe('family-1');
    expect(prisma.userSession.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'session-1', revokedAt: null } }),
    );
  });

  it('revokes the whole family when a consumed token is replayed', async () => {
    const prisma = prismaMock(mockSession({ revokedAt: new Date() }));
    await expect(rotateRefreshSession(prisma, 'hash')).rejects.toThrow(
      UnauthorizedException,
    );
    expect(prisma.userSession.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { familyId: 'family-1' } }),
    );
  });

  it('rejects inactive users before consuming the token', async () => {
    const prisma = prismaMock(
      mockSession({ user: { ...user, isActive: false } }),
    );
    await expect(rotateRefreshSession(prisma, 'hash')).rejects.toThrow(
      /deactivated/,
    );
    expect(prisma.userSession.updateMany).not.toHaveBeenCalled();
  });

  it('rejects unknown tokens', async () => {
    const prisma = prismaMock(null);
    await expect(rotateRefreshSession(prisma, 'hash')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
