import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Sentry from "@sentry/nestjs";
import { initSentry } from "./common/sentry.config";
import { AppModule } from "./app.module";
import { AnalyticsService } from "./common/services/analytics.service";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const analyticsService = app.get(AnalyticsService);
  const logger = new Logger("Bootstrap");

  // Initialize Sentry
  initSentry(configService);

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
      );
      if (req.body && Object.keys(req.body).length > 0) {
        logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
      }
    });
    next();
  });

  app.enableCors({
    origin:
      configService.get<string>("FRONTEND_URL") || "http://localhost:3000",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = configService.get<number>("PORT") || 8000;
  await app.listen(port);

  logger.log(`API is running on: http://localhost:${port}`);
  logger.log(`Environment: ${configService.get("NODE_ENV") || "development"}`);
}

bootstrap();
