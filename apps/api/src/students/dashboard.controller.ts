import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../common/types/request.type';

@ApiTags('Student Dashboard')
@ApiBearerAuth()
@Controller('student/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STUDENT')
export class StudentDashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview with profile, stage, and stats' })
  getOverview(@Req() req: AuthenticatedRequest) {
    return this.dashboardService.getOverview(req.user.id);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get recent activity, notifications, and deadlines' })
  getActivity(@Req() req: AuthenticatedRequest) {
    return this.dashboardService.getActivity(req.user.id);
  }

  @Get('next-steps')
  @ApiOperation({ summary: 'Get context-aware next steps and actions' })
  getNextSteps(@Req() req: AuthenticatedRequest) {
    return this.dashboardService.getNextSteps(req.user.id);
  }
}
