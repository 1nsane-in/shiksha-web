import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface TimelineEventInput {
  applicationId: string;
  studentId: string;
  stage: number;
  event: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class TimelineService {
  constructor(private prisma: PrismaService) {}

  async createEvent(input: TimelineEventInput) {
    return this.prisma.applicationTimeline.create({
      data: {
        applicationId: input.applicationId,
        studentId: input.studentId,
        stage: input.stage,
        event: input.event,
        title: input.title,
        description: input.description,
        metadata: input.metadata ?? {},
      },
    });
  }

  async getApplicationTimeline(applicationId: string) {
    const events = await this.prisma.applicationTimeline.findMany({
      where: { applicationId },
      orderBy: { occurredAt: 'asc' },
    });
    if (events.length === 0) return [];
    const latestStage = Math.max(...events.map(e => e.stage));
    const latestTime = Math.max(...events.filter(e => e.stage === latestStage).map(e => e.occurredAt.getTime()));
    return events.map(event => ({
      ...event,
      isCompleted: true,
      isActive: event.stage === latestStage && event.occurredAt.getTime() === latestTime,
    }));
  }

  async getStudentTimeline(studentId: string) {
    return this.prisma.applicationTimeline.findMany({
      where: { studentId },
      orderBy: { occurredAt: 'desc' },
      include: {
        application: {
          select: {
            id: true,
            university: { select: { name: true, shortName: true } },
          },
        },
      },
    });
  }

  async getLatestEvent(applicationId: string) {
    return this.prisma.applicationTimeline.findFirst({
      where: { applicationId },
      orderBy: { occurredAt: 'desc' },
    });
  }

  // --- Predefined event creators ---

  async onApplicationSubmitted(applicationId: string, studentId: string) {
    return this.createEvent({ applicationId, studentId, stage: 1, event: 'APPLICATION_SUBMITTED', title: 'Application Submitted', description: 'Your university application has been submitted successfully.', metadata: { submittedAt: new Date().toISOString() } });
  }

  async onStageAdvanced(applicationId: string, studentId: string, fromStage: number, toStage: number) {
    const names: Record<number, string> = { 1: 'Initial Application', 2: 'Admission Letter & Payment', 3: 'Entrance Exam', 4: 'Invitation Letter', 5: 'Visa & Travel Support' };
    return this.createEvent({ applicationId, studentId, stage: toStage, event: 'STAGE_ADVANCED', title: 'Stage ' + toStage + ' Unlocked: ' + (names[toStage] || 'Stage ' + toStage), description: 'You have progressed from "' + (names[fromStage] || 'Stage ' + fromStage) + '" to "' + (names[toStage] || 'Stage ' + toStage) + '".', metadata: { fromStage, toStage } });
  }

  async onAdmissionLetterUploaded(applicationId: string, studentId: string) {
    return this.createEvent({ applicationId, studentId, stage: 2, event: 'ADMISSION_LETTER_ISSUED', title: 'Admission Letter Issued', description: 'Your admission letter has been uploaded. Please review and proceed with payment.', metadata: { uploadedAt: new Date().toISOString() } });
  }

  async onStage2PaymentCompleted(applicationId: string, studentId: string, amount: number) {
    return this.createEvent({ applicationId, studentId, stage: 2, event: 'PAYMENT_STAGE_2_COMPLETED', title: 'Admission Fee Paid', description: 'Payment of ₹' + (amount?.toLocaleString() || '5,000') + ' completed successfully.', metadata: { amount, paidAt: new Date().toISOString() } });
  }

  async onExamScheduled(applicationId: string, studentId: string, examDate: string, examCenter: string) {
    return this.createEvent({ applicationId, studentId, stage: 3, event: 'EXAM_SCHEDULED', title: 'Entrance Exam Scheduled', description: 'Your exam is scheduled on ' + examDate + ' at ' + examCenter + '.', metadata: { examDate, examCenter } });
  }

  async onExamResultDeclared(applicationId: string, studentId: string, passed: boolean, remarks?: string) {
    return this.createEvent({ applicationId, studentId, stage: 3, event: passed ? 'EXAM_PASSED' : 'EXAM_FAILED', title: passed ? 'Entrance Exam Passed' : 'Entrance Exam Failed', description: passed ? 'Congratulations! You have passed the entrance exam.' : (remarks || 'You did not pass the entrance exam. Please contact support for next steps.'), metadata: { passed, remarks, declaredAt: new Date().toISOString() } });
  }

  async onInvitationLetterUploaded(applicationId: string, studentId: string) {
    return this.createEvent({ applicationId, studentId, stage: 4, event: 'INVITATION_LETTER_ISSUED', title: 'Invitation Letter Issued', description: 'Your invitation letter is now available for download.', metadata: { uploadedAt: new Date().toISOString() } });
  }

  async onVisaSupportStarted(applicationId: string, studentId: string) {
    return this.createEvent({ applicationId, studentId, stage: 5, event: 'VISA_SUPPORT_STARTED', title: 'Visa Support Started', description: 'Visa application support is now available. Please check the visa checklist.', metadata: { startedAt: new Date().toISOString() } });
  }

  async onTicketCreated(applicationId: string, studentId: string, ticketId: string, subject: string) {
    return this.createEvent({ applicationId, studentId, stage: 0, event: 'TICKET_CREATED', title: 'Support Ticket Created', description: subject, metadata: { ticketId } });
  }

  async onTicketResolved(applicationId: string, studentId: string, ticketId: string) {
    return this.createEvent({ applicationId, studentId, stage: 0, event: 'TICKET_RESOLVED', title: 'Support Ticket Resolved', description: 'A support ticket has been resolved.', metadata: { ticketId } });
  }

  async onApplicationCompleted(applicationId: string, studentId: string) {
    return this.createEvent({ applicationId, studentId, stage: 5, event: 'APPLICATION_COMPLETED', title: 'Application Complete', description: 'All stages completed. Welcome aboard!', metadata: { completedAt: new Date().toISOString() } });
  }
}