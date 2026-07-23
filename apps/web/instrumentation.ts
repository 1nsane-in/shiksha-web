import * as Sentry from '@sentry/nextjs';
import { env } from '@/lib/env.config';

export function register() {
  const sampleRate = env.isProd ? 0.1 : 1.0;

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: env.NODE_ENV,
      tracesSampleRate: sampleRate,
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: env.NODE_ENV,
      tracesSampleRate: sampleRate,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
