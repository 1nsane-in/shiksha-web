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
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import {
  RegisterDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  CreateAdminDto,
  GoogleAuthDto,
  GoogleRegisterDto,
} from './auth.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax' | 'none',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  } as const;

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    res.cookie('refreshToken', result.refreshToken, this.COOKIE_OPTIONS);
    return { message: result.message, user: result.user, accessToken: result.accessToken };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    res.cookie('refreshToken', result.refreshToken, this.COOKIE_OPTIONS);
    return { message: result.message, user: result.user, accessToken: result.accessToken };
  }

  @Public()
  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() dto: GoogleAuthDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.googleLogin(dto);
    res.cookie('refreshToken', result.refreshToken, this.COOKIE_OPTIONS);
    return { message: result.message, user: result.user, accessToken: result.accessToken };
  }

  @Public()
  @Post('google-register')
  @HttpCode(HttpStatus.OK)
  async googleRegister(@Body() dto: GoogleRegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.googleRegister(dto);
    res.cookie('refreshToken', result.refreshToken, this.COOKIE_OPTIONS);
    return { message: result.message, user: result.user, accessToken: result.accessToken };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      return { statusCode: 401, message: 'No refresh token' };
    }
    const result = await this.authService.refreshTokens(oldRefreshToken);
    res.cookie('refreshToken', result.refreshToken, this.COOKIE_OPTIONS);
    return { message: result.message, accessToken: result.accessToken };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    res.clearCookie('refreshToken', { path: '/api/auth' });
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    return this.authService.getCurrentUser((req as any).user.id);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post('create-admin')
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.createAdmin(dto);
  }
}
