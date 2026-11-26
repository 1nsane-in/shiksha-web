# AGENTS.md

# AI Agent Operating Guide

This file defines how AI coding agents, automation agents, and developer assistants should work inside this repository.

Project: Medical Admission Management Platform (V1)  
Architecture: Next.js + NestJS + Neon PostgreSQL  
Primary Rule: Keep all logic in NestJS — no separate AI service in V1.

---

## 1. Product Context

This project is a medical admission management platform for students and admins. The system manages:

- Student registration and dashboard
- Stage-wise admission application
- Document upload and verification
- Multi-stage payments
- Admission letter and invitation letter access
- Visa support
- University management
- AI-assisted document validation

The product should be built as a modular, secure, maintainable system. Do not over-engineer V1 with unnecessary microservices.

---

## 2. Architecture Rules

## 2.1 Main Backend

Use NestJS for all core business logic.

NestJS owns:

- Authentication
- Authorization
- Role-based access control
- Student workflows
- Application stages
- Document metadata
- Payment records
- Razorpay webhooks
- University management
- Letter access control
- Visa support
- Notifications
- Reports
- Audit logs
- Settings

## 2.2 AI / LLM (in NestJS)

V1 does NOT have a separate AI service. AI features live inside NestJS.

AI in NestJS uses:

- **Vercel AI SDK** — TypeScript wrapper for LLM calls
- **OpenRouter** — API gateway for multiple LLM models
- **Amazon Nova Lite** — default cheapest LLM via OpenRouter

NestJS AI module handles:

- Application summaries
- Admin assistant suggestions
- Student support chatbot
- Email/message drafting
- Document review note drafting

No OCR in V1. Document verification is manual.

Rules:

- Do NOT auto-approve documents based on AI output.
- AI results are suggestions for admins only.
- No FastAPI service for V1.

## 2.3 Frontend

Use Next.js for:

- Student dashboard
- Admin dashboard
- Authentication screens
- Application tracker
- Document upload screens
- Payment screens
- Reports UI

---

## 3. Repository Structure

This repository is a **single repo with self-contained apps** ("monorepo-lite"), not a pnpm workspace. Each app has its own `package.json` and lockfile and is deployed independently.

```txt
/apps
  /web                 # Next.js frontend      -> deploy root: apps/web
  /api                 # NestJS main backend   -> deploy root: apps/api
  /atlas               # Vite 3D atlas app     -> deploy root: apps/atlas

/packages              # OPTIONAL - add only when apps need shared code
  /shared-types        # Shared TypeScript types (add when needed)
  /ui                  # Shared UI components (add when needed)

/docs
  PRD_Medical_Admission_Platform.md
  API.md
  DATABASE.md
  SECURITY.md
  DEPLOYMENT.md
```

Rules:

- Do NOT add a `pnpm-workspace.yaml` or root workspace lockfile unless you intentionally introduce `packages/` shared code.
- Each app builds from its own folder: `cd apps/web && pnpm build`, `cd apps/api && pnpm build`.
- Docker build contexts are the app folders (`./apps/web`, `./apps/api`), not the repo root.
- Deploy each app separately by pointing the platform's root directory at its `apps/<name>` folder.
- `@/ui` and `@/shared-types` are local TypeScript path aliases inside `apps/web`, not shared packages.

---

## 4. Coding Standards

## 4.1 General Rules

- Write clean, modular, production-ready code.
- Prefer explicit naming over abbreviations.
- Avoid hidden business logic in controllers or UI components.
- Keep validation close to API boundaries.
- Use environment variables for secrets.
- Never hardcode credentials, API keys, payment secrets, or storage secrets.
- Always handle error cases.
- Always add audit logging for sensitive admin actions.

## 4.2 TypeScript Rules

- Use TypeScript strict mode.
- Avoid `any` unless absolutely necessary.
- Define DTOs for API requests.
- Use Zod or class-validator for validation depending on layer.
- Keep types consistent across frontend/backend.

## 4.3 (No Python in V1)

No Python services in V1. All logic is TypeScript.

---

## 5. Domain Rules

## 5.1 Student Application Stages

The platform supports the following admission stages:

1. Initial Admission Application
2. Entrance Exam Process
3. Admission Letter and Exam Dashboard
4. Invitation Letter Process
5. Visa Support

Do not hardcode stage behavior deeply in UI. Prefer configurable stage and document requirement tables.

## 5.2 Stage Unlocking

- Stage 2 unlocks only after Stage 1 documents and payment are approved.
- Exam dashboard unlocks only after Stage 2 approval.
- Invitation letter download unlocks only after final payment approval.
- Visa support unlocks only after final payment approval.

## 5.3 Documents

Documents should be stored in private object storage.

Rules:

- Store only metadata in PostgreSQL.
- Store files in S3/Cloudflare R2.
- Use signed URLs.
- Validate file type and size.
- Keep document approval/rejection remarks.
- Allow re-upload after rejection.
- Track view/download activity where applicable.

## 5.4 Payments

Payment confirmation must rely on payment gateway webhooks, not only frontend success response.

Supported payment statuses:

- PENDING
- SUCCESS
- FAILED
- REFUNDED
- MANUALLY_APPROVED

## 5.5 Secure File Viewing

Do not promise perfect screenshot blocking.

Use:

- Watermarked previews
- Disabled download before payment
- Private storage
- Signed URLs
- Access logs

---

## 6. Backend Module Guidelines

## 6.1 NestJS Module Structure

Recommended modules:

```txt
auth
users
students
applications
documents
payments
universities
letters
visa-support
notifications
reports
settings
audit-logs
common
```

Each module should contain:

```txt
controller
service
dto
entities/types
repository or Prisma access layer
module file
```

## 6.2 Controller Rules

Controllers should:

- Accept HTTP requests
- Validate DTOs
- Call services
- Return response DTOs

Controllers should not contain business logic.

## 6.3 Service Rules

Services should contain business logic.

Examples:

- Stage unlock checks
- Payment approval behavior
- Document verification transitions
- Letter access checks

## 6.4 Authorization Rules

Use guards for:

- JWT authentication
- Role checks
- Ownership checks
- Admin-only actions

Never rely only on frontend restrictions.

---

## 7. NestJS AI Module Guidelines

AI features live inside NestJS. No separate service.

Recommended structure within NestJS:

```txt
apps/api/src/modules/ai/
  ai.module.ts
  ai.controller.ts
  ai.service.ts
  dto/
    chat.dto.ts
    summarize.dto.ts
  types/
    ai-response.types.ts
```

## 7.1 AI Rules

- Use Vercel AI SDK for all LLM interactions.
- Route all LLM calls through OpenRouter.
- Default model: Amazon Nova Lite.
- Do NOT auto-approve documents based on AI output.
- AI results are suggestions for admins only.
- Log all AI requests/responses in ai_requests table.
- Handle LLM timeouts gracefully with fallback responses.

## 7.2 AI Result Format

AI responses should follow this structure:

```json
{
  "success": true,
  "model": "amazon/nova-lite-v1",
  "content": "Generated text response",
  "tokenUsage": {
    "input": 150,
    "output": 45,
    "total": 195
  }
}
```

For structured data extraction (suggestions only, not auto-decision):

```json
{
  "documentType": "passport",
  "confidence": 0.91,
  "extractedFields": {
    "name": "Example Name",
    "dateOfBirth": "YYYY-MM-DD",
    "documentNumber": "XXXX"
  },
  "flags": [
    {
      "type": "LOW_QUALITY_IMAGE",
      "severity": "medium",
      "message": "Document image is slightly blurry."
    }
  ],
  "recommendedAction": "MANUAL_REVIEW"
}
```

Do not fabricate extracted fields. If extraction fails, return null/empty values with appropriate flags.

---

## 8. Database Guidelines

Use PostgreSQL.
Use Neon PostgreSQL as the provider.
Use Prisma in NestJS.

Important table groups:

### User and Auth

- users
- roles
- user_roles
- refresh_tokens
- otp_verifications

### Admission Workflow

- students
- applications
- application_stages
- stage_requirements
- document_types
- student_documents
- document_verifications

### Payments

- payment_stages
- payments
- payment_webhook_events

### Universities

- universities
- university_courses
- student_universities

### Letters and Visa

- letters
- visa_centers
- visa_checklists

### System

- notifications
- audit_logs
- settings

### AI

- ai_requests
- ai_document_results
- ai_validation_flags

---

## 9. API Design Rules

Use REST APIs for V1.

Recommended route patterns:

```txt
/api/auth/*
/api/students/*
/api/applications/*
/api/documents/*
/api/payments/*
/api/universities/*
/api/letters/*
/api/visa-support/*
/api/reports/*
/api/settings/*
```

NestJS AI routes (V2 if FastAPI is added later):

```txt
/health
/ai/documents/process
/ai/documents/classify
/ai/documents/extract
/ai/documents/validate
```

---

## 10. Frontend Guidelines

## 10.1 Next.js App Structure

Recommended structure:

```txt
app/
  auth/
  student/
    dashboard/
    documents/
    payments/
    letters/
    visa-support/
  admin/
    dashboard/
    students/
    applications/
    documents/
    payments/
    universities/
    reports/
    settings/
components/
lib/
hooks/
services/
types/
```

## 10.2 UI Rules

- Use Tailwind CSS.
- Use shadcn/ui for consistent components.
- Use React Hook Form for forms.
- Use Zod for frontend validation.
- Use TanStack Query for API data fetching.
- Use TanStack Table for admin data tables.
- Keep mobile responsive design mandatory.

## 10.3 UX Rules

Student dashboard should clearly show:

- Current stage
- Required actions
- Pending documents
- Pending payments
- Locked/unlocked sections
- Admin remarks

Admin dashboard should prioritize:

- Pending verifications
- Payment approvals
- Stage-wise student counts
- Recent activity

---

## 11. Security Rules

- Never expose private file URLs.
- Use signed URLs for temporary access.
- Validate role and ownership on backend.
- Verify Razorpay webhook signatures.
- Hash passwords securely.
- Store secrets only in environment variables.
- Add audit logs for admin actions.
- Do not log sensitive documents or full payment secrets.
- Rate-limit login and OTP endpoints.
- Sanitize user input.

---

## 12. Testing Guidelines

Minimum testing expectations:

## 12.1 Backend

- Unit tests for services
- Integration tests for key APIs
- Payment webhook tests
- Role access tests
- Stage transition tests

## 12.2 Frontend

- Component tests for critical forms
- Flow tests for student application submission
- Admin document verification flow
- Payment status display

## 12.3 AI Module

- Test AI endpoints
- Test empty/invalid file handling
- Test structured response format
- Test timeout/error behavior

---

## 13. Environment Variables

Do not hardcode these values.

Expected variables:

```txt
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_BUCKET_NAME=
ZEPTOMAIL_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=
OPENROUTER_API_KEY=
AI_DEFAULT_MODEL=amazon/nova-lite-v1
```

---

## 14. Definition of Done

A feature is complete only when:

- API is implemented.
- Validation is implemented.
- Authorization is implemented.
- Error handling is implemented.
- UI state is handled.
- Loading and empty states exist.
- Audit logs are added for sensitive actions.
- Tests are added where applicable.
- Documentation or comments are added for non-obvious logic.

---

## 15. Things Agents Must Avoid

Do not:

- Put AI business logic inside FastAPI in V1 — keep everything in NestJS.
- Hardcode payment amounts in frontend.
- Hardcode document requirements in frontend.
- Expose S3 public URLs.
- Trust frontend role checks.
- Skip Razorpay webhook verification.
- Build full LMS in V1 unless explicitly requested.
- Build complex microservices before the modular monolith is stable.
- Auto-approve documents based only on AI output in V1.

---

## 16. Preferred Implementation Order

1. Auth and roles
2. User/student profile
3. Application stages
4. Document upload and verification
5. Payment integration
6. Admission and invitation letters
7. Visa support
8. Reports
9. AI module in NestJS (Vercel AI SDK + OpenRouter)
10. QA and deployment

---

## 17. Final Agent Instruction

When making changes, always preserve the product direction:

```txt
Core platform = NestJS
AI workflows = NestJS
User interface = Next.js
Database = PostgreSQL
Files = Private object storage
Payments = Razorpay webhook-driven
```

Prioritize correctness, security, maintainability, and clear business workflows over premature optimization.

---

## 18. Semble Code Search

This repository uses [Semble](https://github.com/MinishLab/semble) for fast and accurate code search. Semble is configured as an MCP server.

### Available Tools

- `semble_search` - Search the codebase with natural language queries
- `semble_find_related` - Find code related to a specific location

### Usage Examples

```
// Search for authentication handling
"How is authentication handled?"

// Find related code
find_related: src/auth/service.ts:42

// Search with top-k results
"payment gateway integration", top_k: 10
```

### CLI Usage

```bash
# Search local repo
semble search "authentication flow" ./apps/api

# Find related code
semble find-related src/auth/service.ts 42 ./apps/api

# View token savings
semble savings
```

### Notes
- Semble indexes automatically on first search
- Indexes are cached and updated on file changes
- Uses ~98% fewer tokens than grep+read
- Runs entirely on CPU with no API keys required

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. When the answer is under a Markdown heading, `graphify section "<heading>"` prints that section's text, so the .md need not be opened. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
