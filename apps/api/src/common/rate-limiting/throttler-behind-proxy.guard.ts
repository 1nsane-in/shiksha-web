import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  constructor(private readonly config: ConfigService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip throttling in development mode
    const nodeEnv = this.config.get<string>('NODE_ENV');
    if (nodeEnv === 'development' || nodeEnv === 'dev') {
      return true;
    }
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
