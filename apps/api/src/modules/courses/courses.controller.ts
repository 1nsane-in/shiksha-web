import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('Courses')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Course created successfully.',
  })
  @ApiOperation({ summary: 'Create a new course' })
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @Public()
  @ApiOkResponse({ description: 'List of courses' })
  @ApiOperation({ summary: 'Get all courses' })
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiResponse({ status: 200, description: 'Course found' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiOperation({ summary: 'Get a course by ID' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.coursesService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiResponse({ status: 200, description: 'Course updated' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiOperation({ summary: 'Update a course by ID' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiResponse({ status: 200, description: 'Course deleted' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiOperation({ summary: 'Delete a course by ID' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.coursesService.remove(id);
  }

  @Post(':id/publish')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiResponse({ status: 200, description: 'Course published' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiOperation({ summary: 'Publish a course by ID' })
  async publish(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.coursesService.publish(id);
  }
}
