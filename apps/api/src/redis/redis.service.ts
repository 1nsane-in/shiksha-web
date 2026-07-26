import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      url: this.configService.get<string>('UPSTASH_REDIS_REST_URL')!,
      token: this.configService.get<string>('UPSTASH_REDIS_REST_TOKEN')!,
    });
  }

  // Basic operations
  async get<T>(key: string): Promise<T | null> {
    return this.redis.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(key, value, { ex: ttlSeconds });
    } else {
      await this.redis.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  // Hash operations (for caching objects)
  async hget<T>(key: string, field: string): Promise<T | null> {
    return this.redis.hget<T>(key, field);
  }

  async hset<T>(key: string, field: string, value: T): Promise<void> {
    await this.redis.hset(key, { [field]: value });
  }

  async hgetall<T extends Record<string, unknown>>(
    key: string,
  ): Promise<T | null> {
    return this.redis.hgetall<T>(key);
  }

  // List operations (for queues)
  async lpush(key: string, value: string): Promise<void> {
    await this.redis.lpush(key, value);
  }

  async rpop(key: string): Promise<string | null> {
    return this.redis.rpop(key);
  }

  // Set operations (for unique collections)
  async sadd(key: string, value: string): Promise<void> {
    await this.redis.sadd(key, value);
  }

  async smembers(key: string): Promise<string[]> {
    return this.redis.smembers(key);
  }

  // Pattern delete (for cache invalidation)
  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // Cache wrapper with fallback
  // ponytail: caching disabled — was returning stale data. Enable when cache invalidation is reliable.
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    _ttlSeconds?: number,
  ): Promise<T> {
    return factory();
  }

  // Rate limiting operations
  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  // Health check
  async ping(): Promise<string> {
    return this.redis.ping();
  }

  onModuleDestroy() {
    // Upstash Redis is HTTP-based, no persistent connection to close
  }
}
