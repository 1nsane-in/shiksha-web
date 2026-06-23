import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './db.health';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dbHealth: DatabaseHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  async check() {
    return this.health.check([() => this.dbHealth.isHealthy('database')]);
  }
}
