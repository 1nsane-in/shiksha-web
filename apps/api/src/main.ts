import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { versionMiddleware } from './common/middleware/version-middleware';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
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

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(versionMiddleware);

  app.use((req: Request, res: Response, next: NextFunction) => {
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

  const allowedOrigins = configService
    .get<string>('FRONTEND_URL')
    ?.split(',')
    .map((url) => url.trim())
    .filter(Boolean) || ['http://localhost:3000'];

  // Add 127.0.0.1 and localhost by default in development mode
  if (configService.get<string>('NODE_ENV') === 'development') {
    if (!allowedOrigins.includes('http://127.0.0.1:3000')) {
      allowedOrigins.push('http://127.0.0.1:3000');
    }
    if (!allowedOrigins.includes('http://localhost:3000')) {
      allowedOrigins.push('http://localhost:3000');
    }
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, postman or curl)
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        // Handle exact match
        if (allowedOrigin === origin) return true;
        // Handle trailing slash mismatch (e.g. http://localhost:3000/ vs http://localhost:3000)
        if (allowedOrigin.replace(/\/$/, '') === origin.replace(/\/$/, ''))
          return true;
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'X-Api-Version',
      'X-CSRF-Token',
    ],
    exposedHeaders: ['Set-Cookie'],
  });

  // Static file serving removed for security. Use StorageService (signed URLs via R2/S3).
  // app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  // Response compression - reduces bandwidth by 60-80%
  app.use(
    compression({
      level: 6, // Compression level (0-9, 6 is default)
      filter: (req, res) => {
        // Don't compress responses with this header
        if (req.headers['x-no-compression']) {
          return false;
        }
        // Use compression for all other responses
        return compression.filter(req, res);
      },
      // Compress responses larger than 1KB
      threshold: 1024,
    }),
  );

  // Security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  app.enableShutdownHooks();

  const port = configService.get<number>('PORT') || 8000;
  await app.listen(port);

  logger.log(`API is running on: http://localhost:${port}`);
}

bootstrap();
