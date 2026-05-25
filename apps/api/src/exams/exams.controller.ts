import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { ScheduleExamDto, DeclareExamResultDto } from './dto/exam.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthUser } from '../auth/decorators/user.decorator';
import type { AuthenticatedUser } from '../common/types/request.type';

@ApiTags('Exams')
@ApiBearerAuth()
@Controller('exams')
export class ExamsController {
  constructor(private examsService: ExamsService) {}

  @Post('schedule')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Schedule entrance exam (Admin)' })
  async schedule(@Body() dto: ScheduleExamDto, @AuthUser() user: AuthenticatedUser) {
    return this.examsService.scheduleExam(user.id, dto);
  }

  @Post('declare-result')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Declare exam result (Admin)' })
  async declareResult(@Body() dto: DeclareExamResultDto, @AuthUser() user: AuthenticatedUser) {
    return this.examsService.declareResult(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my exam details (Student)' })
  async getMyExam(@AuthUser() user: AuthenticatedUser) {
    return this.examsService.getMyExam(user.id);
  }

  @Get('application/:applicationId')
  @ApiOperation({ summary: 'Get exam by application ID' })
  async getByApplication(@Param('applicationId') applicationId: string, @AuthUser() user: AuthenticatedUser) {
    return this.examsService.getExamByApplication(applicationId, user.id, user.role);
  }

  @Get('admin/all')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all exams (Admin)' })
  async getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.examsService.getAllExams(Number(page) || 1, Number(limit) || 20);
  }
}