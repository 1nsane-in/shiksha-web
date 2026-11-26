import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { ParentsService } from './parents.service';
import { setAuthCookies } from '../auth/auth-cookies';
import { Public } from '../auth/decorators/public.decorator';
import {
  ParentSendEmailOtpDto,
  ParentSendPhoneOtpDto,
  ParentVerifyEmailOtpDto,
  ParentVerifyPhoneOtpDto,
  ParentRegisterDto,
} from './dto/parents.dto';

@ApiTags('Parent Auth')
@Controller('auth')
export class ParentsAuthController {
  constructor(
    private parentsService: ParentsService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('parent-send-email-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to parent email' })
  @ApiOkResponse({ description: 'OTP sent to email' })
  @ApiResponse({ status: 400, description: 'Failed to send OTP' })
  async sendEmailOtp(@Body() dto: ParentSendEmailOtpDto) {
    return this.parentsService.sendEmailOtp(dto);
  }

  @Public()
  @Post('parent-send-phone-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to parent phone' })
  @ApiOkResponse({ description: 'OTP sent to phone' })
  async sendPhoneOtp(@Body() dto: ParentSendPhoneOtpDto) {
    return this.parentsService.sendPhoneOtp(dto);
  }

  @Public()
  @Post('parent-verify-email-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify parent email OTP' })
  @ApiOkResponse({ description: 'Email OTP verified' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyEmailOtp(@Body() dto: ParentVerifyEmailOtpDto) {
    return this.parentsService.verifyEmailOtp(dto);
  }

  @Public()
  @Post('parent-verify-phone-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify parent phone OTP' })
  @ApiOkResponse({ description: 'Phone OTP verified' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyPhoneOtp(@Body() dto: ParentVerifyPhoneOtpDto) {
    return this.parentsService.verifyPhoneOtp(dto);
  }

  @Public()
  @Post('parent-register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Register parent with invite code. Creates user+parent, links to student if invite valid.',
  })
  @ApiOkResponse({ description: 'Parent registration successful' })
  @ApiResponse({ status: 400, description: 'Validation error / Email already registered' })
  async parentRegister(
    @Body() dto: ParentRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.parentsService.parentRegister(dto);
    // Same httpOnly cookie contract as AuthController: web clients never see
    // the access token in JS.
    if (result.refreshToken) {
      setAuthCookies(res, this.configService, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    }
    return result;
  }
}
