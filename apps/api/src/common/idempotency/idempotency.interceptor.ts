import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';

export const IDEMPOTENT_KEY = 'idempotent';
export const Idempotent = () => Reflect.metadata(IDEMPOTENT_KEY, true);

interface IdempotencyRecord {
  statusCode: number;
  body: unknown;
  requestHash: string;
  createdAt: number;
}

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name);
  private readonly store = new Map<string, IdempotencyRecord>();
  private readonly TTL = 24 * 60 * 60 * 1000;
  private readonly HEADER = 'Idempotency-Key';

  constructor(private readonly reflector: Reflector) {
    this.startCleanup();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isIdempotent = this.reflector.getAllAndOverride<boolean>(
      IDEMPOTENT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isIdempotent) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const key = req.headers[this.HEADER] as string | undefined;

    if (!key) {
      return next.handle();
    }

    const requestHash = this.hashRequest(req);
    const existing = this.store.get(key);

    if (existing) {
      if (existing.requestHash !== requestHash) {
        throw new ConflictException(
          `Idempotency key "${key}" was used with a different request payload`,
        );
      }

      this.logger.debug(`Idempotency hit: ${req.method} ${req.url} key=${key}`);
      res.statusCode = existing.statusCode;

      const body =
        typeof existing.body === 'object' && existing.body !== null
          ? existing.body
          : { data: existing.body };

      return of(body);
    }

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          this.store.set(key, {
            statusCode: res.statusCode,
            body: data,
            requestHash,
            createdAt: Date.now(),
          });
        },
      }),
    );
  }

  private hashRequest(req: Request): string {
    const parts = [
      req.method,
      req.originalUrl || req.url,
      JSON.stringify(req.body || {}),
    ];
    let hash = 0;
    const str = parts.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return String(hash);
  }

  private startCleanup() {
    setInterval(
      () => {
        const now = Date.now();
        for (const [key, record] of this.store.entries()) {
          if (now - record.createdAt > this.TTL) {
            this.store.delete(key);
          }
        }
      },
      60 * 60 * 1000,
    );
  }
}
