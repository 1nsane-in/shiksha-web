import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
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
import { AuthUser } from '../auth/decorators/user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import {
  CreateInviteLinkDto,
  LinkByCodeDto,
  InviteLinkResponseDto,
  FamilyCodeResponseDto,
  MessageResponseDto,
} from './dto/parents.dto';

  @ApiTags('Parents')
@ApiBearerAuth()
@Controller('parents')
export class ParentsController {
  constructor(private parentsService: ParentsService) {}

  // ──────────────────────────────────────────────
  // Public endpoints
  // ──────────────────────────────────────────────

  @Public()
  @Get('invite/:code')
  @ApiOperation({ summary: 'Validate invite code and return invite details' })
  @ApiOkResponse({ description: 'Invite details' })
  @ApiResponse({ status: 404, description: 'Invite not found or expired' })
  async validateInviteCode(@Param('code') code: string) {
    return this.parentsService.validateInviteCode(code);
  }

  // ──────────────────────────────────────────────
  // Student endpoints
  // ──────────────────────────────────────────────

  @Post('invite-link')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate invite link for parent' })
  @ApiOkResponse({ type: InviteLinkResponseDto })
  @ApiResponse({ status: 400, description: 'Student profile not found' })
  async createInviteLink(
    @AuthUser('id') userId: string,
    @Body() dto: CreateInviteLinkDto,
  ) {
    return this.parentsService.createInviteLink(userId, dto);
  }

  @Get('family-code')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get current family code (auto-generates if null)' })
  @ApiOkResponse({ type: FamilyCodeResponseDto })
  async getFamilyCode(@AuthUser('id') userId: string) {
    return this.parentsService.getFamilyCode(userId);
  }

  @Post('regenerate-family-code')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Regenerate family code (old code invalidated)' })
  @ApiOkResponse({ type: FamilyCodeResponseDto })
  async regenerateFamilyCode(@AuthUser('id') userId: string) {
    return this.parentsService.regenerateFamilyCode(userId);
  }

  @Get('my-links')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  @ApiOperation({ summary: 'List all linked parents with status' })
  async getMyLinks(@AuthUser('id') userId: string) {
    return this.parentsService.getMyLinks(userId);
  }

  @Delete('link/:id')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a parent link' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Parent link not found' })
  async removeLink(
    @AuthUser('id') userId: string,
    @Param('id') linkId: string,
  ) {
    return this.parentsService.removeParentLink(userId, linkId);
  }

  // ──────────────────────────────────────────────
  // Parent endpoints
  // ──────────────────────────────────────────────

  @Post('link-by-code')
  @UseGuards(RolesGuard)
  @Roles('PARENT')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Link to student by family code (auto-APPROVED)' })
  @ApiResponse({ status: 400, description: 'Invalid code / already linked' })
  async linkByCode(
    @AuthUser('id') userId: string,
    @Body() dto: LinkByCodeDto,
  ) {
    return this.parentsService.linkByCode(userId, dto);
  }

  @Get('children')
  @UseGuards(RolesGuard)
  @Roles('PARENT')
  @ApiOperation({ summary: 'List linked children with progress summary' })
  async getChildren(@AuthUser('id') userId: string) {
    return this.parentsService.getChildren(userId);
  }
}
