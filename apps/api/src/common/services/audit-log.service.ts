import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLog, ApplicationStatus, Prisma } from '@prisma/client';

export interface CreateAuditLogDto {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  changeReason?: string;
}

export interface StageChangeData {
  studentId: string;
  fromStage?: number;
  toStage: number;
  fromStatus?: string;
  toStatus: string;
  changedBy?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async log(data: CreateAuditLogDto): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        oldValue: data.oldValue as Prisma.InputJsonValue | undefined,
        newValue: data.newValue as Prisma.InputJsonValue | undefined,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        changeReason: data.changeReason,
      },
    });
  }

  async getEntityHistory(
    entityType: string,
    entityId: string,
    options?: { limit?: number; offset?: number }
  ) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    });
  }

  async getUserAuditTrail(userId: string, limit = 100) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getRecentChanges(options?: {
    action?: string;
    entityType?: string;
    userId?: string;
    limit?: number;
  }) {
    const where: Record<string, unknown> = {};
    if (options?.action) where.action = options.action;
    if (options?.entityType) where.entityType = options.entityType;
    if (options?.userId) where.userId = options.userId;

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
    });
  }

  async logStageChange(data: StageChangeData) {
    const metadata = data.metadata && Object.keys(data.metadata).length > 0
      ? data.metadata
      : undefined;

    return this.prisma.stageHistory.create({
      data: {
        studentId: data.studentId,
        fromStage: data.fromStage,
        toStage: data.toStage,
        fromStatus: data.fromStatus as ApplicationStatus,
        toStatus: data.toStatus as ApplicationStatus,
        changedBy: data.changedBy,
        reason: data.reason,
        metadata: metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async getStageHistory(studentId: string) {
    return this.prisma.stageHistory.findMany({
      where: { studentId },
      orderBy: { changedAt: 'desc' },
    });
  }
}
