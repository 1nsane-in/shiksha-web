import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLogService } from '../services/activity-log.service';
import { AnalyticsService } from '../services/analytics.service';

@Injectable()
export class ActivityTrackingInterceptor implements NestInterceptor {
  constructor(
    private activityLogService: ActivityLogService,
    private analyticsService: AnalyticsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const userId = request.user?.id;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logActivity(context, request, response, userId, duration, 'success');
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logActivity(context, request, response, userId, duration, 'error');
        },
      }),
    );
  }

  private async logActivity(
    context: ExecutionContext,
    request: any,
    response: any,
    userId: string | undefined,
    duration: number,
    status: string,
  ) {
    if (!userId) return;

    const handler = context.getHandler();
    const controller = context.getClass();
    const action = `${controller.name}.${handler.name}`;

    await this.activityLogService.logActivity({
      userId,
      action,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      metadata: {
        method: request.method,
        path: request.url,
        status,
        duration,
        statusCode: response.statusCode,
      },
    });

    await this.analyticsService.track({
      distinctId: userId,
      event: 'api_request',
      properties: {
        action,
        method: request.method,
        status,
        duration,
      },
    });
  }
}
