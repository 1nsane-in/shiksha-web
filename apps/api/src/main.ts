import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as Sentry from '@sentry/nestjs';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initSentry } from './common/sentry.config';
import { AppModule } from './app.module';
import { AnalyticsService } from './common/services/analytics.service';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { versionMiddleware } from './common/middleware/version-middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const analyticsService = app.get(AnalyticsService);
  const logger = new Logger('Bootstrap');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shiksha API')
    .setDescription('Medical Admission Management Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('refreshToken')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  initSentry(configService);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(versionMiddleware);

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
      );
      if (req.body && Object.keys(req.body).length > 0) {
        logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
      }
    });
    next();
  });

  app.set('etag', false);

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL')?.split(',') || [
      'http://localhost:3000',
    ],
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.enableShutdownHooks();

  const port = configService.get<number>('PORT') || 8000;
  await app.listen(port);

  logger.log(`API is running on: http://localhost:${port}`);
}

bootstrap();
