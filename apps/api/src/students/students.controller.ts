import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateStudentProfileDto, UpdateAcademicDto, AdminUpdateStudentDto, AssignUniversityDto } from './students.dto';

@Controller('student')
@UseGuards(JwtAuthGuard)
@Roles('STUDENT')
export class StudentController {
  constructor(private studentsService: StudentsService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.studentsService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() dto: UpdateStudentProfileDto) {
    return this.studentsService.updateProfile(req.user.id, dto);
  }

  @Put('profile/academic')
  async updateAcademic(@Request() req, @Body() dto: UpdateAcademicDto) {
    return this.studentsService.updateProfile(req.user.id, dto);
  }

  @Get('stage')
  async getStageInfo(@Request() req) {
    return this.studentsService.getStageInfo(req.user.id);
  }
}

@Controller('admin/students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminStudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('stage') stage?: string,
  ) {
    return this.studentsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      status,
      stage ? parseInt(stage) : undefined,
    );
  }

  @Get('stats')
  async getStats() {
    return this.studentsService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: AdminUpdateStudentDto) {
    return this.studentsService.adminUpdate(id, dto);
  }

  @Put(':id/stage')
  async updateStage(
    @Param('id') id: string,
    @Body('stage') stage: number,
    @Body('status') status?: string,
  ) {
    return this.studentsService.updateStage(id, stage, status);
  }

  @Post(':id/assign-university')
  async assignUniversity(@Param('id') id: string, @Body() dto: AssignUniversityDto) {
    return this.studentsService.assignUniversity(id, dto);
  }
}
