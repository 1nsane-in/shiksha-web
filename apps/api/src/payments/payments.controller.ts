import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import {
  InitiatePayUPaymentDto,
  VerifyPayUPaymentDto,
  ManualPaymentApprovalDto,
} from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthUser } from '../auth/decorators/user.decorator';
import type { AuthenticatedUser } from '../common/types/request.type';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // --- Student endpoints ---

  @Post('initiate')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Initiate PayU payment for a stage' })
  async initiate(
    @Body() dto: InitiatePayUPaymentDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.initiatePayment(user.id, dto);
  }

  @Public()
  @Post('verify')
  @ApiOperation({ summary: 'Verify PayU payment response' })
  async verify(@Body() dto: VerifyPayUPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }

  @Get('history')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get payment history' })
  @ApiQuery({ name: 'fields', required: false, type: String, description: 'Comma-separated fields. E.g. id,amount,status,stage,paidAt' })
  async getHistory(
    @AuthUser() user: AuthenticatedUser,
    @Query('applicationId') applicationId?: string,
    @Query('fields') fields?: string,
  ) {
    return this.paymentsService.getPaymentHistory(user.id, applicationId, fields);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get payment stage configuration' })
  getConfig() {
    return this.paymentsService.getStageConfig();
  }

  // --- Single payment detail ---

  @Get(':id')
  @Roles('STUDENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiQuery({ name: 'fields', required: false, type: String, description: 'Comma-separated fields. E.g. id,amount,status,stage' })
  async getPayment(
    @Param('id') id: string,
    @AuthUser() user: AuthenticatedUser,
    @Query('fields') fields?: string,
  ) {
    return this.paymentsService.getPaymentById(id, user.id, user.role, fields);
  }

  // --- Admin endpoints ---

  @Post('manual-approve')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Manually approve a payment (Admin)' })
  async manualApprove(
    @Body() dto: ManualPaymentApprovalDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.manualApprove(user.id, dto);
  }

  @Get('admin/pending')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all pending payments (Admin)' })
  @ApiQuery({ name: 'fields', required: false, type: String, description: 'Comma-separated fields. E.g. id,amount,student.user.name' })
  async getPending(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('fields') fields?: string,
  ) {
    return this.paymentsService.getPendingPayments(
      Number(page) || 1,
      Number(limit) || 20,
      fields,
    );
  }
}
