import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',//用户名
      password: 'root',//密码
      database: 'fs_admin', //数据库名
      entities:[],//数据库对应的entity
      synchronize:true,//是否自动同步实体文件,生产环境关闭
      // connectorPackage:""
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
