import { Inject, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Menu } from './menu/entities/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';
import { APP_GUARD } from '@nestjs/core';
import * as path from 'path'
import { PermissionsGuard } from './common/guard/permissions.guard';
import { UserGuard } from './common/guard/user.guard';
const isProd = process.env.NODE_ENV === 'production';
@Module({
  /* imports 数组用于指定当前模块依赖的其他模块。通过导入其他模块，你可以使用那些模块中定义的 providers、controllers 等组件,
    只有导入才能用 
    eg: @Module({
        imports: [ConfigModule], // 导入 ConfigModule
        providers: [UserService],
        controllers: [UserController],
      })
  */

  imports: [
    UserModule,
    //引入@nestjs/config 用来读取配置项
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [isProd ? path.resolve('.env.prod') : path.resolve('.env')]
    }),
    //引入typeORM 用来操作数据库
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
          // entities: [User,Menu],//数据库对应的entity
          entities: [__dirname + '/**/*.entity{.ts,.js}'],//数据库对应的entity
          autoLoadEntities: true,//自动加载实体文件
          synchronize: !isProd,//是否自动同步实体文件,生产环境关闭
        }
      },
      inject: [ConfigService]
    }),
    //引入 jwt 用于身份识别  
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            expiresIn: configService.get("JWT_EXP")
          }
        }
      }

    }),
    CacheModule,
    MenuModule,
    RoleModule,
  ],
  // controllers: [],
  providers: [
    //! guard有顺序关系 先UserGuard 后PermissionsGuard  因为PermissionsGuard 依赖UserGuard
    //因为menu中也要用到用户信息,所以把user模块也放在appmodule中,设为全局守卫 
    {
      provide: APP_GUARD, //整个user模块使用 守卫
      useClass: UserGuard, //使用UserGuard守卫
    },
    {
      provide: APP_GUARD, 
      useClass: PermissionsGuard, // 将PermissionsGuard  放在appmodule中,设为全局守卫 其他模块就都可以使用了
    },
  ],
})
export class AppModule { }