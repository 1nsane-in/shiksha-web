import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDeviceTokenDto } from './dto/device-token.dto';

@Injectable()
export class DeviceTokenService {
  constructor(private prisma: PrismaService) {}

  async register(userId: string, dto: RegisterDeviceTokenDto) {
    // Upsert: one token per user+platform combination
    const existing = await this.prisma.deviceToken.findFirst({
      where: { userId, token: dto.token },
    });

    if (existing) {
      return this.prisma.deviceToken.update({
        where: { id: existing.id },
        data: { isActive: true, platform: dto.platform },
      });
    }

    return this.prisma.deviceToken.create({
      data: {
        userId,
        token: dto.token,
        platform: dto.platform,
      },
    });
  }

  async unregister(userId: string, token: string) {
    const existing = await this.prisma.deviceToken.findFirst({
      where: { userId, token },
    });
    if (existing) {
      return this.prisma.deviceToken.update({
        where: { id: existing.id },
        data: { isActive: false },
      });
    }
    return { message: 'Token not found' };
  }

  async getUserTokens(userId: string) {
    return this.prisma.deviceToken.findMany({
      where: { userId, isActive: true },
    });
  }

  async getActiveTokens(userId: string): Promise<string[]> {
    const tokens = await this.prisma.deviceToken.findMany({
      where: { userId, isActive: true },
      select: { token: true },
    });
    return tokens.map((t) => t.token);
  }
}
