import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, name: true, phone: true, avatarUrl: true } },
        applications: {
          select: { id: true, status: true, selectedProgram: true, submittedAt: true, university: { select: { id: true, name: true, shortName: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        admissionLetter: { select: { id: true } },
        invitationLetter: { select: { id: true } },
        examRecords: { select: { id: true, examDate: true, result: true }, take: 1, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!student) throw new NotFoundException('Student not found');

    const [documentStats, paymentStats] = await Promise.all([
      this.prisma.studentDocument.groupBy({ by: ['status'], where: { studentId: student.id }, _count: true }),
      this.prisma.payment.groupBy({ by: ['status'], where: { studentId: student.id }, _sum: { amount: true }, _count: true }),
    ]);

    const docStats = { total: 0, approved: 0, pending: 0, rejected: 0 };
    for (const d of documentStats) {
      docStats.total += d._count;
      if (d.status === 'APPROVED') docStats.approved = d._count;
      else if (d.status === 'REJECTED') docStats.rejected = d._count;
      else docStats.pending += d._count;
    }

    const payStats = { totalPaid: 0, pendingAmount: 0, totalPayments: 0 };
    for (const p of paymentStats) {
      payStats.totalPayments += p._count;
      if (p.status === 'SUCCESS' || p.status === 'MANUALLY_APPROVED') payStats.totalPaid += p._sum.amount || 0;
      else if (p.status === 'PENDING') payStats.pendingAmount += p._sum.amount || 0;
    }

    return {
      profile: {
        studentId: student.id,
        ...student.user,
        fatherName: student.fatherName,
        motherName: student.motherName,
        dob: student.dob,
        gender: student.gender,
        address: student.address,
        city: student.city,
        state: student.state,
        country: student.country,
        pincode: student.pincode,
        passportNumber: student.passportNumber,
        passportExpiry: student.passportExpiry,
        passportIssueDate: student.passportIssueDate,
        passportIssueCountry: student.passportIssueCountry,
        neetScore: student.neetScore,
        neetRank: student.neetRank,
        twelfthPercentage: student.twelfthPercentage,
        tenthPercentage: student.tenthPercentage,
      },
      stage: { currentStage: student.currentStage, applicationStatus: student.applicationStatus },
      documentStats: docStats,
      paymentStats: payStats,
      applicationSummary: { total: student.applications.length, applications: student.applications },
      examSummary: student.examRecords[0] || null,
      lettersAvailability: { admissionLetter: !!student.admissionLetter, invitationLetter: !!student.invitationLetter },
    };
  }

  async getActivity(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId }, select: { id: true } });
    if (!student) throw new NotFoundException('Student not found');

    const [recentEvents, unreadNotifications, examRecords, visaApps] = await Promise.all([
      this.prisma.applicationTimeline.findMany({
        where: { studentId: student.id },
        orderBy: { occurredAt: 'desc' },
        take: 10,
        select: { id: true, stage: true, event: true, title: true, description: true, occurredAt: true },
      }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
      this.prisma.examRecord.findMany({
        where: { studentId: student.id, examDate: { gt: new Date() } },
        select: { id: true, examDate: true, examSubject: true, examCenter: true },
      }),
      this.prisma.visaApplication.findMany({
        where: { studentId: student.id, appointmentDate: { gt: new Date() } },
        select: { id: true, appointmentDate: true, visaType: true },
      }),
    ]);

    const upcomingDeadlines = [
      ...examRecords.map(e => ({ type: 'exam' as const, date: e.examDate, title: `Exam: ${e.examSubject || 'Entrance'}`, detail: e.examCenter })),
      ...visaApps.map(v => ({ type: 'visa' as const, date: v.appointmentDate, title: `Visa Appointment`, detail: v.visaType })),
    ].sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

    return { recentEvents, unreadNotifications, upcomingDeadlines };
  }

  async getNextSteps(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true, phone: true } },
        documents: { select: { status: true, documentType: { select: { requiredForStage: true } } } },
        payments: { select: { stage: true, status: true } },
        applications: { select: { id: true, status: true } },
        admissionLetter: { select: { id: true } },
        invitationLetter: { select: { id: true, isDownloadable: true } },
        examRecords: { select: { result: true } },
      },
    });

    if (!student) throw new NotFoundException('Student not found');

    const actions: { type: string; title: string; description: string; actionUrl: string; priority: 'high' | 'medium' | 'low'; completed: boolean }[] = [];
    const stage = student.currentStage;

    // Profile completeness
    const profileComplete = !!(student.user.name && student.dob && student.address && student.country);
    actions.push({ type: 'profile', title: 'Complete your profile', description: 'Fill in personal details, address, and academic info', actionUrl: '/student/profile', priority: 'high', completed: profileComplete });

    const passportComplete = !!(student.passportNumber && student.passportExpiry);
    actions.push({ type: 'passport', title: 'Add passport details', description: 'Required for international admission process', actionUrl: '/student/profile', priority: stage >= 4 ? 'high' : 'medium', completed: passportComplete });

    if (stage >= 1) {
      const stageDocs = student.documents.filter(d => d.documentType.requiredForStage <= stage);
      const approvedDocs = stageDocs.filter(d => d.status === 'APPROVED').length;
      actions.push({ type: 'documents', title: 'Upload required documents', description: `${approvedDocs}/${stageDocs.length || 1} documents approved`, actionUrl: '/student/documents', priority: 'high', completed: stageDocs.length > 0 && approvedDocs === stageDocs.length });

      const stagePayment = student.payments.find(p => p.stage === stage && (p.status === 'SUCCESS' || p.status === 'MANUALLY_APPROVED'));
      actions.push({ type: 'payment', title: `Complete Stage ${stage} payment`, description: stagePayment ? 'Payment confirmed' : 'Payment required to proceed', actionUrl: '/student/payments', priority: 'high', completed: !!stagePayment });
    }

    if (stage >= 1) {
      const hasApp = student.applications.length > 0;
      actions.push({ type: 'application', title: 'Submit university application', description: hasApp ? 'Application submitted' : 'Apply to your preferred university', actionUrl: '/student/applications', priority: stage === 1 ? 'high' : 'medium', completed: hasApp });
    }

    if (stage >= 2) {
      const passed = student.examRecords.some(e => e.result === 'PASSED');
      actions.push({ type: 'exam', title: 'Entrance examination', description: passed ? 'Exam passed!' : 'Prepare for entrance exam', actionUrl: '/student/exams', priority: 'high', completed: passed });
    }

    if (stage >= 3) {
      actions.push({ type: 'admission_letter', title: 'Admission letter', description: student.admissionLetter ? 'Available for download' : 'Awaiting admin upload', actionUrl: '/student/letters', priority: 'medium', completed: !!student.admissionLetter });
    }

    if (stage >= 4) {
      actions.push({ type: 'invitation_letter', title: 'Invitation letter', description: student.invitationLetter?.isDownloadable ? 'Ready to download' : 'Pending approval', actionUrl: '/student/letters', priority: 'high', completed: !!student.invitationLetter?.isDownloadable });
    }

    if (stage >= 5) {
      actions.push({ type: 'visa', title: 'Visa application', description: 'Start your visa process', actionUrl: '/student/visa-support', priority: 'high', completed: false });
    }

    const completed = actions.filter(a => a.completed).length;
    const completionPercentage = actions.length > 0 ? Math.round((completed / actions.length) * 100) : 0;
    const pendingItems = actions.filter(a => !a.completed).map(a => a.title);

    return { nextActions: actions, completionPercentage, pendingItems };
  }
}
