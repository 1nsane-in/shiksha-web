# Build context: ./apps/api (this app is self-contained, no monorepo workspace)
FROM node:22-slim AS base

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy only this app's manifests and Prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# Install dependencies from this app's own lockfile
RUN pnpm install --frozen-lockfile

# Copy source and build (prebuild runs `prisma generate`)
COPY . .
RUN pnpm run build

# Production stage
FROM node:22-slim AS production

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/package.json ./

EXPOSE 8000

CMD ["node", "dist/main.js"]
