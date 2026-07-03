import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { RedisService } from '../../src/redis/redis.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
};

const mockRedis = {
  getOrSet: jest.fn(),
  del: jest.fn(),
  deletePattern: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: typeof mockPrisma;
  let redis: typeof mockRedis;

  const mockUser = {
    id: 'user-1',
    email: 'test@test.com',
    name: 'Test User',
    phone: '1234567890',
    role: 'STUDENT',
    isActive: true,
    avatarUrl: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  const mockUserWithStudent = {
    ...mockUser,
    student: {
      id: 'student-1',
      currentStage: 1,
      applicationStatus: 'STAGE_1_PENDING',
      neetScore: 650,
      neetRank: 1000,
      twelfthPercentage: 85,
      tenthPercentage: 90,
      userId: 'user-1',
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = mockPrisma;
    redis = mockRedis;
  });

  describe('getProfile', () => {
    it('should return cached profile from redis', async () => {
      redis.getOrSet.mockResolvedValue(mockUserWithStudent);

      const result = await service.getProfile('user-1');

      expect(result).toEqual(mockUserWithStudent);
      expect(redis.getOrSet).toHaveBeenCalledWith(
        'user:profile:user-1',
        expect.any(Function),
        300,
      );
    });

    it('should return cached profile with fields cache key', async () => {
      redis.getOrSet.mockResolvedValue(mockUser);

      const result = await service.getProfile('user-1', 'email,name');

      expect(result).toEqual(mockUser);
      expect(redis.getOrSet).toHaveBeenCalledWith(
        'user:profile:user-1:fields:email,name',
        expect.any(Function),
        300,
      );
    });

    it('should fetch from prisma on cache miss', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown>) => factory(),
      );
      prisma.user.findUnique.mockResolvedValue(mockUserWithStudent);

      const result = await service.getProfile('user-1');

      expect(result).toEqual(mockUserWithStudent);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        include: { student: true },
      });
    });

    it('should use field selection when fields provided on cache miss', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown>) => factory(),
      );
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfile('user-1', 'email,name');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: { id: true, email: true, name: true },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown>) => factory(),
      );
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    const dto = { name: 'Updated Name', phone: '9876543210' };

    it('should update user and invalidate cache', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name', phone: '9876543210' };
      prisma.user.update.mockResolvedValue(updatedUser);
      redis.del.mockResolvedValue(undefined);

      const result = await service.updateProfile('user-1', dto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: dto,
      });
      expect(redis.del).toHaveBeenCalledWith('user:profile:user-1');
      expect(result).toEqual(updatedUser);
    });
  });

  describe('findAll', () => {
    const mockPaginatedResult = {
      data: [mockUser],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    };

    it('should return cached paginated users from redis', async () => {
      redis.getOrSet.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll();

      expect(result).toEqual(mockPaginatedResult);
      expect(redis.getOrSet).toHaveBeenCalledWith(
        'users:list:1:10:all:default',
        expect.any(Function),
        300,
      );
    });

    it('should fetch from prisma on cache miss', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown>) => factory(),
      );
      prisma.user.findMany.mockResolvedValue([mockUser]);
      prisma.user.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { student: true },
      });
      expect(prisma.user.count).toHaveBeenCalledWith({ where: {} });
      expect(result.data).toEqual([mockUser]);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by role when provided', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown>) => factory(),
      );
      prisma.user.findMany.mockResolvedValue([mockUser]);
      prisma.user.count.mockResolvedValue(1);

      await service.findAll(1, 10, 'STUDENT');

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role: 'STUDENT' },
        }),
      );
      expect(prisma.user.count).toHaveBeenCalledWith({ where: { role: 'STUDENT' } });
    });
  });

  describe('findOne', () => {
    it('should return cached user from redis', async () => {
      redis.getOrSet.mockResolvedValue(mockUser);

      const result = await service.findOne('user-1');

      expect(result).toEqual(mockUser);
      expect(redis.getOrSet).toHaveBeenCalledWith(
        'user:user-1',
        expect.any(Function),
        300,
      );
    });

    it('should fetch from prisma on cache miss', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown>) => factory(),
      );
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('user-1');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        include: { student: true },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      redis.getOrSet.mockImplementation(
        (_key: string, factory: () => Promise<unknown>) => factory(),
      );
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const dto = { name: 'Admin Update', role: 'ADMIN' as const };

    it('should update user and invalidate caches', async () => {
      const updated = { ...mockUser, name: 'Admin Update', role: 'ADMIN' };
      prisma.user.update.mockResolvedValue(updated);

      const result = await service.update('user-1', dto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: dto,
      });
      expect(redis.del).toHaveBeenCalledWith('user:profile:user-1');
      expect(redis.deletePattern).toHaveBeenCalledWith('users:list:*');
      expect(result).toEqual(updated);
    });
  });

  describe('deactivate', () => {
    it('should set isActive to false and invalidate caches', async () => {
      const deactivated = { ...mockUser, isActive: false };
      prisma.user.update.mockResolvedValue(deactivated);

      const result = await service.deactivate('user-1');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { isActive: false },
      });
      expect(redis.del).toHaveBeenCalledWith('user:profile:user-1');
      expect(redis.deletePattern).toHaveBeenCalledWith('users:list:*');
      expect(result).toEqual({ message: 'User deactivated', user: deactivated });
    });
  });

  describe('activate', () => {
    it('should set isActive to true and invalidate caches', async () => {
      const activated = { ...mockUser, isActive: true };
      prisma.user.update.mockResolvedValue(activated);

      const result = await service.activate('user-1');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { isActive: true },
      });
      expect(redis.del).toHaveBeenCalledWith('user:profile:user-1');
      expect(redis.deletePattern).toHaveBeenCalledWith('users:list:*');
      expect(result).toEqual({ message: 'User activated', user: activated });
    });
  });
});
