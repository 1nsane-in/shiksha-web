# Shiksha — Medical Admission Management Platform

> Your Trusted Global Education Ally

[![Node](https://img.shields.io/badge/node-22.x-339933?logo=node.js)](https://nodejs.org)
[![PNPM](https://img.shields.io/badge/pnpm-10.x-F69220?logo=pnpm)](https://pnpm.io)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)](https://nestjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)](https://neon.tech)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

Shiksha is a medical admission management platform for **MBBS abroad admissions**. It guides students through a stage-wise application process — from initial registration through visa support — while giving administrators tools to verify documents, approve payments, and manage universities.

## Features

**Student Portal**
- Stage-wise application tracking (5 stages: Application → Exam → Admission Letter → Invitation Letter → Visa Support)
- Document upload & verification with re-upload on rejection
- Multi-stage payment integration
- Admission letter & invitation letter access
- Exam dashboard & registration
- Visa support & checklist tracking
- Real-time notification system

**Admin Dashboard**
- Student application management
- Document verification workflow
- Payment approval & reconciliation
- University & course management
- Ticket/support system
- AI-assisted document validation (suggestions only, no auto-approve)
- Reports & analytics (PostHog, Sentry)
- Role-based access control (Super Admin, Admin, Student, Parent)

**Platform**
- Multi-tenant organization support
- Parent portal with invitation system
- Entrance exam management with proctoring
- Consultation booking
- Content & gallery management

## Architecture

```
sh-web/
├── apps/
│   ├── api/          # NestJS 11 backend (port 8000)
│   └── web/          # Next.js 16 frontend (port 3000)
├── docs/             # Architecture, API, database, security docs
├── docker-compose.yml
└── package.json      # pnpm workspace root
```

### Backend (`apps/api`)

[NestJS 11](https://nestjs.com) monolith with Prisma 7 + Neon PostgreSQL. Redis (Upstash) for caching + sessions. S3-compatible storage (Cloudflare R2) for documents.

**Modules:** auth, users, students, applications, documents, payments, universities, letters, exams, visa-support, notifications, reports, ai, admin, tickets, parents, consultation, content, gallery

### Frontend (`apps/web`)

[Next.js 16](https://nextjs.org) App Router with React 19, Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) components. Server Components + Server Actions. TanStack Query for data fetching, Zustand for client state.

**Route groups:** `(admin)/`, `(students)/`, `(parents)/`, `(landing)/`, `(shared)/`

### Database

PostgreSQL via [Neon](https://neon.tech) with Prisma ORM. Schema covers 20+ models across users, students, applications, payments, universities, exams, visas, notifications, AI logging, and analytics.

> **Design system:** Intercom-inspired — cream canvas (#f5f1ec), charcoal ink (#111111), Fin Orange (#ff5600) accent. Full spec in [DESIGN.md](./DESIGN.md).

## Prerequisites

- **Node.js** 22.x (see `.nvmrc` or `package.json` engines)
- **pnpm** 10.x
- **Docker** (for local Postgres + Redis via docker-compose)
- **Neon PostgreSQL** account (or local Postgres)
- **Cloudflare R2** bucket (for document storage)
- **Resend** API key (for email)

## Getting Started

```bash
# Clone & install
git clone <repo-url> sh-web
cd sh-web
pnpm install

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### Environment Variables

Key variables in `apps/api/.env`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | JWT signing secret |
| `JWT_REFRESH_SECRET` | JWT refresh secret |
| `R2_*` | Cloudflare R2 credentials (documents) |
| `RESEND_API_KEY` | Email service |
| `UPSTASH_REDIS_*` | Redis connection |
| `SENTRY_*` | Error tracking |
| `POSTHOG_*` | Product analytics |
| `PAYU_*` | Payment gateway (PayU) |

> [!TIP]
> Full env reference in [docs/03-api/environment.md](./docs/03-api/environment.md)

### Local Development

```bash
# Start Postgres & Redis
docker compose up -d postgres redis

# Generate Prisma client & push schema
cd apps/api
npx prisma generate
npx prisma db push

# Seed admin & document types
pnpm seed:admin
pnpm seed:docs

# Run both apps (from root)
pnpm dev:api   # http://localhost:8000
pnpm dev:web   # http://localhost:3000
```

## Useful Commands

```bash
# Root
pnpm format              # Prettier across all files

# API
cd apps/api
pnpm test                # Jest unit tests
pnpm test:e2e            # E2E tests
pnpm test:perf:smoke     # k6 smoke test
pnpm test:perf:load      # k6 load test
pnpm seed:admin          # Create super admin
pnpm seed:test           # Seed test data
pnpm seed:docs           # Seed document types

# Web
cd apps/web
pnpm build               # Production build (Turbopack)
```

## API Overview

Base URL: `http://localhost:8000` (dev)

| Prefix | Description |
|--------|-------------|
| `/api/auth` | Login, register, OTP, refresh tokens |
| `/api/students` | Student profiles & onboarding |
| `/api/applications` | Stage-wise applications |
| `/api/documents` | Upload, verify, manage docs |
| `/api/payments` | Payment orders & webhooks |
| `/api/universities` | University & course management |
| `/api/exams` | Entrance exam lifecycle |
| `/api/letters` | Admission & invitation letters |
| `/api/visa-support` | Visa applications & checklists |
| `/api/notifications` | Email & in-app notifications |
| `/api/ai` | AI document suggestions |
| `/api/tickets` | Support tickets |
| `/api/admin` | Admin-only operations |

> Full API docs at [docs/03-api/](./docs/03-api/)

## Deployment

### Docker

```bash
docker compose up -d --build
```

Services:
- `postgres` — PostgreSQL 16 (port 5432)
- `redis` — Redis 7 (port 6379)
- `web` — Next.js (port 3000)
- `api` — NestJS (port 8000/8001)
- `nginx` — Reverse proxy (port 80)

### CI/CD

GitHub Actions pipeline at `.github/workflows/ci-cd.yml`.

---

## Documentation

| Doc | Contents |
|-----|----------|
| [AGENTS.md](./AGENTS.md) | AI agent operating guide, architecture rules, coding standards |
| [PRODUCT.md](./PRODUCT.md) | Product vision, personas, design principles |
| [DESIGN.md](./DESIGN.md) | Visual design system — colors, typography, components |
| [docs/](./docs/) | Architecture, API reference, DB schema, security, deployment |

## License

[MIT](LICENSE)
