import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthController } from './health/health.controller';
import { DatabaseHealthIndicator } from './health/db.health';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyticsService } from './services/analytics.service';
import { SentryFilter } from './filters/sentry.filter';
import { DashboardController } from './controllers/dashboard.controller';

@Module({
  imports: [
    TerminusModule,
    PrismaModule,
  ],
  controllers: [
    HealthController,
    DashboardController,
  ],
  providers: [
    DatabaseHealthIndicator,
    AnalyticsService,
    {
      provide: APP_FILTER,
      useClass: SentryFilter,
    },
  ],
  exports: [AnalyticsService],
})
export class CommonModule {}
