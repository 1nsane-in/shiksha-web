# Codebase Enhancement Plan

> Generated: 2026-05-17
> Scope: Full-stack architecture audit — Next.js 16 + NestJS 11 + PostgreSQL

---

## Current Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js App Router | 16.2.6 |
| Backend | NestJS | 11.x |
| Database | PostgreSQL + Prisma ORM | 6.x |
| Styling | Tailwind CSS v4 + shadcn/ui (base-nova) | - |
| Client State | Zustand 5 | Latest |
| Server State | TanStack Query 5 | Latest |
| Monorepo | PNPM + Turborepo 2 | v2 |
| Error Tracking | Sentry | v10 |
| Analytics | PostHog | - |

---

## Critical Issues

### 1. AI Service Contradicts Architecture Rules

- **File:** `apps/ai-service/` (Python FastAPI service)
- **Problem:** AGENTS.md §2.2 explicitly states: *"No Python services in V1. All logic is TypeScript. No separate AI service — keep everything in NestJS."*
- **Fix:** Remove Python AI service or migrate into `apps/api/src/modules/ai/` using Vercel AI SDK + OpenRouter per AGENTS.md §7.

### 2. Hardcoded API Key in opencode.json

- **File:** `opencode.json:9`
- **Problem:** `X-Goog-Api-Key` value is exposed in plaintext in version control.
- **Fix:** Remove or use environment variable substitution.

### 3. Stage Requirements Hardcoded in Service

- **File:** `apps/api/src/students/students.service.ts:83-95`
- **Problem:** Stage document/payment requirements are hardcoded in a JavaScript object. Violates DRY and AGENTS.md §5.1 (*"Do not hardcode stage requirements"*).
- **Fix:** Move to a `stage_requirements` DB table with admin-configurable rules.

### 4. Excessive `any` Types in Backend

- **Files across:** `universities.service.ts`, `students.service.ts`, `documents.service.ts`
- **Patterns found:**
  - `const where: any = {}` — query building without type safety
  - `dto as any` — bypasses class-validator DTOs
  - `const updateData: any` — defeats TypeScript strict mode
- **Fix:** Create typed query builders, use proper union/DTO types, remove casts.

### 5. Unused Dependencies

- **`@tanstack/react-router`** (`apps/web/package.json`) — Next.js App Router IS the router. This is a dead dependency.
- **`packages/ui/src/Button.tsx`** — legacy button alongside shadcn `button.tsx`. Neither exported consistently.

---

## Architecture Gaps (vs AGENTS.md §6.1)

### Missing Modules

| Module | Status | Priority |
|--------|--------|----------|
| `payments/` | Empty dir — not implemented | HIGH |
| `letters/` | Empty dir — not implemented | HIGH |
| `agents/` | Not created | MEDIUM |
| `commissions/` | Not created | MEDIUM |
| `visa-support/` | Not created | MEDIUM |
| `ai/` (NestJS) | Not created | MEDIUM |
| `reports/` | Not created | LOW |
| `settings/` | Not created | LOW |
| `audit-logs/` | Not created (service exists in common/) | LOW |

### Existing Module Gaps

| Module | Issue |
|--------|-------|
| `auth/` | No refresh token rotation, no rate limiting on OTP |
| `documents/` | No signed URL generation, no file type validation config |
| `universities/` | DTO file is 663 lines — violates SRP |
| `students/` | Stage unlock logic not implemented |

---

## Code Quality & Principles

### SOLID Violations

| Principle | Finding | Fix |
|-----------|---------|-----|
| **S**ingle Responsibility | `universities.service.ts` handles CRUD + courses + documents + stats + countries | Split into focused services (`UniversityService`, `CourseService`, `DocumentService`, `StatsService`) |
| **O**pen/Closed | Stage requirements use if/else branches against hardcoded values | Configurable DB rules — service reads config, doesn't define it |
| **L**iskov Substitution | DTOs are monolithic with all optional fields | Granular per-operation DTOs (e.g., `CreateUniversityDto`, `UpdateUniversityLocationDto`, etc.) |
| **I**nterface Segregation | Single DTO per module handles create/update/partial | Separate DTO per use case |
| **D**ependency Inversion | Services depend directly on `PrismaService` | Add repository abstraction for testability |

### DRY Violations

- **Pagination logic** repeated in every service (`skip`, `take`, `total`, `Math.ceil(total / limit)`) → extract to `PaginatorService`
- **Response wrappers** (`{ data, meta }`) duplicated → use NestJS interceptor
- **Existence checks** (`findOrThrow`) repeated → extract to base class
- **Prisma includes** for student profile duplicated in 3+ queries → use reusable include objects

### KISS Violations

- **University creation** DTO creates all 10+ relations atomically → allow progressive creation with validation at each step
- **Frontend forms** use raw `useState` per field — no React Hook Form → adds boilerplate and reduces validation consistency
- **Admin DTO** has 30+ optional fields → overwhelming; split into domain-focused groups

---

## Next.js Skills Application

### next-best-practices

| Practice | Current State | Required Action |
|----------|--------------|-----------------|
| **File Conventions** | Admin routes have layouts/loading/error | Student/parents routes missing error.tsx, not-found.tsx |
| **RSC Boundaries** | Not audited | Audit all `'use client'` directives for necessity |
| **Async APIs** | Next.js 16 requires async params | Verify all page components use `params: Promise<...>` |
| **Data Patterns** | Data fetching is mixed patterns | Use RSC for reads, Server Actions for mutations, Route Handlers for webhooks |
| **Image Optimization** | Landing page may use `<img>` | Audit and replace with `next/image` |
| **Metadata** | Only root layout has metadata | Add `generateMetadata` to all page groups |
| **Error Handling** | Admin has `error.tsx` | Add `error.tsx` + `not-found.tsx` for student, parents routes |
| **Suspense Boundaries** | Not used | Add Suspense for `useSearchParams` usage |
| **Directives** | `'use client'` may be overused | Audit and push data fetching to server |
| **Bundling** | `@tanstack/react-router` is dead weight | Remove unused dependencies |

### next-cache-components

| Feature | Action |
|---------|--------|
| **Enable PPR** | Add `cacheComponents: true` to `next.config.ts` |
| **Public university pages** | Add `'use cache'` + `cacheLife('hours')` + `cacheTag('university')` |
| **University list (admin)** | Add `'use cache'` + `cacheLife('minutes')` + `cacheTag('universities')` |
| **Dashboard stats** | Add `'use cache'` with `cacheLife('hours')` |
| **Mutation invalidation** | Use `revalidateTag()` in Server Actions after CRUD operations |
| **`unstable_cache` migration** | Replace any legacy `unstable_cache` calls with `'use cache'` directive |

### next-upgrade

Already on Next.js 16 — but run codemods to confirm:
```bash
npx @next/codemod@latest next-async-request-api apps/web
```

---

## Design System Recommendation

### Current State Mismatch

| Source | Colors | Typography | Vibe |
|--------|--------|-----------|------|
| `globals.css` (actual) | Purple `#4B2D8E`, Gold `#F0A030`, Light bg `#F8F6FC` | Inter 400/500/600/700 | Traditional education |
| `DESIGN.md` (on file) | Cream `#f5f1ec`, Charcoal `#111`, Fin Orange `#ff5600` | Saans geometric sans | Modern Intercom-like |

### Recommendation: shadcn/ui + Custom Medical-Education Theme

Stick with shadcn/ui (already configured as `base-nova` style) and apply a unified custom theme:

```
Primary:    #1E3A5F  (Deep navy — trust, medical authority)
Accent:     #0D9488  (Teal — health, healing)
Neutral:    Cool gray scale (#f8fafc → #0f172a)
Typography: Inter (body) + DM Sans (headings)
Spacing:    8px base unit (from DESIGN.md)
Elevation:  No shadows — use surface color changes (from DESIGN.md)
Radius:     shadcn default (0.5rem)
```

**Why this combination:**
- Navy + teal aligns with medical/healthcare industry expectations
- shadcn/ui provides battle-tested accessible components
- DESIGN.md's elevation/spacing patterns are good — adopt them
- Inter is already loaded in `globals.css`, so no additional font load

**Remediation steps:**
1. Standardize `globals.css` to one cohesive palette (keep or replace)
2. Either commit to DESIGN.md's Intercom style or replace DESIGN.md with actual theme
3. Document all design tokens in a single source of truth

---

## Enhancement Plan — Phased Execution

### Phase 1: Immediate (Security + Cleanup)

- [ ] Remove hardcoded API key from `opencode.json`
- [ ] Remove `@tanstack/react-router` dependency
- [ ] Remove legacy `packages/ui/src/Button.tsx`
- [ ] Remove or migrate Python AI service (`apps/ai-service`)
- [ ] Add all missing env vars to `.env.example`
- [ ] Audit `.gitignore` for secrets exposure

### Phase 2: Architecture Hardening

- [ ] Enable `cacheComponents: true` in `next.config.ts`
- [ ] Extract `PaginatorService` for reusable pagination
- [ ] Extract `BaseService` with `findOrThrow`, common CRUD
- [ ] Create typed query builder to eliminate `any`
- [ ] Add React Hook Form + Zod schemas for all forms
- [ ] Split monolithic DTOs (esp. `universities.dto.ts` — 663 lines)
- [ ] Add `error.tsx` + `not-found.tsx` for all route groups
- [ ] Replace hardcoded stage requirements with DB-driven config
- [ ] Audit `'use client'` boundaries — push data to server
- [ ] Add `generateMetadata` to all page groups

### Phase 3: Missing Domains

- [ ] Implement `payments/` module with Razorpay webhooks
- [ ] Implement `letters/` module (admission + invitation letters)
- [ ] Implement `ai/` module in NestJS (Vercel AI SDK + OpenRouter)
- [ ] Implement `agents/` + `commissions/` modules
- [ ] Implement `visa-support/` module
- [ ] Add signed URL generation for document access

### Phase 4: Testing

- [ ] Add unit tests for all NestJS services (critical business logic)
- [ ] Add e2e tests for: auth flow, university CRUD, document workflow
- [ ] Add component tests for complex forms (admin university wizard)
- [ ] Set up test DB seed data

### Phase 5: Observability & DX

- [ ] Integrate global audit-log interceptor for sensitive actions
- [ ] Add rate limiting on auth endpoints
- [ ] Create dashboard for stage-wise student counts
- [ ] Add bundle analysis to CI pipeline

---

## Design System Alignment (DESIGN.md vs globals.css)

The `DESIGN.md` defines an Intercom-inspired design system, but `globals.css` implements a purple/gold education theme. These are misaligned.

**Decision needed:** Pick one and delete/update the other.

- Option A: Update `globals.css` to match `DESIGN.md` (cream + charcoal + orange)
- Option B: Update `DESIGN.md` to document the actual purple/gold theme
- Option C: Create a new unified theme (recommended navy + teal above)

> Once decided, update the design tokens in one place and remove the stale reference.
