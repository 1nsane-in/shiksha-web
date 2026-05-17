import { Module, Global } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthController } from './health/health.controller';
import { DatabaseHealthIndicator } from './health/db.health';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyticsService } from './services/analytics.service';
import { ActivityLogService } from './services/activity-log.service';
import { AuditLogService } from './services/audit-log.service';
import { NotificationService } from './services/notification.service';
import { MetricsService } from './services/metrics.service';
import { SentryFilter } from './filters/sentry.filter';
import { DashboardController } from './controllers/dashboard.controller';
import { ActivityTrackingInterceptor } from './interceptors/activity-tracking.interceptor';
import { PaginatorService } from './services/paginator.service';

@Global()
@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController, DashboardController],
  providers: [
    DatabaseHealthIndicator,
    AnalyticsService,
    ActivityLogService,
    AuditLogService,
    NotificationService,
    MetricsService,
    PaginatorService,
    {
      provide: APP_FILTER,
      useClass: SentryFilter,
    },
  ],
  exports: [
    AnalyticsService,
    ActivityLogService,
    AuditLogService,
    NotificationService,
    MetricsService,
    PaginatorService,
  ],
})
export class CommonModule {}
