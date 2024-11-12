import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from '@shared/validators/rpc-exception.filter';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);

  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>('CORS_ORIGIN', { infer: true });
  const port = configService.get<number>('MAIN_PORT', { infer: true });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: 'GET,PUT,POST,OPTIONS,PATCH,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new RpcExceptionFilter());

  await app.listen(port);
}
bootstrap();
