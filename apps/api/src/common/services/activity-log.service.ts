import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface LogActivityDto {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async logActivity(data: LogActivityDto) {
    return this.prisma.userActivityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata || {},
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async getUserTimeline(userId: string, limit: number = 50) {
    return this.prisma.userActivityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getRecentActivity(limit: number = 100) {
    return this.prisma.userActivityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async getActivityStats(days: number = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const activities = await this.prisma.userActivityLog.groupBy({
      by: ['action'],
      where: {
        createdAt: { gte: since },
      },
      _count: true,
    });

    return activities.reduce((acc, item) => {
      acc[item.action] = item._count;
      return acc;
    }, {} as Record<string, number>);
  }

  async trackPageView(data: {
    userId?: string;
    sessionId: string;
    path: string;
    queryParams?: Record<string, any>;
    referrer?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
  }) {
    return this.prisma.pageView.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId,
        path: data.path,
        queryParams: data.queryParams,
        referrer: data.referrer,
        deviceType: data.deviceType,
        browser: data.browser,
        os: data.os,
      },
    });
  }

  async getUserSessionStats(userId: string) {
    const pageViews = await this.prisma.pageView.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const uniquePages = new Set(pageViews.map(pv => pv.path)).size;
    const totalDuration = pageViews.reduce((sum, pv) => sum + (pv.duration || 0), 0);
    const bounces = pageViews.filter(pv => pv.bounced).length;

    return {
      totalPageViews: pageViews.length,
      uniquePages,
      averageDuration: pageViews.length > 0 ? totalDuration / pageViews.length : 0,
      bounceRate: pageViews.length > 0 ? (bounces / pageViews.length) * 100 : 0,
      lastActive: pageViews[0]?.createdAt,
    };
  }
}
