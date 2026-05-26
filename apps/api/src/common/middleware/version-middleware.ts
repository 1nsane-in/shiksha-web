import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const logger = new Logger('VersionMiddleware');

const DEPRECATED_ROUTES: { pattern: RegExp; sunset: string; migration: string }[] = [];

export function versionMiddleware(req: Request, res: Response, next: NextFunction) {
  const matched = DEPRECATED_ROUTES.find((r) => r.pattern.test(req.originalUrl));

  if (matched) {
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', matched.sunset);
    res.setHeader('Link', `<${matched.migration}>; rel="deprecation"`);
    logger.warn(`Deprecated endpoint called: ${req.method} ${req.originalUrl}`);
  }

  res.setHeader('X-Api-Version', '1');
  res.setHeader('X-Request-Id', Date.now().toString(36) + Math.random().toString(36).slice(2, 8));

  next();
}
