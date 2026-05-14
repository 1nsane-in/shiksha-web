import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
    channels?: { email?: boolean; sms?: boolean; push?: boolean };
  }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data,
        channels: data.channels,
      },
    });
  }

  async getUserNotifications(
    userId: string,
    options?: { unreadOnly?: boolean; limit?: number }
  ) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        ...(options?.unreadOnly && { isRead: false }),
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 20,
    });
  }

  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  // Bulk notifications for automation
  async createBulk(notifications: Array<{
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
  }>) {
    return this.prisma.notification.createMany({
      data: notifications.map(n => ({
        userId: n.userId,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data,
      })),
    });
  }

  async markSent(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { sentAt: new Date() },
    });
  }

  async getPendingNotifications() {
    return this.prisma.notification.findMany({
      where: {
        sentAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
      },
      take: 100,
    });
  }
}
