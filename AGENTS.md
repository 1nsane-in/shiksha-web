# AGENTS.md

# AI Agent Operating Guide

This file defines how AI coding agents, automation agents, and developer assistants should work inside this repository.

Project: Medical Admission Management Platform  
Architecture: Next.js + NestJS + FastAPI + PostgreSQL  
Primary Rule: Keep business workflows in NestJS and AI workflows in FastAPI.

---

## 1. Product Context

This project is a medical admission management platform for students, admins, and agents. The system manages:

- Student registration and dashboard
- Stage-wise admission application
- Document upload and verification
- Multi-stage payments
- Admission letter and invitation letter access
- Visa support
- Agent allocation and commission tracking
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
- Agent commission logic
- University management
- Letter access control
- Visa support
- Notifications
- Reports
- Audit logs
- Settings

## 2.2 AI Service

Use FastAPI for AI-related features only.

FastAPI owns:

- OCR
- Document classification
- Field extraction
- AI document validation
- Application summaries
- Recommendation logic
- LLM-based assistance

FastAPI should not directly own core business rules such as student stage changes, payment approvals, or commission settlement.

## 2.3 Frontend

Use Next.js for:

- Student dashboard
- Admin dashboard
- Agent dashboard
- Authentication screens
- Application tracker
- Document upload screens
- Payment screens
- Reports UI

---

## 3. Repository Structure

Recommended structure:

```txt
/apps
  /web                 # Next.js frontend
  /api                 # NestJS main backend
  /ai-service          # FastAPI AI service

/packages
  /shared-types        # Shared TypeScript types if needed
  /ui                  # Optional shared UI components
  /config              # Shared lint/prettier/tsconfig

/docs
  PRD_Medical_Admission_Platform.md
  API.md
  DATABASE.md
  SECURITY.md
  DEPLOYMENT.md
```

If the repository is not a monorepo, keep equivalent separation using separate folders or services.

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

## 4.3 Python Rules

- Use type hints.
- Use Pydantic models for request/response validation.
- Keep AI logic separated from API routing.
- Long-running AI tasks should be asynchronous or queue-based.
- Do not let AI service directly mutate core business state unless explicitly routed through NestJS.

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

## 5.5 Agent Commission

V1 commission logic should remain simple.

Rules:

- Admin assigns students to agents.
- Commission is generated/tracked based on configured rules.
- Admin can mark commission as pending, approved, paid, on hold, or cancelled.
- Do not build complex wallet withdrawal flow in V1 unless explicitly required.

## 5.6 Secure File Viewing

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
agents
commissions
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
- Commission generation
- Letter access checks

## 6.4 Authorization Rules

Use guards for:

- JWT authentication
- Role checks
- Ownership checks
- Admin-only actions
- Agent-student relationship checks

Never rely only on frontend restrictions.

---

## 7. FastAPI AI Service Guidelines

Recommended structure:

```txt
ai_service/
  main.py
  api/
    routes_documents.py
    routes_health.py
  services/
    ocr_service.py
    classification_service.py
    validation_service.py
    summary_service.py
  schemas/
    document.py
    ai_result.py
  core/
    config.py
    logging.py
  workers/
    document_worker.py
```

## 7.1 AI Service Rules

- Keep endpoints small.
- Put business-independent AI logic in services.
- Return structured JSON responses.
- Include confidence score where relevant.
- Do not auto-approve documents in V1.
- Treat AI results as assistant suggestions for admins.

## 7.2 AI Result Format

AI document validation should return a structure similar to:

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

### Agents

- agents
- agent_student_assignments
- commission_rules
- commissions

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

- ai_jobs
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
/api/agents/*
/api/commissions/*
/api/universities/*
/api/letters/*
/api/visa-support/*
/api/reports/*
/api/settings/*
```

FastAPI routes:

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
  agent/
    dashboard/
    students/
    commissions/
  admin/
    dashboard/
    students/
    applications/
    documents/
    payments/
    agents/
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
- Agent commission pending

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

## 12.3 AI Service

- Test document processing endpoints
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
S3_BUCKET_NAME=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=
S3_ENDPOINT=
REDIS_URL=
EMAIL_PROVIDER_API_KEY=
AI_SERVICE_URL=
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

- Put AI business logic inside NestJS unless it is only orchestration.
- Let FastAPI directly approve applications/payments.
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
8. Agent allocation and commission tracking
9. University management
10. Reports
11. FastAPI AI document service
12. QA and deployment

---

## 17. Final Agent Instruction

When making changes, always preserve the product direction:

```txt
Core platform = NestJS
AI workflows = FastAPI
User interface = Next.js
Database = PostgreSQL
Files = Private object storage
Payments = Razorpay webhook-driven
```

Prioritize correctness, security, maintainability, and clear business workflows over premature optimization.
