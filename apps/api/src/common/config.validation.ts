// Boot-time env validation. No new deps: plain checks are enough here.
export function validateConfig(config: Record<string, unknown>) {
  const value = (key: string) =>
    typeof config[key] === 'string' ? (config[key] as string).trim() : '';

  const envName = value('ENV') || 'production';
  const nodeEnv = value('NODE_ENV') || 'production';

  // dev OTP bypass must never run in production, and production must never run in dev mode
  if (envName === 'dev' && nodeEnv === 'production') {
    throw new Error('Refusing to boot: ENV=dev with NODE_ENV=production.');
  }
  if (envName !== 'dev' && nodeEnv !== 'production') {
    throw new Error(
      `Refusing to boot: ENV=${envName} with NODE_ENV=${nodeEnv}. Set ENV=dev for non-production deployments.`,
    );
  }

  const isDev = envName === 'dev';
  const required = isDev
    ? ['DATABASE_URL', 'JWT_SECRET']
    : [
        'DATABASE_URL',
        'JWT_SECRET',
        'FRONTEND_URL',
        'PAYU_KEY',
        'PAYU_SALT',
        'R2_ENDPOINT',
        'R2_ACCESS_KEY_ID',
        'R2_SECRET_ACCESS_KEY',
        'R2_BUCKET_NAME',
        'UPSTASH_REDIS_REST_URL',
        'UPSTASH_REDIS_REST_TOKEN',
      ];

  const missing = required.filter((key) => !value(key));
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
  if (!isDev && value('JWT_SECRET').length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production.');
  }

  return config;
}
