# Product Requirements Document (PRD)

# Medical Admission Management Platform

**Version:** 1.0  
**Prepared for:** Product & Engineering Team  
**Recommended Architecture:** Next.js + NestJS + FastAPI + PostgreSQL  
**Primary Goal:** Build a secure, stage-wise student admission management platform with admin, student, and agent workflows, plus AI-assisted document intelligence.

---

## 1. Executive Summary

The Medical Admission Management Platform is a web-based system designed to digitize and manage the end-to-end medical admission journey for students. The platform will support student registration, document upload, document verification, multi-stage payments, admission/exam dashboards, invitation letter access control, visa support, agent commission tracking, and university management.

The platform will be built as a modular monolith for V1 with a separate AI service for document intelligence and future AI features. The main business backend will be built using NestJS, while AI capabilities such as OCR, document classification, field extraction, validation, summarization, and recommendation logic will be handled through a FastAPI service.

---

## 2. Product Vision

To create a reliable, transparent, and scalable admission management platform that reduces manual operations, improves student visibility, centralizes admission data, supports agent-driven admissions, and enables AI-assisted document verification.

---

## 3. Business Objectives

1. Digitize the complete student admission workflow.
2. Reduce manual tracking of documents, payments, agents, and universities.
3. Provide students with a clear dashboard showing application progress.
4. Enable admins to verify documents, manage stages, upload letters, and control access.
5. Track agent-wise student allocation and commission status.
6. Maintain university and course information in a centralized admin module.
7. Introduce AI-assisted validation for documents and student application summaries.
8. Keep LMS as an optional add-on module for future expansion.

---

## 4. Recommended Tech Stack

### 4.1 Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query
- TanStack Table

### 4.2 Main Backend

- NestJS
- TypeScript
- REST APIs
- Prisma ORM
- JWT Authentication
- Refresh Tokens
- Role-Based Access Control
- Swagger/OpenAPI

### 4.3 AI Backend

- FastAPI
- Python
- Pydantic
- OCR/document extraction libraries
- LLM integration layer
- AI validation APIs

### 4.4 Database

- PostgreSQL

### 4.5 File Storage

- AWS S3 or Cloudflare R2
- Private bucket
- Signed URLs
- Watermarked previews

### 4.6 Queue and Background Jobs

- Redis
- BullMQ for NestJS jobs
- Celery/RQ optional for Python-side AI jobs

### 4.7 Payments

- Razorpay
- Webhook verification
- Manual payment approval option

### 4.8 Deployment

- Frontend: Vercel
- NestJS Backend: AWS App Runner / Render / DigitalOcean / ECS
- FastAPI Service: AWS App Runner / Render / ECS
- Database: AWS RDS / Neon / Supabase / DigitalOcean PostgreSQL
- Storage: AWS S3 / Cloudflare R2

---

## 5. Product Scope

## 5.1 V1 Scope — Core Platform

V1 will include:

- Student registration and login
- Email/mobile OTP verification
- Student dashboard
- Admin dashboard
- Agent dashboard
- Document upload and verification
- Multi-stage payment workflow
- Admission letter module
- Exam dashboard
- Invitation letter access control
- Visa support module
- Agent registration and student allocation
- Basic commission tracking
- Medical university management
- Reports and exports
- Notifications
- Secure file access
- AI-assisted document validation

## 5.2 V1.5 Scope — Automation Layer

- Improved AI document validation
- More detailed admin analytics
- Automated commission calculation
- WhatsApp/SMS notifications
- Advanced report exports
- Student support ticketing
- Watermarked document preview service

## 5.3 V2 Scope — Expansion Layer

- LMS module
- Mobile application
- University portal
- Faculty panel
- Advanced AI admission assistant
- AI university recommendation engine
- Multi-country/multi-currency support
- Advanced wallet settlement
- CRM integration

---

## 6. User Roles

## 6.1 Super Admin

Can manage the entire system, including users, settings, stages, payments, documents, agents, commissions, universities, reports, and access controls.

## 6.2 Admin / Operations

Can manage students, verify documents, update application statuses, upload admission/invitation letters, manage exam dates, manage visa support, and view reports.

## 6.3 Student

Can register, complete profile, upload documents, make payments, view application progress, access admission/exam details, view invitation letter based on eligibility, and access visa support after final payment.

## 6.4 Agent

Can log in, view assigned students, track student progress, and view commission status.

## 6.5 Optional Future Roles

- Finance Team
- Document Verification Team
- Faculty
- University Admin
- Counselor

---

## 7. Student Admission Workflow

## 7.1 Stage 1 — Initial Admission Application

### Student Inputs

- Passport or Aadhaar Card
- 12th Marksheet
- NEET Result
- Payment: ₹10,000

### Admin Actions

- Review profile
- Verify documents
- Approve/reject documents
- Approve payment if manual payment is used
- Move student to Stage 2

### System Rules

- Student cannot move to Stage 2 until Stage 1 documents and payment are approved.
- Rejected documents require admin remarks.
- Student can re-upload rejected documents.

---

## 7.2 Stage 2 — Entrance Exam Process

### Student Inputs

- Passport, notarized and translated
- 12th Marksheet, notarized and translated
- NEET Result
- Payment: ₹5,000

### Admin Actions

- Verify translated/notarized documents
- Update eligibility status
- Unlock exam dashboard after approval

### System Rules

- Exam dashboard remains locked until Stage 2 is approved.
- Stage 2 payment must be successful or manually approved.

---

## 7.3 Stage 3 — Admission Letter and Exam Dashboard

### Student Access

- Admission letter
- Exam dates
- Exam instructions
- Eligibility status

### Admin Actions

- Upload admission letter
- Add exam dates
- Add exam instructions
- Update exam status

### System Rules

- Admission letter is visible only after admin upload.
- Only eligible students can view this section.
- Student receives notification when admission letter is uploaded.

---

## 7.4 Stage 4 — Invitation Letter Process

### Student Access

- Invitation letter preview, if enabled
- Final payment status
- Restricted access message before payment

### Payment

- Final Payment: ₹5,000

### Admin Actions

- Upload invitation letter
- Enable/disable preview
- Unlock download after final payment

### System Rules

- Before final payment, the student may only see a restricted/watermarked preview if enabled.
- After final payment approval, student can access/download the invitation letter based on admin settings.
- System should track document view and download logs.
- Screenshot prevention cannot be guaranteed; watermarking and access logs should be used.

---

## 7.5 Stage 5 — Visa Support Module

### Student Access

- Visa center list
- Consultancy/company details
- Visa document checklist
- Country-wise instructions
- Contact details

### Admin Actions

- Add visa centers
- Add consultancy details
- Upload visa guidance content
- Configure country-wise checklist

### System Rules

- Visa support unlocks only after final payment approval.

---

## 8. Functional Requirements

## 8.1 Authentication and User Management

| ID | Requirement | Priority |
|---|---|---|
| AUTH-001 | User can register/login based on role | Must Have |
| AUTH-002 | System supports JWT access tokens and refresh tokens | Must Have |
| AUTH-003 | System supports OTP verification | Must Have |
| AUTH-004 | Passwords must be hashed securely | Must Have |
| AUTH-005 | Role-based access control must restrict module access | Must Have |
| AUTH-006 | Admin can activate/deactivate users | Should Have |

## 8.2 Student Module

| ID | Requirement | Priority |
|---|---|---|
| STU-001 | Student can complete profile | Must Have |
| STU-002 | Student can view application stage tracker | Must Have |
| STU-003 | Student can upload documents stage-wise | Must Have |
| STU-004 | Student can view document approval/rejection status | Must Have |
| STU-005 | Student can make stage-wise payments | Must Have |
| STU-006 | Student can view payment history | Must Have |
| STU-007 | Student can view admission letter if eligible | Must Have |
| STU-008 | Student can view exam dashboard if eligible | Must Have |
| STU-009 | Student can view invitation letter after final payment | Must Have |
| STU-010 | Student can access visa support after final payment | Must Have |

## 8.3 Admin Module

| ID | Requirement | Priority |
|---|---|---|
| ADM-001 | Admin can manage students | Must Have |
| ADM-002 | Admin can verify/reject documents | Must Have |
| ADM-003 | Admin can manage application stages | Must Have |
| ADM-004 | Admin can view and manage payments | Must Have |
| ADM-005 | Admin can upload admission and invitation letters | Must Have |
| ADM-006 | Admin can manage exam dates | Must Have |
| ADM-007 | Admin can manage agents | Must Have |
| ADM-008 | Admin can assign students to agents | Must Have |
| ADM-009 | Admin can manage universities | Must Have |
| ADM-010 | Admin can configure documents and stage requirements | Should Have |
| ADM-011 | Admin can view reports | Must Have |
| ADM-012 | Admin can manage visa support content | Must Have |

## 8.4 Document Module

| ID | Requirement | Priority |
|---|---|---|
| DOC-001 | Student can upload PDF/JPG/PNG documents | Must Have |
| DOC-002 | System validates file type and size | Must Have |
| DOC-003 | Admin can approve/reject documents | Must Have |
| DOC-004 | Admin can add rejection remarks | Must Have |
| DOC-005 | Student can re-upload rejected documents | Must Have |
| DOC-006 | Documents are stored in private object storage | Must Have |
| DOC-007 | System uses signed URLs for secure access | Must Have |
| DOC-008 | System tracks document view/download logs | Should Have |
| DOC-009 | AI service can process document for OCR and validation | Should Have |

## 8.5 Payment Module

| ID | Requirement | Priority |
|---|---|---|
| PAY-001 | Student can make stage-wise payment | Must Have |
| PAY-002 | Razorpay checkout integration is supported | Must Have |
| PAY-003 | Razorpay webhook verification is implemented | Must Have |
| PAY-004 | Payment statuses are tracked | Must Have |
| PAY-005 | Admin can manually approve offline payments | Should Have |
| PAY-006 | Student can view receipts/payment history | Should Have |
| PAY-007 | Payment amount is configurable by admin | Should Have |

## 8.6 Agent and Commission Module

| ID | Requirement | Priority |
|---|---|---|
| AGT-001 | Agent can register/login | Must Have |
| AGT-002 | Admin can assign students to agents | Must Have |
| AGT-003 | Agent can view assigned students | Must Have |
| AGT-004 | Agent can track student stage progress | Must Have |
| AGT-005 | Admin can configure fixed/percentage commission | Should Have |
| AGT-006 | Agent can view commission status | Must Have |
| AGT-007 | Admin can mark commission as pending/paid/on hold | Must Have |
| AGT-008 | Agent wallet/withdrawal request | Later |

## 8.7 University Management Module

| ID | Requirement | Priority |
|---|---|---|
| UNI-001 | Admin can add/edit/delete universities | Must Have |
| UNI-002 | Admin can categorize universities by country | Must Have |
| UNI-003 | Admin can add course details | Must Have |
| UNI-004 | Admin can manage fees, duration, and eligibility | Must Have |
| UNI-005 | Admin can map students to universities | Must Have |
| UNI-006 | Seat availability tracking | Should Have |
| UNI-007 | University document requirements | Later |

## 8.8 AI Service Requirements

| ID | Requirement | Priority |
|---|---|---|
| AI-001 | AI service accepts document processing jobs | Should Have |
| AI-002 | AI extracts text from uploaded documents | Should Have |
| AI-003 | AI classifies document type | Should Have |
| AI-004 | AI identifies missing/unclear fields | Should Have |
| AI-005 | AI detects possible name/date mismatch | Later |
| AI-006 | AI generates application summary for admin | Later |
| AI-007 | AI recommends universities based on eligibility and budget | Later |
| AI-008 | AI-powered student assistant/chatbot | Later |

---

## 9. Non-Functional Requirements

## 9.1 Security

- Passwords must be hashed.
- JWT tokens must be short-lived.
- Refresh tokens must be securely stored and revocable.
- Sensitive documents must be stored in private storage.
- Direct public file URLs must not be exposed.
- Role-based access must be enforced on API and UI.
- Payment webhooks must be verified.
- Admin actions must be logged.
- Audit logs must exist for document, payment, and access changes.

## 9.2 Performance

- Dashboard pages should load efficiently.
- Document uploads should support large files within configured limits.
- Heavy AI processing should run asynchronously.
- Reports should use pagination and filtering.

## 9.3 Scalability

- V1 should be a modular monolith.
- AI processing should be isolated in FastAPI.
- Queue-based job handling should be used for OCR/AI tasks.
- Database schema should support future LMS and mobile app.

## 9.4 Reliability

- Payment status should not depend only on frontend success callback.
- Razorpay webhooks should be the source of truth for payment confirmation.
- AI failure should not block core admission workflow.
- Document upload failures should be retryable.

## 9.5 Compliance and Privacy

- Student consent should be collected for document processing.
- Uploaded documents should have access restrictions.
- Admin access to sensitive documents should be logged.
- Data deletion/export policy should be planned.

---

## 10. Recommended System Architecture

```txt
Next.js Frontend
    ├── Student Dashboard
    ├── Agent Dashboard
    └── Admin Dashboard

NestJS Main Backend
    ├── Auth Module
    ├── User Module
    ├── Student/Application Module
    ├── Document Module
    ├── Payment Module
    ├── Agent/Commission Module
    ├── University Module
    ├── Letter Module
    ├── Visa Support Module
    ├── Notification Module
    ├── Reports Module
    └── Settings Module

FastAPI AI Service
    ├── OCR
    ├── Document Classification
    ├── Field Extraction
    ├── Validation
    └── Summarization/Recommendation APIs

Shared Infrastructure
    ├── PostgreSQL
    ├── Redis Queue
    ├── S3/Cloudflare R2
    ├── Razorpay
    └── Email Provider
```

---

## 11. API Boundary

## 11.1 NestJS Owns

- Authentication
- Authorization
- Business workflows
- Database writes
- Payment confirmation
- Student stages
- Agent commissions
- University mapping
- Notifications
- Audit logs

## 11.2 FastAPI Owns

- AI processing
- OCR
- Document classification
- Field extraction
- AI validation
- AI summaries
- AI recommendations

## 11.3 Communication Pattern

Preferred pattern:

```txt
NestJS creates job -> Queue -> FastAPI processes -> FastAPI sends result -> NestJS stores result
```

Alternative pattern for simple MVP:

```txt
NestJS calls FastAPI REST endpoint directly
```

---

## 12. Suggested Database Tables

### Core Tables

- users
- roles
- user_roles
- students
- agents
- applications
- application_stages
- stage_requirements
- document_types
- student_documents
- document_verifications
- payments
- payment_stages
- universities
- university_courses
- student_universities
- letters
- visa_centers
- visa_checklists
- commissions
- notifications
- audit_logs
- settings

### AI Tables

- ai_jobs
- ai_document_results
- ai_validation_flags
- ai_extraction_fields

### Future Tables

- lms_courses
- lms_subjects
- lms_materials
- mock_tests
- test_results
- certificates
- wallet_transactions
- support_tickets

---

## 13. Status Definitions

## 13.1 Application Stage Status

- NOT_STARTED
- DOCUMENTS_PENDING
- PAYMENT_PENDING
- UNDER_REVIEW
- APPROVED
- REJECTED
- REUPLOAD_REQUIRED
- LOCKED
- UNLOCKED

## 13.2 Document Status

- NOT_UPLOADED
- UPLOADED
- UNDER_REVIEW
- APPROVED
- REJECTED
- REUPLOAD_REQUIRED

## 13.3 Payment Status

- PENDING
- SUCCESS
- FAILED
- REFUNDED
- MANUALLY_APPROVED

## 13.4 Commission Status

- PENDING
- APPROVED
- PAID
- ON_HOLD
- CANCELLED

---

## 14. Dashboard Requirements

## 14.1 Student Dashboard

Must show:

- Profile completion
- Application stage tracker
- Required documents
- Document statuses
- Payment statuses
- Admission letter section
- Exam dashboard
- Invitation letter section
- Visa support section
- Notifications

## 14.2 Admin Dashboard

Must show:

- Total students
- Pending document verifications
- Stage-wise student count
- Payment summary
- Pending manual approvals
- Agent-wise student count
- Pending commissions
- University-wise mapping
- Recent activities

## 14.3 Agent Dashboard

Must show:

- Assigned students
- Student stage status
- Payment progress visibility
- Commission status
- Paid/pending commission summary

---

## 15. Reports

## 15.1 Student Reports

- Total students
- Stage-wise students
- Pending documents
- Rejected documents
- University-wise students
- Country-wise students

## 15.2 Payment Reports

- Stage-wise payments
- Pending payments
- Successful payments
- Failed payments
- Manual approvals
- Refunds, if applicable

## 15.3 Agent Reports

- Agent-wise student count
- Agent-wise commission
- Paid commission
- Pending commission
- Settlement history

## 15.4 University Reports

- University-wise student mapping
- Country-wise admissions
- Course-wise student count
- Seat availability, if enabled

---

## 16. Security Notes for Secure File Viewing

The platform should restrict downloads and public access wherever possible. However, complete screenshot blocking cannot be guaranteed on web/mobile platforms. The recommended approach is:

- Use watermarked previews.
- Disable download before final payment.
- Disable print and right-click where technically feasible.
- Use private storage.
- Use temporary signed URLs.
- Track view/download logs.
- Display student name, ID, timestamp, and application ID as watermark.

---

## 17. Milestones

## Milestone 1 — Foundation

- Repository setup
- Next.js frontend setup
- NestJS backend setup
- PostgreSQL + Prisma setup
- Auth module
- Role-based access
- Basic admin/student layouts

## Milestone 2 — Student Application Workflow

- Student profile
- Application stages
- Document requirements
- Document upload
- Document verification
- Stage status tracker

## Milestone 3 — Payments

- Razorpay checkout
- Payment table
- Webhook verification
- Payment-stage unlock rules
- Manual approval option

## Milestone 4 — Letters and Visa Support

- Admission letter upload/view
- Exam dashboard
- Invitation letter restricted preview/download
- Visa support content

## Milestone 5 — Agent and University Modules

- Agent login
- Student allocation
- Commission tracking
- University CRUD
- Student-university mapping

## Milestone 6 — AI Service MVP

- FastAPI service setup
- AI job table
- OCR/document extraction endpoint
- Document classification
- AI results visible to admin

## Milestone 7 — Reports, QA, Deployment

- Basic reports
- Exports
- Audit logs
- Security testing
- Deployment

---

## 18. Risks and Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| LMS scope creep | High | Keep LMS out of V1 |
| Screenshot prevention expectation | Medium | Use watermarking and clear limitation |
| Payment mismatch | High | Use webhook as source of truth |
| Commission disputes | Medium | Keep admin-controlled commission approval in V1 |
| AI errors in document validation | Medium | AI should assist, not auto-approve in V1 |
| Admin panel complexity | Medium | Keep V1 workflows simple and configurable |
| File security | High | Use private buckets and signed URLs |

---

## 19. MVP Acceptance Criteria

The MVP is considered complete when:

1. Students can register, upload documents, and complete stage-wise payments.
2. Admin can verify/reject documents and control stage progression.
3. Admin can upload admission and invitation letters.
4. Student access to letters and visa support is controlled by payment/stage status.
5. Agents can view assigned students and commission status.
6. Admin can manage universities and map students.
7. Payments are tracked through Razorpay webhooks.
8. Documents are stored securely in private object storage.
9. AI service can process uploaded documents and return basic extraction/validation results.
10. Basic reports are available for students, payments, agents, and universities.

---

## 20. Final Recommendation

Build V1 as:

```txt
Admission CRM + Student Dashboard + Admin Panel + Agent Tracking + University Management + Payment Workflow + AI Document Assistance
```

Use:

```txt
Next.js + NestJS + FastAPI + PostgreSQL + Prisma + Redis + S3 + Razorpay
```

Keep LMS, mobile app, WhatsApp automation, advanced AI recommendations, and university portal for future phases.
