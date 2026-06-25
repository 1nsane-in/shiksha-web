# User Flow Analysis & Gap Assessment

**Document:** `docs/userFlow.md` Analysis  
**Date:** May 15, 2026  
**Status:** Specification Review Complete  
**Scope:** Student & Admin POV, CRUD Operations, Multi-Agent Orchestration

---

## 1) Current State Assessment

### ✅ What Exists (Specification Only)

**Student Flow:**
- Auth: Register, Login, OTP verification
- University browse & detail view
- Application submission (Stage 1)
- Admission letter view + payment (Stage 2)
- Exam details + payment (Stage 3)
- Invitation letter view (Stage 4)
- Visa support + tickets (Stage 5)
- API route mappings (high-level)

**Format:**
- Mermaid diagram (227 lines)
- Textual step-by-step explanation
- API endpoint list

### ❌ What's Missing

**Admin Flow:**
- No admin login/authentication flow
- No admin dashboard specification
- No admin UI for application review
- No admin UI for letter upload
- No admin UI for exam scheduling
- No admin UI for result declaration
- No admin UI for ticket management

**CRUD Operations:**
- No CRUD matrix for Student
- No CRUD matrix for Admin
- No Create/Read/Update/Delete breakdown per entity

**Implementation Details:**
- No database schema
- No API request/response specs
- No UI page specifications
- No validation rules
- No error handling
- No task list
- No agent assignments
- No timeline
- No verification steps

---

## 2) CRUD Matrix - Student POV

| Entity | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| **Auth** | Register, OTP | Profile | Profile | - | Password reset missing |
| **Universities** | - | List, Detail | - | - | Browse only |
| **Applications** | Submit | List, Detail | - | Cancel? | Update not allowed |
| **Payments** | Create Order | Status | - | - | Razorpay integration |
| **Documents** | Upload | List, View | Re-upload | - | Admin verifies |
| **Exam** | - | Details, Result | - | - | Read only |
| **Letters** | - | View/Download | - | - | PDF download |
| **Visa** | - | Checklist, Centers | - | - | Read only |
| **Tickets** | Create | List, Detail | Add Message | - | Support tickets |

**Total Student Operations:** 9 entities × 4 CRUD = 36 operations (approx)

---

## 3) CRUD Matrix - Admin POV

| Entity | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| **Auth** | - | Profile | Profile | - | Login assumed |
| **Applications** | - | List, Detail | Approve/Reject | - | Status change |
| **Letters** | Upload | View | Re-upload | Remove | Admission/Invitation |
| **Exams** | Schedule | View | Update | Cancel | Date, details |
| **Payments** | - | List, Detail | Verify | - | Manual verification |
| **Documents** | - | List, View | Accept/Reject | - | Verification |
| **Tickets** | - | List, Detail | Reply, Status | Close | Support management |
| **Students** | - | List, Detail | Update | - | Profile management |
| **Timeline** | Add Event | View | - | - | Auto-generated |

**Total Admin Operations:** 9 entities × 4 CRUD = 36 operations (approx)

---

## 4) Implementation Gap Analysis

### Phase 1: Foundation (Auth + Roles)
**Status:** ❌ Not Started
**Tasks:** 15
- Student registration UI
- Student login UI
- OTP verification UI
- Admin login UI
- Admin dashboard UI
- Auth API routes
- OTP service integration
- JWT token management
- Role-based guards
- Password reset (missing in spec)

### Phase 2: University Browse + Application
**Status:** ❌ Not Started
**Tasks:** 12
- University list UI
- University detail UI
- Application form UI
- Application submit API
- Already applied check
- Application list UI
- Application detail UI
- Timeline UI
- Timeline API
- Application status tracking

### Phase 3: Admin Review + Letters
**Status:** ❌ Not Started
**Tasks:** 18
- Admin application list UI
- Admin application detail UI
- Approve/Reject UI
- Approve/Reject API
- Admission letter upload UI
- Admission letter upload API
- Invitation letter upload UI
- Invitation letter upload API
- Letter view/download UI
- Letter view/download API
- Timeline event generation

### Phase 4: Payments + Exam
**Status:** ❌ Not Started
**Tasks:** 20
- Razorpay order creation API
- Razorpay checkout UI
- Razorpay webhook handler
- Payment verification
- Payment status UI
- Exam schedule UI (admin)
- Exam schedule API
- Exam view UI (student)
- Exam document upload UI
- Exam document upload API
- Exam document verification
- Result declaration UI
- Result declaration API
- Result view UI

### Phase 5: Visa + Completion
**Status:** ❌ Not Started
**Tasks:** 10
- Visa checklist UI
- Visa checklist API
- Visa centers UI
- Visa centers API
- Ticket creation UI
- Ticket creation API
- Ticket list UI
- Ticket detail UI
- Ticket message API
- Ticket status management

### Phase 6: Polish + Testing
**Status:** ❌ Not Started
**Tasks:** 8
- Error handling
- Loading states
- Empty states
- Form validation
- Mobile responsive
- Performance optimization
- E2E testing
- Bug fixes

---

## 5) Multi-Agent Orchestration Plan

### Agent Team
- **Backend Agent:** API routes, DB, business logic (40% of tasks)
- **Frontend Agent:** UI pages, forms, navigation (35% of tasks)
- **DevOps Agent:** Razorpay, OTP, deployment (15% of tasks)
- **QA Agent:** Testing, validation, bug fixes (10% of tasks)

### Task Distribution
- Total estimated tasks: 83
- Backend: 33 tasks
- Frontend: 29 tasks
- DevOps: 12 tasks
- QA: 9 tasks

### Timeline
- Phase 1: 2 weeks
- Phase 2: 1 week
- Phase 3: 2 weeks
- Phase 4: 2 weeks
- Phase 5: 1 week
- Phase 6: 1 week
- **Total:** 9 weeks

---

## 6) Key Risks & Dependencies

**Risks:**
- Razorpay integration complexity
- OTP delivery reliability
- File upload security
- Concurrent payment handling
- Admin notification system missing

**Dependencies:**
- Razorpay account setup
- OTP service provider
- File storage (S3/R2)
- Email service for notifications
- Admin UI design system

---

## 7) Next Steps

1. Create detailed implementation spec
2. Create task list with IDs
3. Assign agents
4. Set up development environment
5. Begin Phase 1 implementation

---

**Document Version:** 1.0  
**Last Updated:** May 15, 2026  
**Next Review:** After spec creation
