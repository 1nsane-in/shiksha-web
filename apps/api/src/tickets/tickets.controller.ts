import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import {
  CreateTicketDto,
  AddTicketMessageDto,
  UpdateTicketStatusDto,
  AssignTicketDto,
} from './dto/ticket.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthUser } from '../auth/decorators/user.decorator';
import type { AuthenticatedUser } from '../common/types/request.type';

@ApiTags('Support Tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a support ticket' })
  async create(
    @Body() dto: CreateTicketDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.ticketsService.createTicket(user.id, user.role, null, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my tickets (Student)' })
  async getMy(@AuthUser() user: AuthenticatedUser) {
    return this.ticketsService.getMyTickets(user.id);
  }

  @Get('application/:applicationId')
  @ApiOperation({ summary: 'Get tickets for an application' })
  async getByApplication(
    @Param('applicationId') applicationId: string,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.ticketsService.getApplicationTickets(
      applicationId,
      user.id,
      user.role,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  async getById(@Param('id') id: string, @AuthUser() user: AuthenticatedUser) {
    return this.ticketsService.getTicketById(id, user.id, user.role);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Add message to ticket' })
  async addMessage(
    @Param('id') id: string,
    @Body() dto: AddTicketMessageDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.ticketsService.addMessage(id, user.id, user.role, null, dto);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update ticket status (Admin)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    return this.ticketsService.updateStatus(id, dto, 'ADMIN');
  }

  @Patch(':id/assign')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Assign ticket to admin (Admin)' })
  async assign(@Param('id') id: string, @Body() dto: AssignTicketDto) {
    return this.ticketsService.assignTicket(id, dto);
  }

  @Get('admin/all')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all tickets (Admin)' })
  async getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.ticketsService.getAllTickets(
      Number(page) || 1,
      Number(limit) || 20,
    );
  }
}
