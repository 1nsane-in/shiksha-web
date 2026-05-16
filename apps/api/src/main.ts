import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Sentry from "@sentry/nestjs";
import { initSentry } from "./common/sentry.config";
import { AppModule } from "./app.module";
import { AnalyticsService } from "./common/services/analytics.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const analyticsService = app.get(AnalyticsService);

  // Initialize Sentry
  initSentry(configService);

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

  console.log(`API is running on: http://localhost:${port}`);
  console.log(`Environment: ${configService.get("NODE_ENV") || "development"}`);
}

bootstrap();
