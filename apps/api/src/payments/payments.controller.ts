import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePayUPaymentDto, VerifyPayUPaymentDto, ManualPaymentApprovalDto } from './dto/payment.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthUser } from '../auth/decorators/user.decorator';
import type { AuthenticatedUser } from '../common/types/request.type';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // --- Student endpoints ---

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate PayU payment for a stage' })
  async initiate(@Body() dto: InitiatePayUPaymentDto, @AuthUser() user: AuthenticatedUser) {
    return this.paymentsService.initiatePayment(user.id, dto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify PayU payment response' })
  async verify(@Body() dto: VerifyPayUPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payment history' })
  async getHistory(@AuthUser() user: AuthenticatedUser, @Query('applicationId') applicationId?: string) {
    return this.paymentsService.getPaymentHistory(user.id, applicationId);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get payment stage configuration' })
  getConfig() {
    return this.paymentsService.getStageConfig();
  }

  // --- Single payment detail ---

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  async getPayment(@Param('id') id: string, @AuthUser() user: AuthenticatedUser) {
    return this.paymentsService.getPaymentById(id, user.id, user.role);
  }

  // --- Admin endpoints ---

  @Post('manual-approve')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Manually approve a payment (Admin)' })
  async manualApprove(@Body() dto: ManualPaymentApprovalDto, @AuthUser() user: AuthenticatedUser) {
    return this.paymentsService.manualApprove(user.id, dto);
  }

  @Get('admin/pending')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all pending payments (Admin)' })
  async getPending(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.paymentsService.getPendingPayments(Number(page) || 1, Number(limit) || 20);
  }
}