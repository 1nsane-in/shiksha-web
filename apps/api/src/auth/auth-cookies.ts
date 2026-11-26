import type { CookieOptions, Response } from 'express';
import type { ConfigService } from '@nestjs/config';

const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000; // matches JWT access TTL
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const isProd = (config: ConfigService) =>
  config.get('NODE_ENV') === 'production';

export function refreshCookieOptions(config: ConfigService): CookieOptions {
  return {
    httpOnly: true,
    secure: isProd(config),
    sameSite: isProd(config) ? 'none' : 'lax',
    path: '/auth',
    maxAge: REFRESH_COOKIE_MAX_AGE,
  };
}

export function accessCookieOptions(config: ConfigService): CookieOptions {
  return {
    httpOnly: true,
    secure: isProd(config),
    sameSite: isProd(config) ? 'none' : 'lax',
    path: '/',
    maxAge: ACCESS_COOKIE_MAX_AGE,
  };
}

/** Sets the httpOnly access + refresh cookies used by the web client. */
export function setAuthCookies(
  res: Response,
  config: ConfigService,
  tokens: { accessToken?: string; refreshToken: string },
): void {
  res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions(config));
  if (tokens.accessToken) {
    res.cookie('accessToken', tokens.accessToken, accessCookieOptions(config));
  }
}

export function clearAuthCookies(res: Response, config: ConfigService): void {
  res.clearCookie('refreshToken', refreshCookieOptions(config));
  res.clearCookie('accessToken', accessCookieOptions(config));
}
