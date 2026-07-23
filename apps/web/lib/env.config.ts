export const env = {
  ENV: process.env.ENV ?? 'production',
  NODE_ENV: process.env.NODE_ENV ?? 'production',
  get isDev() { return this.ENV === 'dev' || this.NODE_ENV === 'development'; },
  get isProd() { return this.NODE_ENV === 'production'; },
} as const;
