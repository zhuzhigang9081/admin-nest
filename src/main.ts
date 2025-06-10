import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/http-exception/http-exception.filter'
import { TransformInterceptor } from './common/interceptor/transform/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('FS_ADMIN')// 标题
    .setDescription('后台管理系统接口文档')// 描述
    .setVersion('1.0')// 版本
    .addBearerAuth()//token
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/fs_admin/api', app, document);

  app.useGlobalFilters(new HttpExceptionFilter()) //添加全局过滤器
  app.useGlobalInterceptors(new TransformInterceptor())//添加全局拦截器
  app.useGlobalPipes(new ValidationPipe())//添加全局校验器 -内置校验管道 可自动校验 body query params 
  //启用cors
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
