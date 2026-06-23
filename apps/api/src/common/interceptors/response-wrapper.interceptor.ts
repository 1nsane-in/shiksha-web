import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

export const SKIP_WRAPPER_KEY = 'skip_wrapper';
export const SkipWrapper = () => Reflect.metadata(SKIP_WRAPPER_KEY, true);

interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function isPaginated(
  value: unknown,
): value is { data: unknown[]; meta: PaginatedMeta } {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return Array.isArray(obj.data) && obj.meta !== undefined;
}

@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_WRAPPER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        if (data === undefined || data === null) {
          return { ok: true, data: null };
        }

        if (isPaginated(data)) {
          return { ok: true, data: data.data, meta: data.meta };
        }

        return { ok: true, data };
      }),
    );
  }
}
