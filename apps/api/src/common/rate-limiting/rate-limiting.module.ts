import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './throttler-behind-proxy.guard';
import { RedisThrottlerStorage } from './redis-throttler-storage';
import { RedisModule } from '../../redis/redis.module';
import { RedisService } from '../../redis/redis.service';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redis: RedisService) => ({
        throttlers: [
          {
            name: 'short',
            ttl: 1000,
            limit: 3,
          },
          {
            name: 'auth',
            ttl: 60000,
            limit: 5,
          },
          {
            name: 'general',
            ttl: 60000,
            limit: 30,
          },
          {
            name: 'admin',
            ttl: 60000,
            limit: 60,
          },
        ],
        storage: new RedisThrottlerStorage(redis),
      }),
    }),
    RedisModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class RateLimitingModule {}
