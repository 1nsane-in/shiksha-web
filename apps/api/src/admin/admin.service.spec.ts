import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminRole } from './admin.dto';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));
import * as bcrypt from 'bcryptjs';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  userActivityLog: {
    findMany: jest.fn(),
  },
};

describe('AdminService', () => {
  let service: AdminService;
  let prisma: typeof mockPrisma;

  const mockAdmin = {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    phone: '9999999999',
    role: 'ADMIN',
    isActive: true,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: null,
    lastLoginIp: null,
    passwordHash: 'hashed-password',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = mockPrisma;
  });

  describe('findAll', () => {
    it('should return paginated admins', async () => {
      prisma.user.findMany.mockResolvedValue([mockAdmin]);
      prisma.user.count.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('should filter by role', async () => {
      prisma.user.findMany.mockResolvedValue([mockAdmin]);
      prisma.user.count.mockResolvedValue(1);

      await service.findAll({ role: AdminRole.ADMIN });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            role: 'ADMIN',
          }),
        }),
      );
    });

    it('should filter by search term', async () => {
      prisma.user.findMany.mockResolvedValue([mockAdmin]);
      prisma.user.count.mockResolvedValue(1);

      await service.findAll({ search: 'admin' });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ name: expect.anything() }),
            ]),
          }),
        }),
      );
    });

    it('should filter by isActive', async () => {
      prisma.user.findMany.mockResolvedValue([mockAdmin]);
      prisma.user.count.mockResolvedValue(1);

      await service.findAll({ isActive: true });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return admin by id', async () => {
      prisma.user.findFirst.mockResolvedValue(mockAdmin);

      const result = await service.findOne('admin-1');

      expect(result.id).toBe('admin-1');
      expect(result.email).toBe('admin@example.com');
    });

    it('should throw NotFoundException when admin not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const dto = {
      email: 'newadmin@example.com',
      password: 'Password123',
      name: 'New Admin',
      role: AdminRole.ADMIN,
    };

    it('should throw BadRequestException when email exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdmin);

      await expect(service.create(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create admin successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockAdmin);

      const result = await service.create(dto);

      expect(result.message).toBe('Admin created successfully');
      expect(result.admin).toEqual(mockAdmin);
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: dto.email,
            role: dto.role,
            isActive: true,
          }),
        }),
      );
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when admin not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.update('bad-id', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update admin fields', async () => {
      prisma.user.findFirst.mockResolvedValue(mockAdmin);
      prisma.user.update.mockResolvedValue({
        ...mockAdmin,
        name: 'Updated Name',
      });

      const result = await service.update('admin-1', { name: 'Updated Name' });

      expect(result.message).toBe('Admin updated successfully');
      expect(result.admin.name).toBe('Updated Name');
    });
  });

  describe('delete', () => {
    it('should throw BadRequestException when deleting self', async () => {
      await expect(
        service.delete('admin-1', 'admin-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should soft-delete admin', async () => {
      prisma.user.findFirst.mockResolvedValue(mockAdmin);
      prisma.user.update.mockResolvedValue({
        ...mockAdmin,
        isActive: false,
      });

      const result = await service.delete('admin-2', 'admin-1');

      expect(result.message).toBe('Admin deleted successfully');
      expect(result.admin.isActive).toBe(false);
    });
  });

  describe('toggleStatus', () => {
    it('should throw BadRequestException when toggling self', async () => {
      await expect(
        service.toggleStatus('admin-1', 'admin-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should deactivate an active admin', async () => {
      prisma.user.findFirst.mockResolvedValue(mockAdmin);
      prisma.user.update.mockResolvedValue({
        ...mockAdmin,
        isActive: false,
      });

      const result = await service.toggleStatus('admin-2', 'admin-1');

      expect(result.message).toContain('deactivated');
      expect(result.admin.isActive).toBe(false);
    });

    it('should activate an inactive admin', async () => {
      prisma.user.findFirst.mockResolvedValue({ ...mockAdmin, isActive: false });
      prisma.user.update.mockResolvedValue({
        ...mockAdmin,
        isActive: true,
      });

      const result = await service.toggleStatus('admin-2', 'admin-1');

      expect(result.message).toContain('activated');
      expect(result.admin.isActive).toBe(true);
    });
  });

  describe('changePassword', () => {
    it('should throw NotFoundException when admin not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword('bad-id', {
          currentPassword: 'old',
          newPassword: 'new12345',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when current password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('admin-1', {
          currentPassword: 'wrong',
          newPassword: 'new12345',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should change password successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      prisma.user.update.mockResolvedValue(mockAdmin);

      const result = await service.changePassword('admin-1', {
        currentPassword: 'correct',
        newPassword: 'new12345',
      });

      expect(result.message).toBe('Password changed successfully');
    });
  });

  describe('resetPassword', () => {
    it('should throw NotFoundException when admin not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.resetPassword('bad-id', { newPassword: 'new12345' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reset password successfully', async () => {
      prisma.user.findFirst.mockResolvedValue(mockAdmin);
      prisma.user.update.mockResolvedValue(mockAdmin);

      const result = await service.resetPassword('admin-1', {
        newPassword: 'new12345',
      });

      expect(result.message).toBe('Password reset successfully');
    });
  });

  describe('getStatistics', () => {
    it('should return admin statistics', async () => {
      prisma.user.count.mockResolvedValue(10);

      // Mock each count call individually
      prisma.user.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(8) // active
        .mockResolvedValueOnce(2) // inactive
        .mockResolvedValueOnce(7) // admins
        .mockResolvedValueOnce(3) // superAdmins
        .mockResolvedValueOnce(1); // recentlyAdded

      const result = await service.getStatistics();

      expect(result.total).toBe(10);
      expect(result.active).toBe(8);
      expect(result.inactive).toBe(2);
      expect(result.admins).toBe(7);
      expect(result.superAdmins).toBe(3);
      expect(result.recentlyAdded).toBe(1);
    });
  });

  describe('getActivityLogs', () => {
    it('should throw NotFoundException when admin not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.getActivityLogs('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return activity logs', async () => {
      const logs = [
        { id: 'log-1', userId: 'admin-1', action: 'LOGIN', createdAt: new Date() },
      ];
      prisma.user.findFirst.mockResolvedValue(mockAdmin);
      prisma.userActivityLog.findMany.mockResolvedValue(logs);

      const result = await service.getActivityLogs('admin-1');

      expect(result).toEqual(logs);
      expect(prisma.userActivityLog.findMany).toHaveBeenCalledWith({
        where: { userId: 'admin-1' },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    });
  });
});
