import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

async function clearUniversityCache() {
  const config = new ConfigService();
  const redis = new RedisService(config);
  
  console.log('Clearing university cache...');
  await redis.deletePattern('universities:list:*');
  await redis.deletePattern('university:*');
  console.log('Cache cleared');
}

clearUniversityCache().catch(console.error);
