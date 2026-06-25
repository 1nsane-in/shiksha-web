import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Admin Applications')
@ApiBearerAuth()
@Controller('admin/applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all applications (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'fields', required: false, type: String, description: 'Comma-separated fields. E.g. id,firstName,lastName,university.name,student.user.name' })
  @ApiResponse({ status: 200, description: 'List of applications' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('fields') fields?: string,
  ) {
    return this.applicationsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      status,
      search,
      fields,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application by ID (Admin)' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiQuery({ name: 'fields', required: false, type: String, description: 'Comma-separated fields. E.g. id,status,university.name,student.user.name' })
  @ApiResponse({ status: 200, description: 'Application details' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async findOne(@Param('id') id: string, @Query('fields') fields?: string) {
    return this.applicationsService.findOne(id, fields);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update application status (Admin)' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: 200, description: 'Application status updated' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.applicationsService.updateStatus(id, status);
  }
}
