import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import {
  CreateUniversityDto,
  UpdateUniversityDto,
  CreateCourseDto,
  UpdateCourseDto,
  UploadUniversityDocumentDto,
  UniversityQueryDto,
  UniversityStatus,
} from './universities.dto';

// Admin Controller - Full CRUD access
@Controller('admin/universities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminUniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  // Get all universities with filters
  @Get()
  async findAll(@Query() query: UniversityQueryDto) {
    return this.universitiesService.findAll(query);
  }

  // Get statistics
  @Get('statistics')
  async getStatistics() {
    return this.universitiesService.getStatistics();
  }

  // Get countries
  @Get('countries')
  async getCountries() {
    return this.universitiesService.getCountries();
  }

  // Get single university
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.universitiesService.findOne(id);
  }

  // Create new university
  @Post()
  async create(@Body() dto: CreateUniversityDto) {
    return this.universitiesService.create(dto);
  }

  // Update university
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUniversityDto) {
    return this.universitiesService.update(id, dto);
  }

  // Update university status
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: UniversityStatus,
  ) {
    return this.universitiesService.updateStatus(id, status);
  }

  // Delete university (soft delete)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.universitiesService.delete(id);
  }

  // Document management
  @Post(':id/documents')
  async uploadDocument(
    @Param('id') id: string,
    @Body() dto: UploadUniversityDocumentDto,
  ) {
    return this.universitiesService.uploadDocument(id, dto);
  }

  @Get(':id/documents')
  async getDocuments(@Param('id') id: string) {
    return this.universitiesService.getDocuments(id);
  }

  @Delete('documents/:documentId')
  async deleteDocument(@Param('documentId') documentId: string) {
    return this.universitiesService.deleteDocument(documentId);
  }

  // Course management
  @Post(':id/courses')
  async addCourse(@Param('id') id: string, @Body() dto: CreateCourseDto) {
    return this.universitiesService.addCourse(id, dto);
  }

  @Put('courses/:courseId')
  async updateCourse(
    @Param('courseId') courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.universitiesService.updateCourse(courseId, dto);
  }

  @Delete('courses/:courseId')
  async deleteCourse(@Param('courseId') courseId: string) {
    return this.universitiesService.deleteCourse(courseId);
  }
}

// Public Controller - Read-only access for students
@Controller('universities')
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  // Get all active universities
  @Public()
  @Get()
  async findAll(@Query() query: UniversityQueryDto) {
    // Force status to ACTIVE for public access
    const publicQuery = { ...query, status: UniversityStatus.ACTIVE };
    return this.universitiesService.findAll(publicQuery);
  }

  // Get countries
  @Public()
  @Get('countries')
  async getCountries() {
    return this.universitiesService.getCountries();
  }

  // Get single university by ID or slug
  @Public()
  @Get(':identifier')
  async findOne(@Param('identifier') identifier: string) {
    const university = await this.universitiesService.findOne(identifier);

    // Only return active universities to public
    if (university.status !== UniversityStatus.ACTIVE) {
      throw new Error('University not available');
    }

    return university;
  }
}
