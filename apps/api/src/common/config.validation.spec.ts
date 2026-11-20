import { validateConfig } from './config.validation';

const prodEnv = {
  ENV: 'production',
  NODE_ENV: 'production',
  DATABASE_URL: 'postgres://...',
  JWT_SECRET: 'x'.repeat(32),
  FRONTEND_URL: 'https://example.com',
  PAYU_KEY: 'key',
  PAYU_SALT: 'salt',
  R2_ENDPOINT: 'https://r2.example.com',
  R2_ACCESS_KEY_ID: 'id',
  R2_SECRET_ACCESS_KEY: 'secret',
  R2_BUCKET_NAME: 'documents',
  UPSTASH_REDIS_REST_URL: 'https://redis.example.com',
  UPSTASH_REDIS_REST_TOKEN: 'token',
};

describe('validateConfig', () => {
  it('accepts a complete production config', () => {
    expect(validateConfig(prodEnv)).toBe(prodEnv);
  });

  it('rejects missing production secrets', () => {
    expect(() => validateConfig({ ...prodEnv, PAYU_SALT: '' })).toThrow(
      /PAYU_SALT/,
    );
  });

  it('rejects short JWT secrets in production', () => {
    expect(() => validateConfig({ ...prodEnv, JWT_SECRET: 'short' })).toThrow(
      /32 characters/,
    );
  });

  it('rejects dev OTP bypass in production', () => {
    expect(() =>
      validateConfig({ ...prodEnv, ENV: 'dev' }),
    ).toThrow(/ENV=dev/);
  });

  it('rejects development NODE_ENV without explicit ENV=dev', () => {
    expect(() =>
      validateConfig({ ...prodEnv, NODE_ENV: 'development' }),
    ).toThrow(/ENV=dev/);
  });
});
