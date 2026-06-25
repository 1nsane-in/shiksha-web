# User Flow Implementation Specification

**Document:** `docs/userFlow-implementation-spec.md`  
**Version:** 2.0  
**Date:** May 15, 2026  
**Status:** Ready for Implementation  
**Scope:** Student & Admin POV, End-to-End CRUD  
**Total Tasks:** 83  
**Timeline:** 9 weeks  

---

## 1) Feature Overview

### Student Features (9 modules)
1. **Auth:** Register, login, OTP verification, password reset
2. **Universities:** Browse list, view details, check application status
3. **Applications:** Submit, view list, view detail, view timeline
4. **Payments:** Create order, checkout, view status, webhook handling
5. **Documents:** Upload exam docs, view uploaded docs
6. **Exam:** View exam details, view result
7. **Letters:** View/download admission letter, invitation letter
8. **Visa:** View checklist, view visa centers
9. **Tickets:** Create ticket, view list, view detail, add message

### Admin Features (8 modules)
1. **Auth:** Login, profile management
2. **Dashboard:** View application stats, pending reviews
3. **Applications:** List, detail, approve/reject, view timeline
4. **Letters:** Upload admission letter, upload invitation letter, view letters
5. **Exams:** Schedule exam, update exam, view exam, declare result
6. **Payments:** View payment list, verify payment, view payment detail
7. **Documents:** View uploaded docs, accept/reject docs
8. **Tickets:** List tickets, view detail, reply, update status

---

## 2) Database Schema

### Core Tables

```sql
-- Users & Auth
create table users (
  id uuid primary key,
  email varchar(255) unique not null,
  phone varchar(20) unique not null,
  password_hash varchar(255) not null,
  role enum('STUDENT', 'ADMIN') not null,
  is_verified boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table otp_verifications (
  id uuid primary key,
  user_id uuid references users(id),
  otp varchar(6) not null,
  expires_at timestamp not null,
  created_at timestamp default now()
);

-- Universities
create table universities (
  id uuid primary key,
  name varchar(255) not null,
  country varchar(100) not null,
  description text,
  logo_url varchar(500),
  is_active boolean default true,
  created_at timestamp default now()
);

-- Applications
create table applications (
  id uuid primary key,
  student_id uuid references users(id),
  university_id uuid references universities(id),
  status enum('DRAFT', 'SUBMITTED', 'STAGE1_PENDING', 'STAGE1_APPROVED', 'STAGE1_REJECTED', 'STAGE2_PENDING', 'STAGE2_APPROVED', 'STAGE3_PENDING', 'STAGE3_APPROVED', 'STAGE3_FAILED', 'STAGE4_PENDING', 'STAGE4_APPROVED', 'STAGE5_ACTIVE', 'COMPLETED') not null,
  current_stage int default 1,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(student_id, university_id)
);

-- Timeline Events
create table timeline_events (
  id uuid primary key,
  application_id uuid references applications(id),
  event_type varchar(50) not null,
  description text,
  created_at timestamp default now()
);

-- Letters
create table letters (
  id uuid primary key,
  application_id uuid references applications(id),
  letter_type enum('ADMISSION', 'INVITATION') not null,
  file_url varchar(500) not null,
  uploaded_by uuid references users(id),
  uploaded_at timestamp default now()
);

-- Exams
create table exams (
  id uuid primary key,
  application_id uuid references applications(id),
  exam_date timestamp not null,
  exam_location varchar(255),
  instructions text,
  result enum('PENDING', 'PASSED', 'FAILED'),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Documents
create table documents (
  id uuid primary key,
  application_id uuid references applications(id),
  document_type varchar(100) not null,
  file_url varchar(500) not null,
  status enum('PENDING', 'ACCEPTED', 'REJECTED') default 'PENDING',
  uploaded_by uuid references users(id),
  uploaded_at timestamp default now()
);

-- Payments
create table payments (
  id uuid primary key,
  application_id uuid references applications(id),
  stage int not null,
  amount decimal(10,2) not null,
  razorpay_order_id varchar(100),
  razorpay_payment_id varchar(100),
  status enum('PENDING', 'SUCCESS', 'FAILED') default 'PENDING',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Visa Centers
create table visa_centers (
  id uuid primary key,
  name varchar(255) not null,
  city varchar(100) not null,
  address text not null,
  contact_phone varchar(20),
  contact_email varchar(255),
  is_active boolean default true
);

-- Support Tickets
create table tickets (
  id uuid primary key,
  student_id uuid references users(id),
  subject varchar(255) not null,
  status enum('OPEN', 'IN_PROGRESS', 'CLOSED') default 'OPEN',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table ticket_messages (
  id uuid primary key,
  ticket_id uuid references tickets(id),
  sender_id uuid references users(id),
  message text not null,
  created_at timestamp default now()
);
```

---

## 3) API Endpoints

### Student API Routes

```typescript
// Auth
POST   /api/auth/register          // Register student
POST   /api/auth/login             // Login student
POST   /api/auth/verify-otp        // Verify OTP
POST   /api/auth/resend-otp        // Resend OTP
POST   /api/auth/reset-password    // Reset password

// Universities
GET    /api/universities           // List universities
GET    /api/universities/:id       // Get university detail
GET    /api/universities/check-application/:universityId  // Check if already applied

// Applications
POST   /api/applications           // Submit application
GET    /api/applications           // List my applications
GET    /api/applications/:id       // Get application detail
GET    /api/applications/:id/timeline  // Get timeline events

// Letters
GET    /api/applications/:id/admission-letter  // Download admission letter
GET    /api/applications/:id/invitation-letter // Download invitation letter

// Exams
GET    /api/applications/:id/exam  // Get exam details
POST   /api/applications/:id/exam-documents  // Upload exam documents
GET    /api/applications/:id/exam-documents  // List exam documents

// Payments
POST   /api/payments/create-order  // Create Razorpay order
GET    /api/payments/:id           // Get payment status
POST   /api/payments/webhook       // Razorpay webhook

// Visa
GET    /api/visa/checklist         // Get visa checklist
GET    /api/visa/centers           // Get visa centers

// Tickets
POST   /api/tickets                // Create ticket
GET    /api/tickets                // List my tickets
GET    /api/tickets/:id            // Get ticket detail
POST   /api/tickets/:id/messages   // Add message to ticket
```

### Admin API Routes

```typescript
// Auth
POST   /api/admin/auth/login       // Admin login
GET    /api/admin/auth/profile     // Get admin profile
PUT    /api/admin/auth/profile     // Update admin profile

// Dashboard
GET    /api/admin/dashboard/stats  // Get stats
GET    /api/admin/dashboard/pending-reviews  // Get pending reviews

// Applications
GET    /api/admin/applications     // List all applications
GET    /api/admin/applications/:id  // Get application detail
PUT    /api/admin/applications/:id/status  // Update status (approve/reject)
GET    /api/admin/applications/:id/timeline  // Get timeline

// Letters
POST   /api/admin/applications/:id/admission-letter  // Upload admission letter
POST   /api/admin/applications/:id/invitation-letter  // Upload invitation letter

// Exams
POST   /api/admin/applications/:id/exam  // Schedule exam
PUT    /api/admin/applications/:id/exam  // Update exam
PUT    /api/admin/applications/:id/exam-result  // Declare result

// Documents
GET    /api/admin/applications/:id/documents  // List documents
PUT    /api/admin/documents/:id/status  // Accept/Reject document

// Payments
GET    /api/admin/payments         // List payments
GET    /api/admin/payments/:id     // Get payment detail
PUT    /api/admin/payments/:id/verify  // Verify payment

// Tickets
GET    /api/admin/tickets          // List all tickets
GET    /api/admin/tickets/:id      // Get ticket detail
PUT    /api/admin/tickets/:id/status  // Update ticket status
POST   /api/admin/tickets/:id/messages  // Add admin reply
```

---

## 4) UI Pages

### Student UI (15 pages)

1. **Login Page** - Email/phone + password
2. **Register Page** - Email, phone, password, OTP verification
3. **Password Reset Page** - Forgot password flow
4. **University List Page** - Browse universities
5. **University Detail Page** - View details + Apply button
6. **Application Form Page** - Multi-step form
7. **My Applications Page** - List of applications
8. **Application Detail Page** - Status, timeline, actions
9. **Payment Page** - Razorpay checkout
10. **Exam Documents Page** - Upload exam docs
11. **Letters Page** - View/download letters
12. **Visa Info Page** - Checklist + centers
13. **Tickets List Page** - My support tickets
14. **Ticket Detail Page** - View messages + reply
15. **Profile Page** - View/update profile

### Admin UI (12 pages)

1. **Admin Login Page** - Email + password
2. **Admin Dashboard** - Stats, pending reviews
3. **Applications List Page** - Filterable list
4. **Application Detail Page** - Review + approve/reject
5. **Letter Upload Page** - Upload admission/invitation letter
6. **Exam Schedule Page** - Schedule/update exam
7. **Result Declaration Page** - Declare exam result
8. **Documents Review Page** - Accept/reject documents
9. **Payments List Page** - View/verify payments
10. **Tickets List Page** - All support tickets
11. **Ticket Detail Page** - View/reply to ticket
12. **Admin Profile Page** - View/update profile

---

## 5) Integration Points

### Razorpay Integration
- Create order API
- Checkout widget
- Webhook verification
- Payment status polling

### OTP Service
- Send OTP API
- Verify OTP API
- Rate limiting
- Expiry handling

### File Storage
- Upload to S3/R2
- Signed URLs for download
- File type validation
- Size limits

### Notifications
- Email notifications (SendGrid)
- SMS notifications (Twilio)
- In-app notifications

---

## 6) Implementation Phases

### Phase 1: Auth & Foundation (Week 1-2)
**Goal:** Student & Admin authentication complete

**Backend Tasks:**
- User registration API
- User login API
- OTP verification API
- Password reset API
- JWT token management
- Role-based access control

**Frontend Tasks:**
- Student register page
- Student login page
- OTP verification UI
- Password reset UI
- Admin login page

**DevOps Tasks:**
- Razorpay account setup
- OTP service integration
- JWT secret configuration

### Phase 2: Universities & Applications (Week 3)
**Goal:** Student can browse and apply

**Backend Tasks:**
- University list API
- University detail API
- Application submit API
- Application list API
- Application detail API
- Already applied check API

**Frontend Tasks:**
- University list page
- University detail page
- Application form (multi-step)
- My applications page
- Application detail page

### Phase 3: Admin Review & Letters (Week 4-5)
**Goal:** Admin can review and upload letters

**Backend Tasks:**
- Admin dashboard API
- Admin application list API
- Approve/reject API
- Admission letter upload API
- Invitation letter upload API
- Letter download API
- Timeline generation

**Frontend Tasks:**
- Admin dashboard
- Admin application list
- Application detail (admin)
- Approve/reject UI
- Letter upload UI

### Phase 4: Payments & Exam (Week 6-7)
**Goal:** Payment flow and exam management complete

**Backend Tasks:**
- Razorpay order creation API
- Razorpay webhook handler
- Payment verification API
- Exam schedule API
- Exam update API
- Result declaration API
- Document upload API
- Document verification API

**Frontend Tasks:**
- Payment checkout UI
- Payment status UI
- Exam schedule UI (admin)
- Exam view UI (student)
- Document upload UI
- Result view UI

### Phase 5: Visa & Tickets (Week 8)
**Goal:** Visa support and ticket system

**Backend Tasks:**
- Visa checklist API
- Visa centers API
- Ticket creation API
- Ticket list API
- Ticket detail API
- Ticket message API
- Ticket status update API

**Frontend Tasks:**
- Visa checklist page
- Visa centers page
- Ticket creation UI
- Tickets list UI
- Ticket detail UI

### Phase 6: Polish & Testing (Week 9)
**Goal:** Production ready

**Tasks:**
- Error handling
- Loading states
- Empty states
- Form validation
- Mobile responsive
- Performance optimization
- E2E testing
- Bug fixes

---

## 7) Success Criteria

### Functional
- [ ] Student can register, login, verify OTP
- [ ] Student can browse universities and apply
- [ ] Admin can login and review applications
- [ ] Admin can approve/reject applications
- [ ] Admin can upload letters
- [ ] Student can view letters and make payments
- [ ] Admin can schedule exams and declare results
- [ ] Student can upload exam documents
- [ ] Admin can verify documents
- [ ] Student can view visa info and create tickets
- [ ] Admin can reply to tickets

### Technical
- [ ] 80%+ test coverage
- [ ] All API endpoints tested
- [ ] All UI flows tested
- [ ] Performance <200ms API response
- [ ] Security audit passed
- [ ] Mobile responsive

---

**Document Version:** 2.0  
**Last Updated:** May 15, 2026  
**Next Review:** After task breakdown
