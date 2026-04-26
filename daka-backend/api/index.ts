import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

// Vercel Serverless Function 入口
export default async function handler(req: any, res: any) {
  const app = await NestFactory.create(AppModule);

  // CORS配置
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // API前缀
  app.setGlobalPrefix('api/v1');

  // Swagger文档
  const config = new DocumentBuilder()
    .setTitle('智能学习管理助手 API')
    .setDescription('智能学习管理助手后端API文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  
  // Vercel 适配
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}
