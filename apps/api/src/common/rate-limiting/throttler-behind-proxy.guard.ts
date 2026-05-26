import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, unknown>): Promise<string> {
    const expressReq = req as unknown as Request;
    const ip = expressReq.ips?.length
      ? expressReq.ips[0]
      : expressReq.ip || 'unknown';
    return ip;
  }

  protected async getErrorMessage(): Promise<string> {
    return 'Too many requests. Please try again later.';
  }
}
