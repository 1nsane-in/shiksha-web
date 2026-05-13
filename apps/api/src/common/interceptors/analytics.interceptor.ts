import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  constructor(private analyticsService: AnalyticsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const path = request.route?.path || request.url;
    const method = request.method;

    return next.handle().pipe(
      tap({
        next: () => {
          if (userId) {
            this.analyticsService.track({
              distinctId: userId,
              event: 'api_request',
              properties: {
                path,
                method,
                status: 'success',
              },
            });
          }
        },
        error: () => {
          if (userId) {
            this.analyticsService.track({
              distinctId: userId,
              event: 'api_request',
              properties: {
                path,
                method,
                status: 'error',
              },
            });
          }
        },
      }),
    );
  }
}
