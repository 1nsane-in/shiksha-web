import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/dashboard')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getDashboardStats() {
    const [
      totalStudents,
      pendingDocuments,
      pendingPayments,
      recentStudents,
      stageWiseCount,
    ] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.studentDocument.count({
        where: { status: 'UPLOADED' },
      }),
      this.prisma.payment.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.student.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      this.prisma.student.groupBy({
        by: ['currentStage'],
        _count: true,
      }),
    ]);

    const admissionsLettersUploaded = await this.prisma.admissionLetter.count();
    const invitationsLettersUploaded = await this.prisma.invitationLetter.count();
    const totalRevenue = await this.prisma.payment.aggregate({
      where: { status: { in: ['SUCCESS', 'MANUALLY_APPROVED'] } },
      _sum: { amount: true },
    });

    return {
      totalStudents,
      pendingDocuments,
      pendingPayments,
      admissionsLettersUploaded,
      invitationsLettersUploaded,
      totalRevenue: totalRevenue._sum.amount || 0,
      recentStudents,
      stageWiseCount: stageWiseCount.reduce((acc, item) => {
        acc[`stage_${item.currentStage}`] = item._count;
        return acc;
      }, {}),
    };
  }
}
