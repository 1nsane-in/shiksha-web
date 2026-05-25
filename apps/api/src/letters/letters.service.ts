import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TimelineService } from '../common/services/timeline.service';
import { NotificationService } from '../common/services/notification.service';
import { UploadLetterDto, UpdateLetterDto } from './dto/letter.dto';

@Injectable()
export class LettersService {
  constructor(
    private prisma: PrismaService,
    private timeline: TimelineService,
    private notification: NotificationService,
  ) {}

  // --- Admission Letter ---

  async uploadAdmissionLetter(adminId: string, dto: UploadLetterDto) {
    const application = await this.prisma.universityApplication.findUnique({
      where: { id: dto.applicationId },
      include: { student: { include: { user: true } } },
    });
    if (!application) throw new NotFoundException('Application not found');
    if (application.status !== 'approved') {
      throw new BadRequestException('Application must be approved before issuing admission letter');
    }

    const letter = await this.prisma.admissionLetter.upsert({
      where: { applicationId: dto.applicationId },
      update: { fileUrl: dto.fileUrl, fileName: dto.fileName, uploadedBy: adminId, uploadedAt: new Date() },
      create: { studentId: application.studentId, applicationId: dto.applicationId, fileUrl: dto.fileUrl, fileName: dto.fileName, uploadedBy: adminId },
    });

    // Stage advancement: Stage 1 -> Stage 2
    const student = application.student;
    if (student.currentStage === 1) {
      await this.prisma.student.update({
        where: { id: student.id },
        data: { currentStage: 2, applicationStatus: 'STAGE_2_PENDING' },
      });
      await this.timeline.onStageAdvanced(dto.applicationId, student.id, 1, 2);
    }

    await this.timeline.onAdmissionLetterUploaded(dto.applicationId, student.id);

    await this.notification.create({
      userId: application.student.user.id,
      type: 'ADMISSION_LETTER',
      title: 'Admission Letter Issued',
      message: 'Your admission letter has been uploaded. Please review and complete the payment of ₹5,000.',
      data: { applicationId: dto.applicationId, letterId: letter.id },
    });

    return letter;
  }

  async getAdmissionLetter(applicationId: string, userId: string, userRole: string) {
    const letter = await this.prisma.admissionLetter.findUnique({
      where: { applicationId },
      include: { application: { include: { student: true } } },
    });
    if (!letter) throw new NotFoundException('Admission letter not found');
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && letter.application?.student.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    await this.prisma.admissionLetter.update({
      where: { id: letter.id },
      data: { viewCount: { increment: 1 } },
    });
    return letter;
  }

  async getMyAdmissionLetter(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found');
    const letter = await this.prisma.admissionLetter.findFirst({
      where: { studentId: student.id },
    });
    if (!letter) throw new NotFoundException('Admission letter not found');
    await this.prisma.admissionLetter.update({
      where: { id: letter.id },
      data: { viewCount: { increment: 1 } },
    });
    return letter;
  }

  async downloadAdmissionLetter(applicationId: string) {
    const letter = await this.prisma.admissionLetter.findUnique({ where: { applicationId } });
    if (!letter) throw new NotFoundException('Admission letter not found');
    await this.prisma.admissionLetter.update({
      where: { id: letter.id },
      data: { downloadCount: { increment: 1 } },
    });
    return letter;
  }

  // --- Invitation Letter ---

  async uploadInvitationLetter(adminId: string, dto: UploadLetterDto) {
    const application = await this.prisma.universityApplication.findUnique({
      where: { id: dto.applicationId },
      include: { student: { include: { user: true } } },
    });
    if (!application) throw new NotFoundException('Application not found');

    const letter = await this.prisma.invitationLetter.upsert({
      where: { applicationId: dto.applicationId },
      update: { fileUrl: dto.fileUrl, fileName: dto.fileName, uploadedBy: adminId, uploadedAt: new Date() },
      create: { studentId: application.studentId, applicationId: dto.applicationId, fileUrl: dto.fileUrl, fileName: dto.fileName, uploadedBy: adminId },
    });

    // Stage advancement: Stage 3 -> Stage 4
    const student = application.student;
    if (student.currentStage < 4) {
      await this.prisma.student.update({
        where: { id: student.id },
        data: { currentStage: 4, applicationStatus: 'STAGE_4_PENDING' },
      });
      await this.timeline.onStageAdvanced(dto.applicationId, student.id, student.currentStage, 4);
    }

    await this.timeline.onInvitationLetterUploaded(dto.applicationId, student.id);

    await this.notification.create({
      userId: application.student.user.id,
      type: 'INVITATION_LETTER',
      title: 'Invitation Letter Issued',
      message: 'Your invitation letter is now available for download.',
      data: { applicationId: dto.applicationId, letterId: letter.id },
    });

    return letter;
  }

  async getInvitationLetter(applicationId: string, userId: string, userRole: string) {
    const letter = await this.prisma.invitationLetter.findUnique({
      where: { applicationId },
      include: { application: { include: { student: true } } },
    });
    if (!letter) throw new NotFoundException('Invitation letter not found');
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && letter.application?.student.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    await this.prisma.invitationLetter.update({
      where: { id: letter.id },
      data: { viewCount: { increment: 1 } },
    });
    return letter;
  }

  async getMyInvitationLetter(studentId: string) {
    const letter = await this.prisma.invitationLetter.findFirst({
      where: { studentId },
    });
    if (!letter) throw new NotFoundException('Invitation letter not found');
    // Check if downloadable
    if (!letter.isDownloadable) {
      // Check if Stage 4 payment is done or auto-unlock
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
      });
      throw new ForbiddenException('Invitation letter will be available after completing previous stages');
    }
    await this.prisma.invitationLetter.update({
      where: { id: letter.id },
      data: { viewCount: { increment: 1 } },
    });
    return letter;
  }

  async downloadInvitationLetter(applicationId: string) {
    const letter = await this.prisma.invitationLetter.findUnique({
      where: { applicationId },
      include: { application: { include: { student: true } } },
    });
    if (!letter) throw new NotFoundException('Invitation letter not found');
    if (!letter.isDownloadable && (letter.application?.student?.currentStage ?? 0) < 4) {
      throw new ForbiddenException('Invitation letter download is not yet available');
    }
    await this.prisma.invitationLetter.update({
      where: { id: letter.id },
      data: { downloadCount: { increment: 1 } },
    });
    return letter;
  }

  async updateInvitationLetter(letterId: string, dto: UpdateLetterDto) {
    return this.prisma.invitationLetter.update({
      where: { id: letterId },
      data: dto,
    });
  }

  // --- Stage 4 approval after invitation letter ---
  async approveInvitationLetterAccess(applicationId: string) {
    const letter = await this.prisma.invitationLetter.findUnique({
      where: { applicationId },
      include: { application: { include: { student: true } } },
    });
    if (!letter) throw new NotFoundException('Invitation letter not found');

    await this.prisma.invitationLetter.update({
      where: { id: letter.id },
      data: { isDownloadable: true },
    });

    const student = letter.application?.student;
    if (!student) throw new NotFoundException('Student not found');
    await this.prisma.student.update({
      where: { id: student.id },
      data: { currentStage: 5, applicationStatus: 'STAGE_5_UNLOCKED' },
    });

    await this.timeline.onStageAdvanced(applicationId, student.id, 4, 5);
    await this.timeline.onVisaSupportStarted(applicationId, student.id);

    return { message: 'Invitation letter access approved. Stage 5 unlocked.' };
  }
}