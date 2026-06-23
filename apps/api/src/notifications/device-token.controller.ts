import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DeviceTokenService } from './device-token.service';
import { RegisterDeviceTokenDto } from './dto/device-token.dto';
import { AuthUser } from '../auth/decorators/user.decorator';
import type { AuthenticatedUser } from '../common/types/request.type';

@ApiTags('Device Tokens')
@ApiBearerAuth()
@Controller('device-tokens')
export class DeviceTokenController {
  constructor(private deviceTokenService: DeviceTokenService) {}

  @Post()
  @ApiOperation({ summary: 'Register device token for push notifications' })
  async register(
    @Body() dto: RegisterDeviceTokenDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.deviceTokenService.register(user.id, dto);
  }

  @Delete(':token')
  @ApiOperation({ summary: 'Unregister device token' })
  async unregister(
    @Param('token') token: string,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.deviceTokenService.unregister(user.id, token);
  }

  @Get()
  @ApiOperation({ summary: 'Get my device tokens' })
  async getMyTokens(@AuthUser() user: AuthenticatedUser) {
    return this.deviceTokenService.getUserTokens(user.id);
  }
}
