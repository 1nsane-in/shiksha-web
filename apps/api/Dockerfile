FROM node:22-slim AS base

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the api package.json and prisma schema
COPY apps/api/package.json apps/api/
COPY apps/api/prisma ./apps/api/prisma/

# Install dependencies
RUN pnpm install --filter @repo/api --frozen-lockfile

# Copy api source
COPY apps/api/ apps/api/

# Generate Prisma client and build
WORKDIR /app/apps/api
RUN pnpm run build

# Production stage
FROM node:22-slim AS production

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/apps/api/node_modules ./node_modules
COPY --from=base /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=base /app/apps/api/prisma ./prisma
COPY --from=base /app/apps/api/package.json ./

ENV NODE_ENV=production

EXPOSE 8000

CMD ["node", "dist/main.js"]
