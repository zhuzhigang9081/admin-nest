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
  /*
  exports 列出了你希望对外暴露的提供者（providers），以便其他模块可以通过导入当前模块来使用这些提供者。
    只有通过 exports 的 providers 别的模块才能用

  */
  exports:[CacheService]
})
export class CacheModule { }
