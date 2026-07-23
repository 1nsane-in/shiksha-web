import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { env } from '../env.config';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  constructor(reflector: Reflector) {
    super({ throttlers: [] }, undefined as any, reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (env.isDev) return true;
    return super.canActivate(context);
  }

  protected async getTracker(req: Record<string, unknown>): Promise<string> {
    const expressReq = req as unknown as Request;
    const ipFromArray = expressReq.ips?.length ? expressReq.ips[0] : undefined;
    const ip: string = ipFromArray ?? expressReq.ip ?? 'unknown';
    return ip;
  }

  protected async getErrorMessage(): Promise<string> {
    return 'Too many requests. Please try again later.';
  }
}
