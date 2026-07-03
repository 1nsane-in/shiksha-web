import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateProfileDto, UpdateUserByAdminDto } from './users.dto';
import type { AuthenticatedRequest } from '../common/types/request.type';
import { ApiQuery } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    description:
      'Comma-separated fields. E.g. id,name,email,student.currentStage',
  })
  async getProfile(
    @Request() req: AuthenticatedRequest,
    @Query('fields') fields?: string,
  ): Promise<unknown> {
    return this.usersService.getProfile(req.user.id, fields);
  }

  @Put('profile')
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ): Promise<unknown> {
    return this.usersService.updateProfile(req.user.id, dto);
  }
}

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminUsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    description:
      'Comma-separated fields. E.g. id,name,email,role,student.currentStage',
  })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: string,
    @Query('fields') fields?: string,
  ) {
    return this.usersService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      role,
      fields,
    );
  }

  @Get(':id')
  @ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    description:
      'Comma-separated fields. E.g. id,name,email,student.currentStage',
  })
  async findOne(
    @Param('id') id: string,
    @Query('fields') fields?: string,
  ): Promise<unknown> {
    return this.usersService.findOne(id, fields);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserByAdminDto,
  ): Promise<unknown> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  async deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Put(':id/activate')
  async activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }
}
