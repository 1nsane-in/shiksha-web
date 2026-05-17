import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  CreateAdminDto,
  UpdateAdminDto,
  ChangePasswordDto,
  ResetAdminPasswordDto,
  AdminQueryDto,
} from './admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Get all admins with filters
  async findAll(query: AdminQueryDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {
      role: {
        in: ['ADMIN', 'SUPER_ADMIN'],
      },
    };

    if (query.role) {
      where.role = query.role;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [admins, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: admins,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single admin by ID
  async findOne(id: string) {
    const admin = await this.prisma.user.findFirst({
      where: {
        id,
        role: {
          in: ['ADMIN', 'SUPER_ADMIN'],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        lastLoginIp: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  // Create new admin
  async create(dto: CreateAdminDto, createdBy: string) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create admin user
    const admin = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        passwordHash: hashedPassword,
        role: dto.role,
        emailVerified: true,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return {
      message: 'Admin created successfully',
      admin,
    };
  }

  // Update admin
  async update(id: string, dto: UpdateAdminDto) {
    await this.findOne(id);

    const admin = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.role && { role: dto.role }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Admin updated successfully',
      admin,
    };
  }

  // Delete admin (soft delete)
  async delete(id: string, currentUserId: string) {
    // Prevent self-deletion
    if (id === currentUserId) {
      throw new BadRequestException('Cannot delete your own account');
    }

    await this.findOne(id);

    // Soft delete by deactivating
    const admin = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    });

    return {
      message: 'Admin deleted successfully',
      admin,
    };
  }

  // Activate/Deactivate admin
  async toggleStatus(id: string, currentUserId: string) {
    // Prevent self-deactivation
    if (id === currentUserId) {
      throw new BadRequestException('Cannot change your own status');
    }

    const admin = await this.findOne(id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive: !admin.isActive },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    });

    return {
      message: `Admin ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      admin: updated,
    };
  }

  // Change password (by admin themselves)
  async changePassword(id: string, dto: ChangePasswordDto) {
    const admin = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!admin || !admin.passwordHash) {
      throw new NotFoundException('Admin not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      admin.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    });

    return {
      message: 'Password changed successfully',
    };
  }

  // Reset password (by super admin)
  async resetPassword(id: string, dto: ResetAdminPasswordDto) {
    await this.findOne(id);

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    });

    return {
      message: 'Password reset successfully',
    };
  }

  // Get admin statistics
  async getStatistics() {
    const [total, active, inactive, admins, superAdmins, recentlyAdded] =
      await Promise.all([
        this.prisma.user.count({
          where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
        }),
        this.prisma.user.count({
          where: {
            role: { in: ['ADMIN', 'SUPER_ADMIN'] },
            isActive: true,
          },
        }),
        this.prisma.user.count({
          where: {
            role: { in: ['ADMIN', 'SUPER_ADMIN'] },
            isActive: false,
          },
        }),
        this.prisma.user.count({
          where: { role: 'ADMIN' },
        }),
        this.prisma.user.count({
          where: { role: 'SUPER_ADMIN' },
        }),
        this.prisma.user.count({
          where: {
            role: { in: ['ADMIN', 'SUPER_ADMIN'] },
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        }),
      ]);

    return {
      total,
      active,
      inactive,
      admins,
      superAdmins,
      recentlyAdded,
    };
  }

  // Get admin activity logs
  async getActivityLogs(id: string, limit: number = 20) {
    await this.findOne(id);

    const logs = await this.prisma.userActivityLog.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs;
  }
}
