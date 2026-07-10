const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

const expressApp = express();
let appPromise = null;

async function bootstrap() {
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
  return app;
}

// Export a handler that waits for NestJS to be fully initialized
// before forwarding the request to Express
module.exports = async (req, res) => {
  if (!appPromise) {
    appPromise = bootstrap();
  }
  await appPromise;
  expressApp(req, res);
};
