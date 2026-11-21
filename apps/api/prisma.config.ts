import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
  },
  // generate doesn't need a live URL; runtime uses adapter in PrismaService
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});
