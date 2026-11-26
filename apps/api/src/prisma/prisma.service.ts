import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import type { PoolConfig } from '@neondatabase/serverless';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('PrismaService');

  constructor(config: ConfigService) {
    const connectionString = config.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    const poolConfig: PoolConfig = { connectionString };
    const adapter = new PrismaNeon(poolConfig);
    super({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });

    // Log slow queries. SLOW_QUERY_MS enables it in any environment
    // (staging load tests); development defaults to 1000ms, elsewhere off.
    const isDev = config.get('NODE_ENV') === 'development';
    const slowQueryMs = Number(
      process.env.SLOW_QUERY_MS ?? (isDev ? 1000 : 0),
    );
    if (slowQueryMs > 0) {
      this.$on('query', (e: Prisma.QueryEvent) => {
        if (e.duration >= slowQueryMs) {
          this.logger.warn(
            `SLOW SQL ${e.duration}ms ${e.query.slice(0, 200)} params=${e.params.slice(0, 200)}`,
          );
        }
      });
    }

    // Log errors
    this.$on('error', (e: Prisma.LogEvent) => {
      this.logger.error(`Prisma Error: ${e.message}`);
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected');
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Prisma health check failed', error);
      return false;
    }
  }
}
