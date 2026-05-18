# Medical Admission Platform

A monorepo for medical college admission platform built with pnpm workspaces and Turborepo.

## Project Structure

```
medical-admission-platform/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── api/              # NestJS main backend
│   └── ai-service/       # FastAPI AI service
├── packages/
│   ├── shared-types/     # Shared TypeScript types
│   ├── ui/               # Shared UI components
│   └── config/           # Shared eslint, prettier, tsconfig
├── docs/                 # Documentation
├── docker/               # Docker configurations
├── scripts/              # Utility scripts
└── .github/workflows/    # GitHub Actions CI/CD
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- Python 3.11+ (for AI service)

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

### 3. Start development services

```bash
docker-compose up postgres redis -d
pnpm dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm test` | Run tests for all apps |
| `pnpm clean` | Clean all build artifacts |

## Running Individual Apps

```bash
# Web (Next.js)
pnpm --filter @repo/web dev

# API (NestJS)
pnpm --filter @repo/api dev

# AI Service (FastAPI)
cd apps/ai-service && poetry run uvicorn src.main:app --reload
```

## Docker

Start all services:

```bash
docker-compose up -d
```

## Deployment

### Free Deployment Options

See detailed guides:
- **[Render Deployment Guide](./RENDER_DEPLOYMENT.md)** - Complete setup instructions
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Quick reference checklist

**Quick Deploy to Render:**
1. Install Render GitHub App on your organization
2. Create PostgreSQL database on Render
3. Create Web Service with:
   - Root Directory: `apps/api`
   - Build: `pnpm install && pnpm --filter @repo/api build`
   - Start: `pnpm --filter @repo/api start:prod`
4. Add environment variables (see `.env.production.example`)
5. Deploy!

**Other Free Options:**
- Railway (500 hours/month)
- Fly.io (3 VMs free)
- Google Cloud Run (2M requests/month)
- AWS Free Tier (12 months)

## License

MIT
