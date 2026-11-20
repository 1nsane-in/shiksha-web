import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { env } from '../../common/env.config';

/**
 * CSRF defense for cookie-based auth routes. Browsers always send Origin on
 * cross-site POSTs; non-browser clients (mobile/curl) cannot be CSRF'd.
 */
@Injectable()
export class CookieOriginGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const origin = req.headers.origin;
    if (!origin) return true;

    const allowed = (this.config.get<string>('FRONTEND_URL') ?? '')
      .split(',')
      .map((url) => url.trim().replace(/\/$/, ''))
      .filter(Boolean);
    if (env.isDev || allowed.length === 0) {
      allowed.push(env.LOCALHOST, env.LOCALHOST_ALT);
    }

    if (allowed.includes(origin.replace(/\/$/, ''))) return true;
    throw new ForbiddenException('Origin not allowed');
  }
}
