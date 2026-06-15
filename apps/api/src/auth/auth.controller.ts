import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request as Req,
  HttpCode,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import {
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  CompleteRegistrationDto,
  CreateAdminDto,
  GoogleAuthDto,
  GoogleRegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshDto,
  LogoutDto,
  AuthResponseDto,
  MessageResponseDto,
  VerifyOtpResponseDto,
  RefreshResponseDto,
  LogoutResponseDto,
  UserResponseDto,
  CreateAdminResponseDto,
} from './auth.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
    path: '/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  } as const;

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP for registration' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid email / Email already registered / Failed to send OTP email' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and get registration token' })
  @ApiOkResponse({ type: VerifyOtpResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  private buildCookieResponse(res: Response, refreshToken: string, mobile: boolean) {
    if (!mobile) {
      res.cookie('refreshToken', refreshToken, this.COOKIE_OPTIONS);
    }
  }

  @Public()
  @Post('complete-registration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete registration after OTP verification' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid/expired token / Email already registered' })
  @ApiQuery({ name: 'mobile', required: false, description: 'Set to "true" to return refreshToken in body' })
  async completeRegistration(
    @Body() dto: CompleteRegistrationDto,
    @Res({ passthrough: true }) res: Response,
    @Query('mobile') mobile?: string,
  ) {
    const isMobile = mobile === 'true';
    const result = await this.authService.completeRegistration(dto);
    this.buildCookieResponse(res, result.refreshToken, isMobile);
    return { message: result.message, user: result.user, accessToken: result.accessToken, ...(isMobile ? { refreshToken: result.refreshToken } : {}) };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials / Account deactivated' })
  @ApiQuery({ name: 'mobile', required: false, description: 'Set to "true" to return refreshToken in body' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Query('mobile') mobile?: string,
  ) {
    const isMobile = mobile === 'true';
    const result = await this.authService.login(dto);
    this.buildCookieResponse(res, result.refreshToken, isMobile);
    return { message: result.message, user: result.user, accessToken: result.accessToken, ...(isMobile ? { refreshToken: result.refreshToken } : {}) };
  }

  @Public()
  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login/auto-register with Google' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  @ApiQuery({ name: 'mobile', required: false, description: 'Set to "true" to return refreshToken in body' })
  async googleLogin(
    @Body() dto: GoogleAuthDto,
    @Res({ passthrough: true }) res: Response,
    @Query('mobile') mobile?: string,
  ) {
    const isMobile = mobile === 'true';
    const result = await this.authService.googleLogin(dto);
    this.buildCookieResponse(res, result.refreshToken, isMobile);
    return { message: result.message, user: result.user, accessToken: result.accessToken, ...(isMobile ? { refreshToken: result.refreshToken } : {}) };
  }

  @Public()
  @Post('google-register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register with Google (explicit, no auto-login)' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'User already registered with this email' })
  @ApiQuery({ name: 'mobile', required: false, description: 'Set to "true" to return refreshToken in body' })
  async googleRegister(
    @Body() dto: GoogleRegisterDto,
    @Res({ passthrough: true }) res: Response,
    @Query('mobile') mobile?: string,
  ) {
    const isMobile = mobile === 'true';
    const result = await this.authService.googleRegister(dto);
    this.buildCookieResponse(res, result.refreshToken, isMobile);
    return { message: result.message, user: result.user, accessToken: result.accessToken, ...(isMobile ? { refreshToken: result.refreshToken } : {}) };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ type: RefreshResponseDto })
  @ApiResponse({ status: 401, description: 'No refresh token / Invalid or expired refresh token / Account deactivated' })
  @ApiQuery({ name: 'mobile', required: false, description: 'Set to "true" to send refreshToken in body instead of cookie' })
  async refresh(
    @Req() req: Request,
    @Body() dto: RefreshDto,
    @Res({ passthrough: true }) res: Response,
    @Query('mobile') mobile?: string,
  ) {
    const isMobile = mobile === 'true';
    const oldRefreshToken = isMobile ? dto.refreshToken : req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      return { statusCode: 401, message: 'No refresh token' };
    }
    const result = await this.authService.refreshTokens(oldRefreshToken);
    this.buildCookieResponse(res, result.refreshToken, isMobile);
    return { message: result.message, accessToken: result.accessToken, ...(isMobile ? { refreshToken: result.refreshToken } : {}) };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiOkResponse({ type: LogoutResponseDto })
  @ApiQuery({ name: 'mobile', required: false, description: 'Set to "true" to send refreshToken in body instead of cookie' })
  async logout(
    @Req() req: Request,
    @Body() dto: LogoutDto,
    @Res({ passthrough: true }) res: Response,
    @Query('mobile') mobile?: string,
  ) {
    const isMobile = mobile === 'true';
    const refreshToken = isMobile ? dto.refreshToken : req.cookies?.refreshToken;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    res.clearCookie('refreshToken', {
      path: this.COOKIE_OPTIONS.path,
      httpOnly: this.COOKIE_OPTIONS.httpOnly,
      secure: this.COOKIE_OPTIONS.secure,
      sameSite: this.COOKIE_OPTIONS.sameSite,
    });
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getCurrentUser(@Req() req: Request) {
    return this.authService.getCurrentUser((req as any).user.id);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send password reset OTP' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'No account found with this email / Failed to send OTP email' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with OTP token' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post('create-admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create admin user (SUPER_ADMIN only)' })
  @ApiOkResponse({ type: CreateAdminResponseDto })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden — SUPER_ADMIN role required' })
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.createAdmin(dto);
  }
}
