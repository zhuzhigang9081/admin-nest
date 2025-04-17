import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from 'src/cache/cache.module';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './user.guard';

@Module({
  controllers: [UserController],
  providers: [UserService,
    {
      provide: APP_GUARD, //整个user模块使用 守卫
      useClass: UserGuard, //使用UserGuard守卫
    }
  ],
  imports: [TypeOrmModule.forFeature([User]), CacheModule],
})
export class UserModule { }
