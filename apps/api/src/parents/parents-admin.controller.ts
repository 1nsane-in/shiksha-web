import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { ParentsService } from './parents.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  AdminCreateParentLinkDto,
  AdminUpdateParentLinkStatusDto,
  AdminParentLinksQueryDto,
  MessageResponseDto,
} from './dto/parents.dto';

@ApiTags('Admin Parent Links')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/parent-links')
export class ParentsAdminController {
  constructor(private parentsService: ParentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all ParentStudent links (paginated, filterable)' })
  async findAll(@Query() query: AdminParentLinksQueryDto) {
    return this.parentsService.adminFindAll(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new parent-student link (auto-APPROVED)' })
  @ApiResponse({ status: 400, description: 'Parent/Student not found or link exists' })
  async create(@Body() dto: AdminCreateParentLinkDto) {
    return this.parentsService.adminCreateLink(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update parent link status (APPROVE or REJECT)' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: AdminUpdateParentLinkStatusDto,
  ) {
    return this.parentsService.adminUpdateLinkStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a parent-student link' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async remove(@Param('id') id: string) {
    return this.parentsService.adminDeleteLink(id);
  }
}
