import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLog } from '@prisma/client';

export interface CreateAuditLogDto {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  changeReason?: string;
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
        oldValue: data.oldValue,
        newValue: data.newValue,
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
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    });
  }

  async getUserAuditTrail(userId: string, limit: number = 100) {
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
    return this.prisma.auditLog.findMany({
      where: {
        ...(options?.action && { action: options.action }),
        ...(options?.entityType && { entityType: options.entityType }),
        ...(options?.userId && { userId: options.userId }),
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
    });
  }

  async logStageChange(data: {
    studentId: string;
    fromStage?: number;
    toStage: number;
    fromStatus?: string;
    toStatus: string;
    changedBy?: string;
    reason?: string;
    metadata?: Record<string, any>;
  }) {
    const newMeta = data.metadata || {};
    const newMetaJson = Object.keys(newMeta).length > 0 ? newMeta : undefined;
    
    return this.prisma.stageHistory.create({
      data: {
        studentId: data.studentId,
        fromStage: data.fromStage,
        toStage: data.toStage,
        fromStatus: data.fromStatus as any,
        toStatus: data.toStatus as any,
        changedBy: data.changedBy,
        reason: data.reason,
        metadata: newMetaJson,
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
