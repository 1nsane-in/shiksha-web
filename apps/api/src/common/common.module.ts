import { Module, Global } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthController } from './health/health.controller';
import { DatabaseHealthIndicator } from './health/db.health';
import { RedisHealthIndicator } from './health/redis.health';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyticsService } from './services/analytics.service';
import { ActivityLogService } from './services/activity-log.service';
import { AuditLogService } from './services/audit-log.service';
import { NotificationService } from './services/notification.service';
import { MetricsService } from './services/metrics.service';
import { EmailValidationService } from './services/email-validation.service';
import { EmailService } from './services/email.service';
import { SentryFilter } from './filters/sentry.filter';
import { DashboardController } from './controllers/dashboard.controller';
import { UploadController } from './controllers/upload.controller';
import { ActivityTrackingInterceptor } from './interceptors/activity-tracking.interceptor';
import { ResponseWrapperInterceptor } from './interceptors/response-wrapper.interceptor';
import { IdempotencyInterceptor } from './idempotency/idempotency.interceptor';
import { PaginatorService } from './services/paginator.service';
import { TimelineService } from './services/timeline.service';
import { StorageService } from './services/storage.service';

@Global()
@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController, DashboardController, UploadController],
  providers: [
    DatabaseHealthIndicator,
    RedisHealthIndicator,
    AnalyticsService,
    ActivityLogService,
    AuditLogService,
    NotificationService,
    MetricsService,
    EmailValidationService,
    EmailService,
    PaginatorService,
    TimelineService,
    StorageService,
    {
      provide: APP_FILTER,
      useClass: SentryFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseWrapperInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityTrackingInterceptor,
    },
  ],
  exports: [
    AnalyticsService,
    ActivityLogService,
    AuditLogService,
    NotificationService,
    MetricsService,
    EmailValidationService,
    EmailService,
    PaginatorService,
    TimelineService,
    StorageService,
  ],
})
export class CommonModule {}
