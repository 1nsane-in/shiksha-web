import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './throttler-behind-proxy.guard';
import { RedisThrottlerStorage } from './redis-throttler-storage';
import { RedisModule } from '../../redis/redis.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisThrottlerStorage],
      useFactory: (storage: RedisThrottlerStorage) => ({
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
        storage,
      }),
    }),
    RedisModule,
  ],
  providers: [
    RedisThrottlerStorage,
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class RateLimitingModule {}
