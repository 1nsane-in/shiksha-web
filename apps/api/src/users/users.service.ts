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

  async getProfile(userId: string) {
    return this.redis.getOrSet(
      `user:profile:${userId}`,
      async () => {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          include: { student: true },
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

  async findAll(page: number = 1, limit: number = 10, role?: string) {
    const cacheKey = `users:list:${page}:${limit}:${role || 'all'}`;

    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const skip = (page - 1) * limit;

        const where = role ? { role: role as any } : {};

        const [users, total] = await Promise.all([
          this.prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { student: true },
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

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { student: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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
