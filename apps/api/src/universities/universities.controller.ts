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
  NotFoundException,
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

// Admin Controller - Full CRUD access
@ApiTags('Admin Universities')
@ApiBearerAuth()
@Controller('admin/universities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminUniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all universities (Admin)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    type: String,
    description: 'Filter by country',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: UniversityStatus,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Filter by university type',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name or short name',
  })
  @ApiResponse({
    status: 200,
    description: 'List of universities with pagination',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires ADMIN or SUPER_ADMIN role',
  })
  async findAll(@Query() query: UniversityQueryDto) {
    return this.universitiesService.findAllAdmin(query);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get university statistics (Admin)' })
  @ApiResponse({ status: 200, description: 'University statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics() {
    return this.universitiesService.getStatistics();
  }

  @Get('countries')
  @ApiOperation({ summary: 'Get all countries with universities (Admin)' })
  @ApiResponse({ status: 200, description: 'List of countries' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getCountries() {
    return this.universitiesService.getCountries();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get university details by ID (Admin)' })
  @ApiParam({ name: 'id', description: 'University ID or slug' })
  @ApiResponse({
    status: 200,
    description: 'University details with all relations',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'University not found' })
  async findOne(@Param('id') id: string) {
    return this.universitiesService.findOneAdmin(id);
  }

  // Create new university
  @Post()
  @ApiOperation({ summary: 'Create a new university (Admin)' })
  @ApiResponse({ status: 201, description: 'University created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'University already exists' })
  async create(@Body() dto: CreateUniversityDto) {
    return this.universitiesService.create(dto);
  }

  // Update university
  @Put(':id')
  @ApiOperation({ summary: 'Update university (Admin)' })
  @ApiParam({ name: 'id', description: 'University ID' })
  @ApiResponse({ status: 200, description: 'University updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'University not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateUniversityDto) {
    return this.universitiesService.update(id, dto);
  }

  // Update university status
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update university status (Admin)' })
  @ApiParam({ name: 'id', description: 'University ID' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'University not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: UniversityStatus,
  ) {
    return this.universitiesService.updateStatus(id, status);
  }

  // Delete university (soft delete)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete university (Admin)' })
  @ApiParam({ name: 'id', description: 'University ID' })
  @ApiResponse({ status: 200, description: 'University deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'University not found' })
  async delete(@Param('id') id: string) {
    return this.universitiesService.delete(id);
  }

  // Document management
  @Post(':id/documents')
  @ApiOperation({ summary: 'Upload university document (Admin)' })
  @ApiParam({ name: 'id', description: 'University ID' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'University not found' })
  async uploadDocument(
    @Param('id') id: string,
    @Body() dto: UploadUniversityDocumentDto,
  ) {
    return this.universitiesService.uploadDocument(id, dto);
  }

  @Get(':id/documents')
  @ApiOperation({ summary: 'Get university documents (Admin)' })
  @ApiParam({ name: 'id', description: 'University ID' })
  @ApiResponse({ status: 200, description: 'List of documents' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getDocuments(@Param('id') id: string) {
    return this.universitiesService.getDocuments(id);
  }

  @Delete('documents/:documentId')
  @ApiOperation({ summary: 'Delete university document (Admin)' })
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteDocument(@Param('documentId') documentId: string) {
    return this.universitiesService.deleteDocument(documentId);
  }

  // Course management
  @Post(':id/courses')
  @ApiOperation({ summary: 'Add course to university (Admin)' })
  @ApiParam({ name: 'id', description: 'University ID' })
  @ApiResponse({ status: 201, description: 'Course added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'University not found' })
  async addCourse(@Param('id') id: string, @Body() dto: CreateCourseDto) {
    return this.universitiesService.addCourse(id, dto);
  }

  @Put('courses/:courseId')
  @ApiOperation({ summary: 'Update university course (Admin)' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async updateCourse(
    @Param('courseId') courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.universitiesService.updateCourse(courseId, dto);
  }

  @Delete('courses/:courseId')
  @ApiOperation({ summary: 'Delete university course (Admin)' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteCourse(@Param('courseId') courseId: string) {
    return this.universitiesService.deleteCourse(courseId);
  }
}

// Public Controller - Read-only access for students
@ApiTags('Universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active universities (Public)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    type: String,
    description: 'Filter by country',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Filter by university type',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name or short name',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active universities with pagination',
  })
  async findAll(@Query() query: UniversityQueryDto) {
    const publicQuery = { ...query, status: UniversityStatus.ACTIVE };
    return this.universitiesService.findAll(publicQuery);
  }

  @Public()
  @Get('countries')
  @ApiOperation({ summary: 'Get countries with active universities (Public)' })
  @ApiResponse({ status: 200, description: 'List of countries' })
  async getCountries() {
    return this.universitiesService.getCountries();
  }

  @Get(':identifier/brochure')
  @ApiOperation({ summary: 'Get signed brochure download URL (Authenticated)' })
  @ApiParam({ name: 'identifier', description: 'University ID or slug' })
  @ApiResponse({ status: 200, description: 'Signed brochure URL' })
  @ApiResponse({ status: 404, description: 'University or brochure not found' })
  async getBrochureUrl(@Param('identifier') identifier: string) {
    return this.universitiesService.getSignedBrochureUrl(identifier);
  }

  @Public()
  @Get(':identifier')
  @ApiOperation({ summary: 'Get university details by ID or slug (Public)' })
  @ApiParam({ name: 'identifier', description: 'University ID or slug' })
  @ApiResponse({ status: 200, description: 'University details' })
  @ApiResponse({
    status: 404,
    description: 'University not found or not active',
  })
  async findOne(@Param('identifier') identifier: string) {
    const university = await this.universitiesService.findOne(identifier);
    if (university.status !== UniversityStatus.ACTIVE) {
      throw new NotFoundException('University not found');
    }
    return university;
  }
}
