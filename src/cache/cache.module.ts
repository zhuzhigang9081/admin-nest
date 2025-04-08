import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config'
import { createClient } from 'redis'

@Module({
  providers: [CacheService,
    // 使用工厂模式创建redis客户端
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get("RD_HOST"),
            port: configService.get("RD_PORT"),
          },
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService]
    }
  ],
  exports:[CacheService]
})
export class CacheModule { }
