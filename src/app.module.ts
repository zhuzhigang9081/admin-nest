import { Inject, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import * as path from 'path'

const isProd = process.env.NODE_ENV === 'production';
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [isProd ? path.resolve('.env.prod') : path.resolve('.env')]
    }),
    //引入@nestjs/config 用来读取配置项
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          connectorPackage: 'mysql2',//驱动包
          username: configService.get('DB_USER'),//用户名
          password: configService.get('DB_PASSWD'),//密码
          database: configService.get('DB_DATABASE'),//数据库名
          entities: [User],//数据库对应的entity
          synchronize: !isProd,//是否自动同步实体文件,生产环境关闭
        }
      },
      inject: [ConfigService]
    }),
    //引入typeORM 用来操作数据库
    CacheModule,
  ],
  // controllers: [],
  // providers: [],
})
export class AppModule { }
