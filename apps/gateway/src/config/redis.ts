import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';

import { redisStore } from 'cache-manager-redis-store';

export const redisConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      ttl: 60 * 60,
      socket: {
        host: configService.get<string>('redis.host'),
        port: parseInt(configService.get<string>('redis.port')!),
      },
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
