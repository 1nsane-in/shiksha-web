import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async recordDailyMetric(metricType: string, value: number, metadata?: Record<string, any>) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.dailyMetric.upsert({
      where: {
        date_metricType: {
          date: today,
          metricType,
        },
      },
      update: {
        value: value,
        count: { increment: 1 },
        metadata,
      },
      create: {
        date: today,
        metricType,
        value,
        metadata,
      },
    });
  }

  async getMetrics(metricType: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    return this.prisma.dailyMetric.findMany({
      where: {
        metricType,
        date: { gte: since },
      },
      orderBy: { date: 'asc' },
    });
  }

  async calculateStudentMetric(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        payments: true,
        documents: true,
        stageHistories: true,
      },
    });

    if (!student) return null;

    // Calculate metrics
    const totalPayments = student.payments
      .filter(p => p.status === 'SUCCESS' || p.status === 'MANUALLY_APPROVED')
      .reduce((sum, p) => sum + p.amount, 0);

    const approvedDocs = student.documents.filter(d => d.status === 'APPROVED').length;
    const totalDocs = student.documents.length;
    const documentScore = totalDocs > 0 ? (approvedDocs / totalDocs) * 100 : 0;

    const completionRate = this.calculateCompletionRate(student.currentStage, student.applicationStatus);

    const daysInSystem = Math.floor(
      (new Date().getTime() - student.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    await this.prisma.studentMetric.upsert({
      where: { studentId },
      update: {
        totalPayments,
        documentScore,
        completionRate,
        daysInSystem,
        lastCalculatedAt: new Date(),
      },
      create: {
        studentId,
        totalPayments,
        documentScore,
        completionRate,
        daysInSystem,
      },
    });

    return { totalPayments, documentScore, completionRate, daysInSystem };
  }

  private calculateCompletionRate(stage: number, status: string): number {
    const stageWeights: Record<number, number> = {
      1: 20,
      2: 40,
      3: 60,
      4: 80,
      5: 100,
    };

    if (status === 'COMPLETED') return 100;
    if (status === 'REJECTED') return 0;

    return stageWeights[stage] || 0;
  }

  async getDashboardMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      studentsByStage,
      studentsByStatus,
      totalRevenue,
      pendingDocuments,
      pendingPayments,
      todayRegistrations,
      todayPayments,
    ] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.groupBy({
        by: ['currentStage'],
        _count: true,
      }),
      this.prisma.student.groupBy({
        by: ['applicationStatus'],
        _count: true,
      }),
      this.prisma.payment.aggregate({
        where: { status: { in: ['SUCCESS', 'MANUALLY_APPROVED'] } },
        _sum: { amount: true },
      }),
      this.prisma.studentDocument.count({
        where: { status: 'UPLOADED' },
      }),
      this.prisma.payment.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.student.count({
        where: { createdAt: { gte: today } },
      }),
      this.prisma.payment.aggregate({
        where: {
          status: 'SUCCESS',
          createdAt: { gte: today },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      students: {
        total: totalStudents,
        byStage: studentsByStage.reduce((acc, item) => {
          acc[`stage_${item.currentStage}`] = item._count;
          return acc;
        }, {} as Record<string, number>),
        byStatus: studentsByStatus.reduce((acc, item) => {
          acc[item.applicationStatus] = item._count;
          return acc;
        }, {} as Record<string, number>),
        todayRegistrations,
      },
      payments: {
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingPayments,
        todayRevenue: todayPayments._sum.amount || 0,
        todayPayments: todayPayments._count,
      },
      documents: {
        pending: pendingDocuments,
      },
    };
  }
}
