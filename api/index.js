const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

let cachedApp = null;
const expressApp = express();

async function bootstrap() {
  if (cachedApp) {
    return cachedApp;
  }
  
  // Require the compiled app.module from the dist folder built by `nest build`
  const { AppModule } = require('../server/dist/app.module');
  
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.init();
  cachedApp = app;
  return app;
}

// Bootstrap synchronously so Vercel can wrap the exported app
bootstrap();

module.exports = expressApp;
