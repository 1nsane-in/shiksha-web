import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  UpdateStudentProfileDto,
  UpdateAcademicDto,
  AdminUpdateStudentDto,
  AssignUniversityDto,
} from './students.dto';
import { SubmitApplicationFormDto } from './dto/application-form.dto';
import type { AuthenticatedRequest } from '../common/types/request.type';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Student')
@ApiBearerAuth()
@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STUDENT')
export class StudentController {
  constructor(private studentsService: StudentsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get student profile' })
  @ApiResponse({ status: 200, description: 'Student profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.studentsService.getProfile(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update student profile' })
  @ApiBody({ type: UpdateStudentProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.studentsService.updateProfile(req.user.id, dto);
  }

  @Put('profile/academic')
  @ApiOperation({ summary: 'Update academic info' })
  @ApiBody({ type: UpdateAcademicDto })
  @ApiResponse({ status: 200, description: 'Academic info updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateAcademic(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateAcademicDto,
  ) {
    return this.studentsService.updateProfile(req.user.id, dto);
  }

  @Get('stage')
  @ApiOperation({ summary: 'Get current stage info' })
  @ApiResponse({ status: 200, description: 'Stage information' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStageInfo(@Req() req: AuthenticatedRequest) {
    return this.studentsService.getStageInfo(req.user.id);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Submit application to a university' })
  @ApiBody({ type: SubmitApplicationFormDto })
  @ApiResponse({
    status: 201,
    description: 'Application submitted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or profile incomplete',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 409,
    description: 'Already applied or university unavailable',
  })
  async submitApplication(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SubmitApplicationFormDto,
  ) {
    return this.studentsService.submitApplication(req.user.id, dto);
  }

  @Get('applications')
  @ApiOperation({ summary: 'Get my applications' })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of student applications' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyApplications(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.studentsService.getMyApplications(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('applications/check/:universityId')
  @ApiOperation({ summary: 'Check if already applied to a university' })
  @ApiParam({ name: 'universityId', description: 'University ID' })
  @ApiResponse({ status: 200, description: 'Application check result' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkApplication(
    @Req() req: AuthenticatedRequest,
    @Param('universityId') universityId: string,
  ) {
    return this.studentsService.checkApplication(req.user.id, universityId);
  }

  @Get('applications/:id')
  @ApiOperation({ summary: 'Get my application by ID' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: 200, description: 'Application details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async getMyApplicationById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.studentsService.getMyApplicationById(req.user.id, id);
  }
}

@ApiTags('Admin Students')
@ApiBearerAuth()
@Controller('admin/students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminStudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'stage', required: false, type: String })
  @ApiQuery({ name: 'fields', required: false, type: String, description: 'Comma-separated fields to return. E.g. id,user.name,currentStage,neetScore' })
  @ApiResponse({ status: 200, description: 'List of students' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('stage') stage?: string,
    @Query('fields') fields?: string,
  ) {
    return this.studentsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      status,
      stage ? parseInt(stage) : undefined,
      fields,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get student statistics (Admin)' })
  @ApiResponse({ status: 200, description: 'Student statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStats() {
    return this.studentsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID (Admin)' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiQuery({ name: 'fields', required: false, type: String, description: 'Comma-separated fields to return. E.g. id,user.name,currentStage,documents' })
  @ApiResponse({ status: 200, description: 'Student details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findOne(@Param('id') id: string, @Query('fields') fields?: string) {
    return this.studentsService.findOne(id, fields);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update student (Admin)' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiBody({ type: AdminUpdateStudentDto })
  @ApiResponse({ status: 200, description: 'Student updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async update(@Param('id') id: string, @Body() dto: AdminUpdateStudentDto) {
    return this.studentsService.adminUpdate(id, dto);
  }

  @Put(':id/stage')
  @ApiOperation({ summary: 'Update student stage (Admin)' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Stage updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async updateStage(
    @Param('id') id: string,
    @Body('stage') stage: number,
    @Body('status') status?: string,
  ) {
    return this.studentsService.updateStage(id, stage, status);
  }

  @Post(':id/assign-university')
  @ApiOperation({ summary: 'Assign university to student (Admin)' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiBody({ type: AssignUniversityDto })
  @ApiResponse({ status: 201, description: 'University assigned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async assignUniversity(
    @Param('id') id: string,
    @Body() dto: AssignUniversityDto,
  ) {
    return this.studentsService.assignUniversity(id, dto);
  }
}
