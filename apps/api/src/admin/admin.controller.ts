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
  Request,
  Patch,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  CreateAdminDto,
  UpdateAdminDto,
  ChangePasswordDto,
  ResetAdminPasswordDto,
  AdminQueryDto,
} from './admin.dto';

@Controller('admin/admins')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Get all admins (SUPER_ADMIN only)
  @Get()
  @Roles('SUPER_ADMIN')
  async findAll(@Query() query: AdminQueryDto) {
    return this.adminService.findAll(query);
  }

  // Get statistics (SUPER_ADMIN only)
  @Get('statistics')
  @Roles('SUPER_ADMIN')
  async getStatistics() {
    return this.adminService.getStatistics();
  }

  // Get single admin (SUPER_ADMIN only)
  @Get(':id')
  @Roles('SUPER_ADMIN')
  async findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  // Create new admin (SUPER_ADMIN only)
  @Post()
  @Roles('SUPER_ADMIN')
  async create(@Body() dto: CreateAdminDto, @Request() req) {
    return this.adminService.create(dto, req.user.id);
  }

  // Update admin (SUPER_ADMIN only)
  @Put(':id')
  @Roles('SUPER_ADMIN')
  async update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.adminService.update(id, dto);
  }

  // Delete admin (SUPER_ADMIN only)
  @Delete(':id')
  @Roles('SUPER_ADMIN')
  async delete(@Param('id') id: string, @Request() req) {
    return this.adminService.delete(id, req.user.id);
  }

  // Toggle admin status (SUPER_ADMIN only)
  @Patch(':id/toggle-status')
  @Roles('SUPER_ADMIN')
  async toggleStatus(@Param('id') id: string, @Request() req) {
    return this.adminService.toggleStatus(id, req.user.id);
  }

  // Change own password (ADMIN or SUPER_ADMIN)
  @Post('change-password')
  @Roles('ADMIN', 'SUPER_ADMIN')
  async changePassword(@Body() dto: ChangePasswordDto, @Request() req) {
    return this.adminService.changePassword(req.user.id, dto);
  }

  // Reset admin password (SUPER_ADMIN only)
  @Post(':id/reset-password')
  @Roles('SUPER_ADMIN')
  async resetPassword(
    @Param('id') id: string,
    @Body() dto: ResetAdminPasswordDto,
  ) {
    return this.adminService.resetPassword(id, dto);
  }

  // Get admin activity logs (SUPER_ADMIN only)
  @Get(':id/activity-logs')
  @Roles('SUPER_ADMIN')
  async getActivityLogs(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getActivityLogs(id, limit ? parseInt(limit) : 20);
  }
}
