import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TimelineService } from '../../common/services/timeline.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../../auth/decorators/user.decorator';
import type { AuthenticatedUser } from '../../common/types/request.type';

@ApiTags('Timeline')
@ApiBearerAuth()
@Controller('timeline')
export class TimelineController {
  constructor(
    private timelineService: TimelineService,
    private prisma: PrismaService,
  ) {}

  @Get('application/:applicationId')
  @ApiOperation({ summary: 'Get timeline events for an application' })
  async getApplicationTimeline(
    @Param('applicationId') applicationId: string,
    @AuthUser() user: AuthenticatedUser,
  ) {
    // Ownership check: student can only see own timeline; admin can see any
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      const student = await this.prisma.student.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (!student) throw new NotFoundException('Student profile not found');
      const app = await this.prisma.application.findUnique({
        where: { id: applicationId },
        select: { studentId: true },
      });
      if (!app || app.studentId !== student.id) {
        throw new NotFoundException('Application not found');
      }
    }
    return this.timelineService.getApplicationTimeline(applicationId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my timeline events (Student)' })
  async getMyTimeline(@AuthUser() user: AuthenticatedUser) {
    const student = await this.prisma.student.findUnique({
      where: { userId: user.id },
    });
    if (!student) throw new NotFoundException('Student profile not found');
    return this.timelineService.getStudentTimeline(student.id);
  }
}
