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
} from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  CreateUniversityDto,
  UpdateUniversityDto,
  CreateCourseDto,
  UpdateCourseDto,
} from './universities.dto';

@Controller('admin/universities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminUniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('country') country?: string,
  ) {
    return this.universitiesService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      country,
    );
  }

  @Get('countries')
  async getCountries() {
    return this.universitiesService.getCountries();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.universitiesService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateUniversityDto) {
    return this.universitiesService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUniversityDto) {
    return this.universitiesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.universitiesService.delete(id);
  }

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
  async deleteCourseCourse(@Param('courseId') courseId: string) {
    return this.universitiesService.deleteCourse(courseId);
  }
}

@Controller('universities')
@UseGuards(JwtAuthGuard)
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('country') country?: string,
  ) {
    return this.universitiesService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      country,
    );
  }

  @Get('countries')
  async getCountries() {
    return this.universitiesService.getCountries();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.universitiesService.findOne(id);
  }
}
