import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`\n🚀 Server running on http://localhost:${port}`);
  console.log(`📋 API docs: http://localhost:${port}/api/tickets`);
  console.log(`🔐 Auth: ${configService.get('AUTH_ENABLED') === 'true' ? 'ENABLED' : 'DISABLED'}\n`);
}

bootstrap();
