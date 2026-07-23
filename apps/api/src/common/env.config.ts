export const env = {
  ENV: process.env.ENV ?? 'production',
  NODE_ENV: process.env.NODE_ENV ?? 'production',
  get isDev() {
    return this.ENV === 'dev' || this.NODE_ENV === 'development';
  },
  get isProd() {
    return !this.isDev;
  },
  get dbUrlMasked() {
    return process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@');
  },
  LOCALHOST: 'http://localhost:3000' as const,
  LOCALHOST_ALT: 'http://127.0.0.1:3000' as const,
} as const;
