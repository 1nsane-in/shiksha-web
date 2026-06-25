import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { RedisService } from '../../redis/redis.service';

/**
 * Redis-backed throttler storage using existing Upstash Redis connection.
 * Enables rate limiting across multiple instances (horizontal scaling).
 * Falls back to in-memory if Redis is unavailable.
 */
@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage, OnModuleDestroy {
  private readonly ttlBuffer = 1000; // 1s buffer for TTL
  private readonly memoryFallback = new Map<string, { hits: number; expiresAt: number }>();
  private readonly cleanupInterval: ReturnType<typeof setInterval>;
  private storageActive = true;

  constructor(private readonly redis: RedisService) {
    // Periodic cleanup for memory fallback
    this.cleanupInterval = setInterval(() => this.cleanupMemory(), 60_000);
  }

  onModuleDestroy() {
    clearInterval(this.cleanupInterval);
  }

  async increment(key: string, ttl: number): Promise<{
    totalHits: number;
    timeToExpire: number;
    isBlocked: boolean;
    timeToBlockExpire: number;
  }> {
    try {
      if (this.storageActive) {
        const result = await this.tryRedisIncrement(key, ttl);
        if (result) return result;
      }
    } catch {
      this.storageActive = false;
    }

    return this.memoryIncrement(key, ttl);
  }

  private async tryRedisIncrement(key: string, ttl: number) {
    const redisKey = `ratelimit:${key}`;
    const now = Date.now();
    const windowMs = ttl + this.ttlBuffer;

    // Multi: INCR, EXPIRE, TTL
    const hits = await this.redis.incr(redisKey);

    if (hits === 1) {
      await this.redis.expire(redisKey, Math.ceil(windowMs / 1000));
    }

    const remainingTtl = await this.redis.ttl(redisKey);
    const timeToExpire = remainingTtl > 0 ? remainingTtl * 1000 : ttl;

    return {
      totalHits: hits,
      timeToExpire,
      isBlocked: false,
      timeToBlockExpire: 0,
    };
  }

  private memoryIncrement(key: string, ttl: number): {
    totalHits: number;
    timeToExpire: number;
    isBlocked: boolean;
    timeToBlockExpire: number;
  } {
    const now = Date.now();
    const existing = this.memoryFallback.get(key);

    if (!existing || now > existing.expiresAt) {
      this.memoryFallback.set(key, { hits: 1, expiresAt: now + ttl });
      return { totalHits: 1, timeToExpire: ttl, isBlocked: false, timeToBlockExpire: 0 };
    }

    existing.hits++;
    return {
      totalHits: existing.hits,
      timeToExpire: existing.expiresAt - now,
      isBlocked: false,
      timeToBlockExpire: 0,
    };
  }

  private cleanupMemory() {
    const now = Date.now();
    for (const [key, value] of this.memoryFallback) {
      if (now > value.expiresAt) {
        this.memoryFallback.delete(key);
      }
    }
  }
}
