import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { UpdateProfileDto, UpdateUserByAdminDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getProfile(userId: string, fields?: string) {
    const cacheKey = fields
      ? `user:profile:${userId}:fields:${fields}`
      : `user:profile:${userId}`;

    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const select = this.buildUserSelect(fields, true);

        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          ...(select ? { select } : { include: { student: true } }) as any,
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        return user;
      },
      300, // Cache for 5 minutes
    );
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    // Invalidate profile cache
    await this.redis.del(`user:profile:${userId}`);

    return user;
  }

  async findAll(page: number = 1, limit: number = 10, role?: string, fields?: string) {
    const cacheKey = `users:list:${page}:${limit}:${role || 'all'}:${fields || 'default'}`;

    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const skip = (page - 1) * limit;

        const where = role ? { role: role as any } : {};
        const select = this.buildUserSelect(fields);

        const [users, total] = await Promise.all([
          this.prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            ...(select ? { select } : { include: { student: true } }) as any,
          }),
          this.prisma.user.count({ where }),
        ]);

        return {
          data: users,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        };
      },
      300, // Cache for 5 minutes
    );
  }

  async findOne(id: string, fields?: string) {
    const cacheKey = fields
      ? `user:${id}:fields:${fields}`
      : `user:${id}`;

    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const select = this.buildUserSelect(fields);

        const user = await this.prisma.user.findUnique({
          where: { id },
          ...(select ? { select } : { include: { student: true } }) as any,
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        return user;
      },
      300, // Cache for 5 minutes
    );
  }

  private buildUserSelect(fields?: string, includeStudent?: boolean) {
    if (!fields) return undefined;

    const fieldList = fields.split(',').map(f => f.trim()).filter(Boolean);
    if (fieldList.length === 0) return undefined;

    const select: any = { id: true };

    const allowedScalars = ['email', 'name', 'phone', 'role', 'isActive', 'avatarUrl', 'createdAt', 'updatedAt'];

    for (const field of allowedScalars) {
      if (fieldList.includes(field)) {
        select[field] = true;
      }
    }

    const studentFields = fieldList.filter(f => f.startsWith('student.'));
    if (studentFields.length > 0 || (includeStudent && fieldList.includes('student'))) {
      select.student = { select: {} as Record<string, boolean> };
      const allowedStudent = ['id', 'currentStage', 'applicationStatus', 'neetScore', 'neetRank', 'twelfthPercentage', 'tenthPercentage', 'userId'];
      if (fieldList.includes('student')) {
        for (const s of allowedStudent) select.student.select[s] = true;
      } else {
        for (const sf of studentFields) {
          const key = sf.replace('student.', '');
          if (allowedStudent.includes(key)) {
            select.student.select[key] = true;
          }
        }
        if (!select.student.select.id) {
          select.student.select.id = true;
        }
      }
    }

    return select;
  }

  async update(id: string, dto: UpdateUserByAdminDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    // Invalidate caches
    await this.redis.del(`user:profile:${id}`);
    await this.redis.deletePattern('users:list:*');

    return user;
  }

  async deactivate(id: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    // Invalidate caches
    await this.redis.del(`user:profile:${id}`);
    await this.redis.deletePattern('users:list:*');

    return { message: 'User deactivated', user };
  }

  async activate(id: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    // Invalidate caches
    await this.redis.del(`user:profile:${id}`);
    await this.redis.deletePattern('users:list:*');

    return { message: 'User activated', user };
  }
}
