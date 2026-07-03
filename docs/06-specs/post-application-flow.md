# Post-Application Flow: Complete Admission Pipeline & Tracking System

> **Status:** Draft  
> **Target Students:** Indian MBBS students applying to foreign universities (Russia, Kyrgyzstan, Kazakhstan, Uzbekistan, etc.)  
> **Version:** 1.0

---

## 1. Goal

Design the complete admission pipeline that activates **after** a student submits their university application (which is already implemented). This covers:

1. University review & admission letter generation
2. Payment stage 1 (₹5,000) to confirm admission
3. Entrance exam registration with document submission
4. Payment stage 2 (₹10,000) for exam processing
5. Invitation letter generation after exam clearing
6. Visa support and ticket support

Plus a **Flipkart/Myntra-style delivery tracking system** so students can visually see where their application stands.

---

## 2. Success Criteria

| Criteria | Description |
|----------|-------------|
| **Functional** | Complete stage progression from application submission → visa support |
| **Tracking** | Student can see a visual timeline of their application at any point |
| **Payments** | Both ₹5,000 (admission confirmation) and ₹10,000 (exam fee) are collected via Razorpay |
| **Documents** | Students can upload exam-specific documents (passport, 12th marks, notarized & translated) |
| **Letters** | Admission letters and invitation letters are stored securely with access control |
| **Notifications** | Email notifications sent at each stage transition |
| **Non-functional** | All stages remain configurable via `StageRequirement` table; no hardcoded stage logic in frontend |

---

## 3. Assumptions

- The Razorpay integration is already set up (payment model exists, webhook infrastructure exists).
- Document storage (Cloudflare R2/S3) is already configured.
- Email sending (ZeptoMail) is configured.
- The student's `currentStage` field (1–5) exists on the `Student` model.
- The `ApplicationStatus` enum already covers stage-level statuses.
- The user is role-based: `STUDENT`, `ADMIN`, `SUPER_ADMIN`.
- University "admins" are not a separate role yet — all university review actions are done by platform `ADMIN`/`SUPER_ADMIN`.

---

## 4. Current State

### What Already Exists

| Component | Status | Details |
|-----------|--------|---------|
| **University browsing** | ✅ Done | Public endpoints, pagination, filters |
| **University application** | ✅ Done | `POST /student/apply`, `GET /student/applications` |
| **Student model** | ✅ Done | Tracks `currentStage` (1–5), `applicationStatus` |
| **Stage requirements** | ✅ Done | `StageRequirement` model with configurable docs & payment |
| **Document types** | ✅ Done | `DocumentType` model with stage mapping |
| **Student documents** | ✅ Done | Upload, verify, re-upload flow |
| **Payment model** | ✅ Done | Razorpay integration, webhook verification |
| **AdmissionLetter model** | ✅ Done | Schema exists, module is empty |
| **InvitationLetter model** | ✅ Done | Schema exists, module is empty |
| **VisaCenter / VisaChecklist** | ✅ Done | Schema exists, module is empty |
| **Letters module** | ❌ Empty | Directory exists, no service/controller |
| **Payments module** | ❌ Empty | Directory exists, no service/controller |
| **Exam flow** | ❌ Missing | No exam registration or document submission |
| **Tracking/timeline** | ❌ Missing | No visual progress tracking |
| **Email notifications** | ❌ Not wired | No stage-based email triggers |

### ApplicationStatus Enum (Current)

```
NOT_STARTED
STAGE_1_PENDING → STAGE_1_IN_REVIEW → STAGE_1_APPROVED
STAGE_2_PENDING → STAGE_2_IN_REVIEW → STAGE_2_APPROVED
STAGE_3_ACTIVE
STAGE_4_PENDING → STAGE_4_APPROVED
STAGE_5_UNLOCKED
COMPLETED
REJECTED
```

---

## 5. Proposed Design

### 5.1 Stage Mapping (Reconciled)

The user's actual workflow maps to the existing stage system as follows:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     COMPLETE ADMISSION PIPELINE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Stage 1: INITIAL APPLICATION (ALREADY IMPLEMENTED)                  │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Student fills application form → submitted to university     │   │
│  │ Admin/University reviews → approves or rejects               │   │
│  │ Application visible in university portal                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  Stage 2: ADMISSION LETTER & PAYMENT (₹5,000)                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Admin uploads Admission Letter PDF → system stores it        │   │
│  │ Email sent to student with Admission Letter attached          │   │
│  │ Student views letter in platform                             │   │
│  │ Student pays ₹5,000 to confirm acceptance                    │   │
│  │ → On success: Stage 2 marked APPROVED                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  Stage 3: ENTRANCE EXAM                                           │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ University provides exam dates → stored in system            │   │
│  │ Email sent with exam schedule                                │   │
│  │ Student uploads exam docs (passport, 12th, notarized)        │   │
│  │ Student pays ₹10,000 exam fee                                │   │
│  │ Student appears for exam (offline system tracking)           │   │
│  │ University declares result → admin updates status            │   │
│  │ → On pass: Stage 3 marked APPROVED                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  Stage 4: INVITATION LETTER                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Admin uploads Invitation Letter PDF                          │   │
│  │ Email sent with Invitation Letter attached                   │   │
│  │ Student can view/download in platform                        │   │
│  │ → Stage 4 marked APPROVED                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  Stage 5: VISA SUPPORT & TICKET SUPPORT                           │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Visa checklist visible to student                            │   │
│  │ Visa center information available                            │   │
│  │ Student can raise support tickets                            │   │
│  │ → Stage 5 UNLOCKED                                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│                     COMPLETED                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Data Model Changes Required

#### New Models

```prisma
/// Tracks exam-related information for a student's application
model ExamRecord {
  id                  String          @id @default(uuid())
  applicationId       String          @unique
  studentId           String
  examDate            DateTime?
  examSubject         String?         // e.g., "Biology", "Chemistry", "General Medicine"
  examCenter          String?
  result              ExamResult?     // PASSED, FAILED, AWAITED
  resultDeclaredAt    DateTime?
  resultRemarks       String?
  attemptNumber       Int             @default(1)
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt
  application         UniversityApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  student             Student         @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@index([studentId])
  @@index([applicationId])
}

/// Tracks the application journey timeline events
model ApplicationTimeline {
  id              String   @id @default(uuid())
  applicationId   String
  studentId       String
  stage           Int
  event           String   // e.g., "application_submitted", "admission_letter_uploaded", "payment_received"
  title           String   // Human-readable title for the timeline card
  description     String?  // Optional extra detail
  metadata        Json?    // Extra data (amount, fileUrl, etc.)
  occurredAt      DateTime @default(now())
  application     UniversityApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  student         Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@index([applicationId, stage])
  @@index([studentId])
  @@index([occurredAt])
}

/// Support tickets for visa & general queries
model SupportTicket {
  id              String              @id @default(uuid())
  studentId       String
  applicationId   String?
  category        TicketCategory      @default(GENERAL)  // VISA, DOCUMENTS, PAYMENT, GENERAL
  subject         String
  description     String
  status          TicketStatus        @default(OPEN)
  priority        TicketPriority      @default(MEDIUM)
  assignedTo      String?
  resolvedAt      DateTime?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  student         Student             @relation(fields: [studentId], references: [id], onDelete: Cascade)
  messages        SupportTicketMessage[]
  application     UniversityApplication? @relation(fields: [applicationId], references: [id], onDelete: SetNull)

  @@index([studentId])
  @@index([status])
  @@index([category])
}

model SupportTicketMessage {
  id          String        @id @default(uuid())
  ticketId    String
  senderId    String
  senderRole  String        // STUDENT, ADMIN
  message     String
  attachments String[]      // File URLs
  createdAt   DateTime      @default(now())
  ticket      SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  @@index([ticketId])
}
```

#### New Enums

```prisma
enum ExamResult {
  AWAITED
  PASSED
  FAILED
}

enum TicketCategory {
  VISA
  DOCUMENTS
  PAYMENT
  ADMISSION_LETTER
  INVITATION_LETTER
  EXAM
  GENERAL
}
```

### 5.3 API Design

#### Stage 2: Admission Letter & Payment (₹5,000)

```
── ADMISSION LETTER ──

POST   /admin/applications/:id/admission-letter        Upload admission letter
GET    /student/applications/:id/admission-letter       View my admission letter
PUT    /admin/applications/:id/admission-letter         Update/replace letter

── PAYMENT ──

POST   /student/payments/create-order                   Create Razorpay order for ₹5,000
       Body: { applicationId, stage: 2 }
POST   /payments/razorpay-webhook                       Razorpay webhook (already exists?)
GET    /student/payments                                My payments history

── ADMIN APPROVAL ──

PUT    /admin/applications/:id/stage/complete           Mark stage 2 as complete
       Body: { stage: 2, status: "approved" }
```

#### Stage 3: Entrance Exam

```
── EXAM DATES ──

POST   /admin/applications/:id/exam                     Set/create exam record
       Body: { examDate, examSubject, examCenter }
GET    /student/applications/:id/exam                   View my exam details
PUT    /admin/applications/:id/exam                     Update exam details
PUT    /admin/applications/:id/exam/result              Declare exam result
       Body: { result: "PASSED" | "FAILED", remarks? }

── EXAM DOCUMENTS ──

GET    /student/applications/:id/exam-documents         List required exam docs
POST   /student/applications/:id/exam-documents         Upload exam-specific docs
       (Passport, 12th Marksheet, Notarized & Translated copies)
GET    /admin/applications/:id/exam-documents           View exam documents for verification

── PAYMENT ──

POST   /student/payments/create-order                   Create Razorpay order for ₹10,000
       Body: { applicationId, stage: 3 }
```

#### Stage 4: Invitation Letter

```
POST   /admin/applications/:id/invitation-letter        Upload invitation letter
GET    /student/applications/:id/invitation-letter       View my invitation letter
```

#### Stage 5: Visa Support & Tickets

```
── VISA ──

GET    /student/visa/checklist                          Get visa requirements for my country
GET    /student/visa/centers                            Get visa processing centers

── SUPPORT TICKETS ──

POST   /student/tickets                                 Create support ticket
GET    /student/tickets                                 My tickets
GET    /student/tickets/:id                             Ticket detail with messages
POST   /student/tickets/:id/messages                    Add message to ticket
GET    /admin/tickets                                   All tickets (admin view)
PUT    /admin/tickets/:id/assign                        Assign ticket to admin
PUT    /admin/tickets/:id/status                        Update ticket status
POST   /admin/tickets/:id/messages                      Admin reply to ticket
```

#### Tracking System

```
GET    /student/applications/:id/timeline               Get full timeline for application
       Returns array of timeline events sorted by date.
```

### 5.4 Tracking System Design (Flipkart/Myntra Style)

The tracking system renders a **visual timeline** similar to e-commerce order tracking.

#### Timeline Data Model

Each `ApplicationTimeline` record represents one event. Events are created automatically by the system when stages transition.

**Auto-generated events:**

| Stage | Event Key | Title | Icon |
|-------|-----------|-------|------|
| 1 | `application_submitted` | Application Submitted | 📋 |
| 1 | `application_approved` | Application Approved | ✅ |
| 2 | `admission_letter_uploaded` | Admission Letter Issued | 📄 |
| 2 | `payment_received` | Admission Fee Paid (₹5,000) | 💰 |
| 3 | `exam_scheduled` | Exam Scheduled | 📅 |
| 3 | `exam_documents_uploaded` | Exam Documents Submitted | 📎 |
| 3 | `exam_fee_paid` | Exam Fee Paid (₹10,000) | 💰 |
| 3 | `exam_passed` | Exam Cleared | 🎉 |
| 4 | `invitation_letter_uploaded` | Invitation Letter Issued | ✉️ |
| 5 | `visa_support_started` | Visa Support Started | 🛂 |
| 5 | `ticket_created` | Support Ticket Created | 🎫 |

#### Frontend Component Design

```
┌─────────────────────────────────────────────────────┐
│  📋 Application Submitted          May 20, 2026     │
│  ── You applied to Osh State University            │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                    │
│  📄 Admission Letter Issued       Jun 5, 2026      │
│  ── Your admission letter is ready to view         │
│  ── 💰 Pay ₹5,000 to confirm acceptance            │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                    │
│  💰 Admission Fee Paid            Jun 8, 2026      │
│  ── ₹5,000 received ✓                             │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                    │
│  📅 Exam Scheduled                Jun 15, 2026     │
│  ── Date: July 10, 2026                           │
│  ── 📎 Upload your documents                      │
│  ── 💰 Pay ₹10,000 exam fee                       │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                    │
│  📎 Exam Documents Submitted      Jun 20, 2026     │
│  ── Documents under review                        │
│  ○ - - - - - - - - - - - - - - - - - - - - - -    │  ← Future (grey)
│  ...more steps...                                  │
└─────────────────────────────────────────────────────┘
```

**States per step:**
- **Completed** (green/checkmark) — event occurred
- **Active** (blue/pulsing) — currently actionable step
- **Pending** (grey/dashed) — future step (locked)

### 5.5 Stage Transition Rules

```
Stage 1 (Application):
  Status flow: pending → in_review → approved | rejected
  Unlock condition: Admin approves application

Stage 2 (Admission Letter + ₹5,000):
  Status flow: pending → payment_required → paid → approved
  Unlock condition: Stage 1 = approved
  Required actions:
    1. Admin uploads admission letter
    2. Student pays ₹5,000
  Timeline events:
    - Application approved triggers stage 2 activation
    - Admission letter upload creates timeline event
    - Payment success creates timeline event

Stage 3 (Entrance Exam):
  Status flow: pending → docs_required → docs_uploaded → fee_pending → registered → result_awaited → passed | failed
  Unlock condition: Stage 2 = approved
  Required actions:
    1. Admin sets exam date/details
    2. Student uploads exam documents (passport, 12th, notarized)
    3. Student pays ₹10,000
    4. Admin declares result
  If failed: allow retry (attemptNumber incremented)

Stage 4 (Invitation Letter):
  Status flow: pending → approved
  Unlock condition: Stage 3 = passed (not just approved)
  Required actions:
    1. Admin uploads invitation letter

Stage 5 (Visa Support):
  Status flow: unlocked → in_progress → completed
  Unlock condition: Stage 4 = approved
```

### 5.6 Error Handling & Edge Cases

| Scenario | Handling |
|----------|----------|
| Student pays ₹5,000 but admission letter not yet uploaded | Payment recorded as PENDING, applied to stage when letter is uploaded |
| Student uploads wrong exam documents | Admin marks for re-upload, student re-uploads |
| Student fails entrance exam | Stage 3 marked as failed, admin can schedule retry |
| Student wants to switch university | Requires admin intervention, new application needed |
| Payment fails (Razorpay timeout) | Payment marked FAILED, student can retry |
| Admission letter rejected by student | Admin reviews and can re-upload corrected version |
| Exam date passed but no result declared | Admin dashboard shows overdue exams, manual intervention needed |
| Multiple applications to different universities | Each application has its own stage progression independent of others |

---

## 6. Database Migrations

The following migration is needed:

1. Create `ExamRecord` model
2. Create `ApplicationTimeline` model  
3. Create `SupportTicket` and `SupportTicketMessage` models
4. Add `TicketCategory` enum
5. Add `ExamResult` enum
6. Add `applicationId` field to `SupportTicket` (optional relation)
7. Update `InvitationLetter` to reference `applicationId` as well (optional)

---

## 7. Step-by-Step Implementation Plan

### Phase 1: Foundation (Week 1)

#### Step 1: Prisma Migration — New Models
**Files:** `apps/api/prisma/schema.prisma`
**Changes:** Add ExamRecord, ApplicationTimeline, SupportTicket, SupportTicketMessage models + enums
**Verify:** `npx prisma generate && npx prisma migrate dev --name add-post-application-models`

#### Step 2: Create Payments Module
**Files:** 
- `apps/api/src/payments/payments.module.ts` (NEW)
- `apps/api/src/payments/payments.service.ts` (NEW)
- `apps/api/src/payments/payments.controller.ts` (NEW)
- `apps/api/src/payments/dto/` (NEW)
**Changes:** Implement Razorpay order creation, webhook handling, payment verification
**Verify:** Unit test payment creation flow

#### Step 3: Create Letters Module
**Files:**
- `apps/api/src/letters/letters.module.ts` (NEW)
- `apps/api/src/letters/letters.service.ts` (NEW)
- `apps/api/src/letters/letters.controller.ts` (NEW)
- `apps/api/src/letters/dto/` (NEW)
**Changes:** Upload/view/download admission letters & invitation letters with access control
**Verify:** Test upload and signed URL generation

#### Step 4: Create Timeline Service
**Files:**
- `apps/api/src/common/services/timeline.service.ts` (NEW)
**Changes:** Auto-generate timeline events on stage transitions
**Verify:** Unit test event creation on stage changes

### Phase 2: Stage 2 — Admission Letter & Payment (Week 2)

#### Step 5: Admission Letter API
**Files:** `apps/api/src/admin/` and `apps/api/src/students/`
**Changes:**
- Admin: POST/GET admission letter for application
- Student: GET my admission letter
- Email notification when letter is uploaded
- Timeline event auto-created
**Verify:** E2E test: admin uploads → student can view

#### Step 6: ₹5,000 Payment Integration (Stage 2)
**Files:** `apps/api/src/payments/`
**Changes:**
- Create Razorpay order for stage 2 (₹5,000)
- Webhook handler updates payment status
- On success: update application stage, create timeline event
- Trigger stage 2 → stage 3 transition
**Verify:** E2E test: payment success → stage advances

### Phase 3: Stage 3 — Entrance Exam (Week 3)

#### Step 7: Exam Record API
**Files:** `apps/api/src/admin/` and `apps/api/src/students/`
**Changes:**
- Admin: POST exam record with dates/subject/center
- Student: GET my exam details
- Admin: PUT exam result (PASSED/FAILED)
- Email notification when exam is scheduled
- Timeline event creation
**Verify:** Test exam schedule flow

#### Step 8: Exam Document Upload
**Files:** `apps/api/src/documents/` and `apps/api/src/students/`
**Changes:**
- Add exam-specific DocumentType entries (Passport, 12th Marksheet, Notarized & Translated)
- Student uploads docs tied to exam
- Admin verifies exam documents
**Verify:** Test document upload + verification

#### Step 9: ₹10,000 Payment Integration (Stage 3)
**Files:** `apps/api/src/payments/`
**Changes:**
- Create Razorpay order for stage 3 (₹10,000)
- Webhook handler updates payment status
- On success: update exam registration status
**Verify:** E2E test: payment success → exam registered

#### Step 10: Exam Result & Stage Transition
**Files:** `apps/api/src/admin/`
**Changes:**
- Admin declares exam result
- If PASSED: transition to stage 4
- If FAILED: allow retry (increment attemptNumber)
- Timeline event for result
- Email notification
**Verify:** Test both PASSED and FAILED flows

### Phase 4: Stage 4 & 5 — Letters & Visa (Week 4)

#### Step 11: Invitation Letter API
**Files:** Reuse letters module
**Changes:**
- Admin uploads invitation letter
- Student views/downloads
- Stage transition to stage 5
- Email notification
- Timeline event
**Verify:** Test upload → view flow

#### Step 12: Visa Support
**Files:** 
- `apps/api/src/visa-support/` (NEW module)
- Or add to `students/`
**Changes:**
- GET visa checklist for student's target country
- GET visa centers
- No complex logic — read-only data
**Verify:** Test API endpoints

#### Step 13: Support Tickets
**Files:**
- `apps/api/src/support-tickets/` (NEW module)
**Changes:**
- CRUD tickets for students
- Admin management (view all, assign, reply)
- Categories specific to admission pipeline
**Verify:** Test full ticket lifecycle

### Phase 5: Mobile Optimization (Week 4)

#### Step 14a: Sparse Fieldsets & Conditional Includes
**Files:** All controllers, services
**Changes:**
- Add `?fields=` query param support to all list & detail endpoints
- Add `?include=` query param for conditional relation embedding
- Default response omits heavy fields (formData, metadata) unless explicitly requested
- Add `ETag` headers to timeline & application detail endpoints
**Verify:** Test with `?fields=id,title,status` returns only requested fields

#### Step 14b: Push Notification Infrastructure
**Files:**
- `apps/api/prisma/schema.prisma` — Add `DeviceToken` model
- `apps/api/src/notifications/` — Push notification service (FCM)
- `apps/api/src/students/students.controller.ts` — Device registration endpoints
**Changes:**
- Add DeviceToken model + migration
- FCM integration service
- POST/DELETE device token endpoints
- Wire push notifications to all stage transitions
**Verify:** Send test push notification to emulator/device

#### Step 14c: File Upload Optimization for Mobile
**Files:** `apps/api/src/documents/`
**Changes:**
- Accept compressed images (client-side compression note in API docs)
- Set `413 Payload Too Large` limit at 10MB per upload
- Return `202 Accepted` with progressUrl for large uploads
- Validate file type & size server-side
**Verify:** Upload 5MB image → 202 Accepted; upload 15MB → 413 error

#### Step 14d: Rate Limiting Middleware
**Files:**
- `apps/api/src/common/` — Rate limiting guard/decorator
- Applied on auth, payment, document, ticket endpoints
**Changes:**
- Create `@RateLimit({ limit, window })` decorator
- Use in-memory or Redis-backed rate limiting
- Return `429 Too Many Requests` with `Retry-After` header
**Verify:** Hit rate limit → 429 response

### Phase 6: Tracking System (Week 4–5)

#### Step 15: Timeline Auto-Generation
**Files:** `apps/api/src/common/services/timeline.service.ts`
**Changes:**
- Hook into all stage transition points
- Auto-create ApplicationTimeline records
- Include metadata (amounts, file URLs, dates)
**Verify:** Full integration test

#### Step 16: Timeline API
**Files:** `apps/api/src/students/students.controller.ts`, `students.service.ts`
**Changes:**
- `GET /student/applications/:id/timeline`
- Returns sorted timeline events
- Include current active step indicator
- Support `?fields=` sparse fieldset for mobile
**Verify:** Test timeline output

#### Step 17: Frontend — Tracking Component (Mobile-First)
**Files:** `apps/web/components/`
**Changes:**
- New component: `ApplicationTimeline`
- Visual stepper with completed/active/pending states
- Icons per event type
- **Mobile-first responsive design**: sticky bottom CTA, swipable dates, touch targets ≥44px
- Skeleton loaders during data fetch
- Pull-to-refresh support
- Cached timeline display with stale-while-revalidate
**Verify:** Visual review on mobile (375px) and desktop (1280px) viewports

#### Step 18: Frontend — Student Dashboard Enhancement (Mobile-First)
**Files:** `apps/web/app/(students)/student/`
**Changes:**
- Student dashboard shows current stage clearly
- Action items highlighted (what to do next)
- Timeline visible on application detail page
- Payment CTA as sticky bottom button on mobile
- Camera integration for document upload ("Take Photo" / "Choose from Gallery")
- Empty state illustrations for "no applications"
**Verify:** Walk through student flow on mobile viewport

#### Step 19: Frontend — Admin Pipeline View
**Files:** `apps/web/app/(admin)/admin/`
**Changes:**
- Admin dashboard shows students grouped by stage
- Quick actions per student (upload letter, set exam)
- Pending verifications dashboard
- Mobile-responsive admin tables
**Verify:** Admin walk-through

### Phase 7: Notifications & Polish (Week 5–6)

#### Step 20: Email & Push Notifications
**Files:** `apps/api/src/common/services/notification.service.ts`
**Changes:**
Wire email triggers for:
- Admission letter uploaded
- Payment received
- Exam scheduled
- Exam result declared
- Invitation letter uploaded
- Ticket response
**Verify:** Test email delivery

#### Step 20: Email & Push Notifications
**Files:** `apps/api/src/common/services/notification.service.ts`, `apps/api/src/notifications/`
**Changes:**
Wire email + push triggers for:
- Admission letter uploaded
- Payment received
- Exam scheduled
- Exam result declared
- Invitation letter uploaded
- Ticket response
- Deep link payload in push notifications
**Verify:** Test email delivery + push notification received

#### Step 21: Edge Cases & Error Handling
**Files:** Various
**Changes:**
- Handle payment timeout/retry
- Handle document rejection and re-upload flow
- Handle exam failure and retry logic
- Handle admission letter revision
- Handle expired Razorpay orders (24h expiry) on mobile
- Handle network failure during upload (resumable)
**Verify:** Comprehensive edge case tests

#### Step 22: Mobile QA Pass
**Files:** N/A — testing pass
**Changes:**
- Test all flows on 375px viewport (mobile)
- Test offline timeline display (cached)
- Test document upload with camera
- Test Razorpay UPI flow on mobile
- Test push notification delivery
- Test pull-to-refresh on all list screens
- Test touch target sizes (min 44px)
- Test slow network (3G throttling)
**Verify:** QA sign-off on mobile

---

## 8. Test Plan

### Unit Tests

| Module | Tests |
|--------|-------|
| **PaymentsService** | Order creation, webhook signature verification, payment status transitions |
| **LettersService** | File upload validation, access control (own student only), signed URL generation |
| **TimelineService** | Auto-creation on stage transitions, deduplication |
| **ExamService** | Status transitions, retry logic, result declaration |
| **TicketsService** | CRUD operations, role-based access, category filtering |
| **PushNotificationsService** | Token registration, FCM send, deep link payload formatting |
| **RateLimitingGuard** | Limit enforcement, Retry-After header, per-endpoint configuration |

### Integration Tests

| Flow | Description |
|------|-------------|
| Stage 2 | Admin uploads letter → student views → student pays → stage advances |
| Stage 3 | Admin sets exam → student uploads docs → student pays → admin declares result |
| Stage 4 | Admin uploads invitation letter → student downloads |
| Stage 5 | Student views visa info → creates ticket → admin replies |
| Payment | Razorpay order → mock webhook → payment recorded → timeline updated |
| Timeline | Full pipeline → verify all 10+ timeline events created |
| Sparse Fields | `?fields=id,title` returns minimal response; omit without param returns full |
| Push Notification | Device token register → stage event → FCM push sent |
| Rate Limiting | Repeated POST to payment → 429 after threshold |

### E2E Tests

| Test | Description |
|------|-------------|
| Complete happy path | Student goes through all 5 stages successfully |
| Payment failure | Payment fails → student retries → succeeds |
| Exam failure | Student fails exam → admin allows retry → student passes |
| Document rejection | Admin rejects document → student re-uploads → approved |
| Mobile sparse fields | Mobile app requests `?fields=id,title,stage,isActive` → parses correctly |
| Push notification deep link | Push received → tap → opens correct app screen |
| Offline timeline | Cache timeline → go offline → timeline still visible with stale data |

### Mobile-Specific Tests

| Test | Description |
|------|-------------|
| **375px viewport** | All screens render without horizontal scroll at 375px width |
| **Touch targets** | All buttons/links are ≥44px tap area |
| **Camera upload** | Document upload via camera capture works |
| **UPI payment** | Razorpay UPI flow (GPay/PhonePe) completes on mobile browser |
| **Push delivery** | Push notification delivers within 30s of stage transition |
| **Pull-to-refresh** | All list screens support pull-to-refresh |
| **Skeleton loaders** | Loading states show skeleton UI, not blank screen or spinner |
| **Sticky bottom CTA** | "Pay Now" / "Upload" button stays visible at bottom while scrolling |
| **3G throttling** | All critical flows (view timeline, upload doc) complete within 10s on 3G |
| **Network loss** | Upload resumes or shows proper error when network returns |

### Edge Cases

- Student applies to multiple universities (each app has independent timeline)
- Payment for stage 2 before letter is uploaded (queue the payment)
- Exam date in the past (admin error handling)
- Student doesn't complete stage (incomplete pipeline handling)
- Push token expires (FCM token refresh, stale token cleanup)
- Upload interrupted mid-way (partial file, retry handling)
- Rate limit exceeded on mobile (show friendly message, not raw 429)

---

## 9. Rollout & Rollback Plan

### Rollout Strategy

1. **Feature flag** `postApplicationFlow`: disabled in production initially
2. **API version header**: All new endpoints accept `Accept: application/vnd.sh-web.v1+json` for mobile version negotiation
3. **Phase rollout by stage**:
   - Week 1–2: Stage 2 enabled first
   - Week 3: Stage 3 enabled
   - Week 4: Stage 4–5 enabled
4. **Mobile-first**: Test all new endpoints with mobile payload sizes first, then web
5. **Backfill**: Existing students with `currentStage = 1` get auto-initialized timeline
6. **Push notification opt-in**: Roll out push notification registration after Stage 2 is verified stable

### Rollback Plan

| Scenario | Rollback Action |
|----------|-----------------|
| Payment bug | Disable payment endpoints, fall back to manual payment entry |
| Timeline service issue | Disable timeline auto-generation, API returns empty array |
| Letter upload issue | Revert to manual file sharing via email |
| Push notification spam | Disable FCM sending in config, keep token registration |
| Rate limiting false positive | Adjust limit thresholds, whitelist test accounts |
| Complete failure | Toggle feature flag OFF, all new APIs return 404; old mobile app continues working |

### Monitoring

- Track: payment success rate, stage transition count, document upload count
- Track: average API response payload size (mobile vs web)
- Track: push notification delivery rate, open rate
- Track: rate limit hit count per endpoint
- Alert on: payment webhook failures, document upload errors, push notification delivery &gt;10% failure
- Alert on: 429 errors exceeding threshold (indicates misconfigured rate limit)
- Log all admin actions for audit
- Monitor: mobile API response times (p95 &lt; 2s on 4G)

---

## 10. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Razorpay webhook delivery failure | Payment not recorded | Low | Idempotency keys, manual payment approval fallback |
| Exam dates change frequently | Confusion for students | Medium | Admin can update exam date, notification sent on change |
| Students upload wrong/forged documents | Fraud | Low | Admin verification required, manual review |
| Stage transition race condition | Wrong stage advancement | Low | Database transactions for critical paths |
| Email delivery failure | Student misses notification | Medium | Push notifications + in-app notification center as backup |
| University doesn't respond with letters | Pipeline stalls | High | Admin manual override for letter upload |
| Student wants to switch universities mid-pipeline | Complex data migration | Medium | Requires admin intervention, new application creation |
| Exam retry payment confusion | Double payment | Low | Track payments per attempt number |
| **Mobile: UPI payment interrupted** | Payment stuck mid-flow | Medium | Razorpay callback + webhook; poll order status on app resume |
| **Mobile: Push token expired** | Student stops getting notifications | Medium | FCM token refresh handler; re-register on app launch |
| **Mobile: Large file upload on 3G** | Upload fails or takes too long | High | Client-side compression (≤2MB); resumable uploads; timeout UI |
| **Mobile: Stale cached data** | Student sees outdated timeline | Low | ETag-based validation; stale-while-revalidate pattern |
| **Mobile: Network loss mid-payment** | Payment deducted but not confirmed | Medium | Razorpay order verification API; auto-verify on reconnect |

---

## 11. Mobile-Specific Optimizations

> Indian MBBS students will primarily access this platform on mobile devices (Android/iOS). The API design must be optimized accordingly.

### 11.1 Payload Optimization

| Strategy | Implementation | Rationale |
|----------|---------------|-----------|
| **Sparse fieldsets** | Support `?fields=id,title,status` query param on list endpoints | Mobile screens show limited data; don't waste bandwidth on unused fields |
| **Conditional includes** | `?include=timeline,exam` — only embed related resources when explicitly requested | Avoid N+1 and massive payloads by default |
| **Pagination defaults** | Default `limit=10` on list endpoints, max `limit=50` | Mobile lists should be shorter; infinite scroll works with smaller pages |
| **Response compression** | Enable gzip/brotli at reverse proxy level | Reduces JSON payload size by 60-80% |
| **ETags for caching** | Return `ETag` header on timeline & application detail endpoints | Mobile can cache and use `If-None-Match` for 304 responses |

#### Example: Sparse Fields on Mobile

```
GET /student/applications/:id/timeline?fields=event,title,stage,isActive,isCompleted&limit=5
```

```json
{
  "currentStage": 2,
  "currentStatus": "STAGE_2_PENDING",
  "events": [
    { "event": "application_submitted", "title": "Application Submitted", "stage": 1, "isCompleted": true, "isActive": false },
    { "event": "admission_letter_uploaded", "title": "Admission Letter Issued", "stage": 2, "isCompleted": true, "isActive": false },
    { "event": null, "title": "Pay ₹5,000 to Confirm Seat", "stage": 2, "isCompleted": false, "isActive": true }
  ],
  "stages": [
    { "stage": 1, "status": "completed" },
    { "stage": 2, "status": "active", "actionLabel": "Pay ₹5,000 Now" },
    { "stage": 3, "status": "pending" },
    { "stage": 4, "status": "locked" },
    { "stage": 5, "status": "locked" }
  ]
}
```

### 11.2 File Upload Optimization

| Challenge | Solution |
|-----------|----------|
| Large PDF/JPEG files on mobile data | **Pre-upload compression**: Client compresses images before upload (max 2MB per file) |
| Upload interruption on poor network | **Resumable uploads**: Support `Content-Range` headers for chunked uploads (TUS protocol or simple chunking) |
| Slow upload speed | **Background upload**: Queue uploads and retry on failure; don't block the UI |
| Wrong document type uploaded | **Client-side validation**: Check file type, size, and minimum resolution before upload POST |

#### Mobile Document Upload API

```http
POST /student/applications/:id/exam-documents
Content-Type: multipart/form-data

field: file         (the document file, compressed ≤ 2MB)
field: documentType (e.g., "passport", "twelfth_marksheet", "notarized_copy")
field: applicationId
```

**Response (202 Accepted — async processing):**
```json
{
  "id": "doc-uuid",
  "status": "uploading",
  "progressUrl": "/student/documents/doc-uuid/progress"
}
```

### 11.3 Push Notifications (Mobile-First)

Email is unreliable on mobile (students may not check). Add push notifications:

| Event | Push Title | Push Body | Deep Link |
|-------|-----------|-----------|-----------|
| Admission Letter Uploaded | 📄 Admission Letter Ready | Your letter from OSU is ready. Pay ₹5,000 to confirm | `/student/applications/:id` |
| Payment Confirmed | ✅ Payment Received | ₹5,000 confirmed for OSU admission | `/student/applications/:id` |
| Exam Scheduled | 📅 Exam Date Announced | OSU exam on July 10, 2026. Upload documents now! | `/student/applications/:id/exam` |
| Exam Result Declared | 🎉 Exam Result Out | Your OSU entrance exam result is available | `/student/applications/:id/result` |
| Invitation Letter Ready | ✉️ Invitation Letter Ready | Your OSU invitation letter is ready to download | `/student/applications/:id/invitation` |
| Ticket Response | 💬 Support Ticket Updated | Admin replied to your ticket #123 | `/student/tickets/:id` |

**Implementation:**
- Use Firebase Cloud Messaging (FCM) for Android
- Use APNs for iOS (if iOS app planned)
- Store FCM device tokens in a `DeviceToken` model
- Include `click_action` / deep link data in notification payload

#### New Model for Push Tokens

```prisma
model DeviceToken {
  id         String   @id @default(uuid())
  userId     String
  token      String
  platform   String   // "android", "ios", "web"
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, token])
  @@index([userId])
}
```

#### Push Notification API

```http
POST /student/devices/register
Body: { token: "fcm-token-xxx", platform: "android" }

DELETE /student/devices/:token
```

### 11.4 Offline Resilience

| Feature | Implementation |
|---------|---------------|
| **Cached timeline** | `GET /student/applications/:id/timeline` response cached in local storage with `ETag` |
| **Stale-while-revalidate** | Show cached data immediately, refresh in background |
| **Payment retry queue** | If payment fails due to network, queue and retry when online |
| **Draft application form** | Save form state locally if submission fails mid-way |

#### Cache Headers

```http
GET /student/applications/:id/timeline
Cache-Control: private, max-age=300, stale-while-revalidate=3600
ETag: "t-67890"
```

### 11.5 Authentication for Mobile

| Feature | Why |
|---------|-----|
| **OTP-based login** | Phone number OTP is more common than email/password for Indian mobile users |
| **Biometric unlock** | Fingerprint/face unlock for quick session resume (client-side, after JWT) |
| **Refresh token rotation** | Long-lived sessions on mobile; rotate refresh tokens on each use |
| **Token storage** | Use httpOnly cookies for web, secure AsyncStorage/Keychain for mobile |

### 11.6 Razorpay Mobile Integration

| Consideration | Detail |
|---------------|--------|
| **Razorpay checkout** | Opens in-app browser or WebView on mobile; ensure callback URL works |
| **UPI support** | Razorpay checkout on mobile supports UPI (GPay, PhonePe, Paytm) — critical for Indian users |
| **Payment retry UI** | If payment fails, show retry button directly — don't make user re-enter form |
| **Order expiry** | Razorpay orders expire in 24h by default; handle expired orders gracefully |

#### Mobile Payment Flow

```
1. Student taps "Pay ₹5,000" on mobile
2. POST /student/payments/create-order { applicationId, stage: 2 }
3. Backend creates Razorpay order, returns { orderId, amount, key }
4. Student's mobile app opens Razorpay checkout modal
5. Student pays via UPI/NetBanking/Card
6. On success: Razorpay callback triggers webhook
7. Webhook updates backend → timeline updates
8. Mobile app polls /timeline or receives push notification
```

### 11.7 Mobile-Specific UI Considerations

| Element | Mobile Behavior |
|---------|----------------|
| **Timeline** | Vertical, compact, swipeable dates; sticky "current action" card at bottom |
| **Document upload** | Camera integration: "Take Photo" or "Choose from Gallery" options |
| **Payment CTA** | Sticky bottom button: "Pay ₹5,000 →" always visible |
| **Letter viewing** | PDF viewed in-app via WebView or download with external PDF viewer |
| **Ticket chat** | WhatsApp-style chat UI for support tickets |
| **Navigation** | Bottom tab bar: Dashboard, Applications, Tickets, Profile |
| **Loading states** | Skeleton loaders (not spinners) for timeline and list screens |
| **Pull to refresh** | All list screens support pull-to-refresh |
| **Empty states** | Illustrations + CTAs for "no applications", "no tickets" |

### 11.8 API Response Format for Mobile

All list endpoints should return a consistent paginated response:

```json
{
  "data": [...],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasMore": true
  }
}
```

This allows mobile to implement infinite scroll via `hasMore` flag without calculating page count.

### 11.9 Rate Limiting for Mobile

| Endpoint Group | Rate Limit | Rationale |
|---------------|------------|-----------|
| Auth (login/OTP) | 5 req/min per phone | Prevent SMS bombing |
| Payment creation | 10 req/min per user | Prevent duplicate order spam |
| Document upload | 20 req/hour per user | Prevent storage abuse |
| Timeline/read endpoints | 60 req/min per user | Allow polling for updates |
| Ticket creation | 5 req/hour per user | Prevent support spam |

### 11.10 API Versioning for Mobile

Since mobile apps can't be force-updated like web:

```http
Accept: application/vnd.sh-web.v1+json
```

Or header-based:

```http
X-API-Version: 1
```

Strategy:
- **Backward-compatible changes** (adding fields): No version bump needed
- **Breaking changes** (removing/renaming fields): New API version
- **Deprecation**: Support old version for 6 months minimum
- **Gradual rollout**: Version negotiation lets old apps work while new features ship

---

## 12. Open Questions

1. **University role**: Does each university have its own admin login, or do platform admins handle everything? Currently only platform ADMIN/SUPER_ADMIN roles exist.
2. **Exam result format**: Is the exam a single result or multiple subjects? (Currently designed as single result)
3. **Notarized documents**: Are notarized documents uploaded by the student or sent directly by the notary? Currently assumed student uploads.
4. **Invitation letter vs Admission letter**: Is the invitation letter literally a separate document from the admission letter, or is it the same thing sent at a different stage?
5. **Visa support complexity**: What level of visa support? (Document checklist only vs active visa application processing)
6. **Ticket support scope**: Should tickets be linked to a specific application, or are they general? Currently supports both.
7. **₹5,000 and ₹10,000 amounts**: Are these fixed for all universities, or configurable per university/course?
8. **Exam retry fee**: Does the student pay ₹10,000 again for each retry?
9. **Mobile app vs responsive web**: Is there a native mobile app planned, or is this purely a mobile-responsive web app? (Affects push notification strategy — FCM vs Web Push API)
10. **UPI as primary payment**: What % of students use UPI (GPay/PhonePe) vs cards? (Affects Razorpay checkout configuration defaults)
11. **Biometric auth**: Should the mobile app support fingerprint/face unlock for quick re-authentication?
12. **Offline document upload**: Should students be able to upload documents when offline and have them sync when back online?
13. **SMS notifications**: Should we add SMS alerts for critical events (payment received, exam scheduled) in addition to push and email?
14. **Language localization**: Is there a need for Hindi or regional language support on mobile?

---

## 12. Appendix: Complete API Route Table

```
── PUBLIC ──
GET  /universities                                    (already exists)
GET  /universities/countries                          (already exists)
GET  /universities/:identifier                        (already exists)

── STUDENT (protected) ──
GET  /student/profile                                 (already exists)
PUT  /student/profile                                 (already exists)
PUT  /student/profile/academic                        (already exists)
GET  /student/stage                                   (already exists)
POST /student/apply                                   (already exists)
GET  /student/applications                            (already exists)
GET  /student/applications/check/:universityId        (already exists)
GET  /student/applications/:id                        (already exists)
GET  /student/applications/:id/timeline               ✅ NEW (supports ?fields= sparse fieldset)
GET  /student/applications/:id/admission-letter        ✅ NEW
GET  /student/applications/:id/exam                   ✅ NEW
POST /student/applications/:id/exam-documents          ✅ NEW
GET  /student/applications/:id/exam-documents          ✅ NEW
GET  /student/applications/:id/invitation-letter       ✅ NEW
POST /student/payments/create-order                    ✅ NEW
GET  /student/payments                                ✅ NEW
GET  /student/visa/checklist                          ✅ NEW
GET  /student/visa/centers                            ✅ NEW
POST /student/tickets                                  ✅ NEW
GET  /student/tickets                                  ✅ NEW
GET  /student/tickets/:id                              ✅ NEW
POST /student/tickets/:id/messages                     ✅ NEW

── MOBILE-SPECIFIC (protected) ──
POST /student/devices/register                         ✅ NEW (FCM token registration)
       Body: { token: "fcm-token", platform: "android" | "ios" | "web" }
DELETE /student/devices/:token                         ✅ NEW (unregister device)
GET  /applications/:id/timeline?fields=...&include=... ✅ NEW (mobile-optimized sparse endpoint)
GET  /student/payments/verify/:orderId                 ✅ NEW (verify Razorpay order status after app resume)

── ADMIN (protected) ──
GET  /admin/applications                              ✅ NEW (list all with filters)
GET  /admin/applications/:id                          ✅ NEW (full detail)
POST /admin/applications/:id/admission-letter          ✅ NEW
PUT  /admin/applications/:id/admission-letter          ✅ NEW
POST /admin/applications/:id/exam                     ✅ NEW
PUT  /admin/applications/:id/exam                     ✅ NEW
PUT  /admin/applications/:id/exam/result              ✅ NEW
GET  /admin/applications/:id/exam-documents            ✅ NEW
PUT  /admin/applications/:id/exam-documents/:docId/verify ✅ NEW
POST /admin/applications/:id/invitation-letter         ✅ NEW
PUT  /admin/applications/:id/stage/complete            ✅ NEW
GET  /admin/tickets                                    ✅ NEW
PUT  /admin/tickets/:id                               ✅ NEW (assign, status update)
POST /admin/tickets/:id/messages                       ✅ NEW

── WEBHOOK ──
POST /payments/razorpay-webhook                        (may already exist)
```
