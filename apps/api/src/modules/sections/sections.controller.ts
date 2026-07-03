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
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('Sections')
@ApiBearerAuth()
@Controller('sections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Section created successfully.',
  })
  @ApiOperation({ summary: 'Create a new section' })
  async create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.create(createSectionDto);
  }

  @Get()
  @Public()
  @ApiOkResponse({ description: 'List of sections' })
  @ApiOperation({ summary: 'Get all sections' })
  async findAll() {
    return this.sectionsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiResponse({ status: 200, description: 'Section found' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  @ApiOperation({ summary: 'Get a section by ID' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sectionsService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiResponse({ status: 200, description: 'Section updated' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  @ApiOperation({ summary: 'Update a section by ID' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiResponse({ status: 200, description: 'Section deleted' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  @ApiOperation({ summary: 'Delete a section by ID' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sectionsService.remove(id);
  }
}
