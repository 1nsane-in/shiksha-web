import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from '@prisma/client';

@ApiTags('Sections')
@ApiBearerAuth()
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Section created successfully.', type: Section })
  @ApiOperation({ summary: 'Create a new section' })
  async create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.create(createSectionDto);
  }

  @Get()
  @ApiOkResponse({ description: 'List of sections', type: [Section] })
  @ApiOperation({ summary: 'Get all sections' })
  async findAll() {
    return this.sectionsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Section found', type: Section })
  @ApiResponse({ status: 404, description: 'Section not found' })
  @ApiOperation({ summary: 'Get a section by ID' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sectionsService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Section updated', type: Section })
  @ApiResponse({ status: 404, description: 'Section not found' })
  @ApiOperation({ summary: 'Update a section by ID' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Section deleted' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  @ApiOperation({ summary: 'Delete a section by ID' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sectionsService.remove(id);
  }
}