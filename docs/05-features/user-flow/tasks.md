# User Flow Implementation Tasks

**Document:** `docs/userFlow-tasks.md`  
**Version:** 1.0  
**Date:** May 15, 2026  
**Status:** Ready for Orchestration  
**Total Tasks:** 83  
**Total Hours:** 240  
**Timeline:** 9 weeks  

---

## Phase 1: Auth & Foundation (Weeks 1-2)

### Backend Tasks (8 tasks, 24h)

#### BE-001: User registration API
- **Agent:** Backend
- **Estimate:** 4h
- **Dependencies:** None
- **Deliverables:**
  - POST `/api/auth/register` endpoint
  - Input validation (email, phone, password)
  - Password hashing
  - User creation in DB
  - OTP generation
- **Verification:**
  - [ ] API returns 201 on success
  - [ ] API returns 400 on invalid input
  - [ ] User created in DB
  - [ ] OTP sent to phone

#### BE-002: User login API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-001
- **Deliverables:**
  - POST `/api/auth/login` endpoint
  - Credential validation
  - JWT token generation
  - Token response
- **Verification:**
  - [ ] API returns 200 on success
  - [ ] API returns 401 on invalid credentials
  - [ ] JWT token contains user ID and role

#### BE-003: OTP verification API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-001
- **Deliverables:**
  - POST `/api/auth/verify-otp` endpoint
  - OTP validation
  - Mark user as verified
  - Generate JWT token
- **Verification:**
  - [ ] API returns 200 on valid OTP
  - [ ] API returns 400 on invalid/expired OTP
  - [ ] User marked as verified in DB

#### BE-004: Password reset API
- **Agent:** Backend
- **Estimate:** 4h
- **Dependencies:** BE-001
- **Deliverables:**
  - POST `/api/auth/reset-password` endpoint
  - Generate reset token
  - Send reset email
  - Update password
- **Verification:**
  - [ ] Reset email sent
  - [ ] Token expires after 1 hour
  - [ ] Password updated successfully

#### BE-005: JWT token management
- **Agent:** Backend
- **Estimate:** 2h
- **Dependencies:** BE-002
- **Deliverables:**
  - JWT middleware
  - Token validation
  - Token refresh logic
- **Verification:**
  - [ ] Middleware validates tokens
  - [ ] Protected routes require auth
  - [ ] Token refresh works

#### BE-006: Role-based access control
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-005
- **Deliverables:**
  - Role enum (STUDENT, ADMIN)
  - Role guards
  - Permission checks
- **Verification:**
  - [ ] Student cannot access admin routes
  - [ ] Admin can access all routes
  - [ ] Returns 403 for unauthorized access

#### BE-007: Admin login API
- **Agent:** Backend
- **Estimate:** 2h
- **Dependencies:** BE-002
- **Deliverables:**
  - POST `/api/admin/auth/login` endpoint
  - Admin credential validation
  - JWT token with admin role
- **Verification:**
  - [ ] API returns 200 for admin
  - [ ] API returns 401 for non-admin
  - [ ] Token has role=ADMIN

#### BE-008: Admin profile API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-006, BE-007
- **Deliverables:**
  - GET `/api/admin/auth/profile` endpoint
  - PUT `/api/admin/auth/profile` endpoint
  - Profile data management
- **Verification:**
  - [ ] GET returns profile data
  - [ ] PUT updates profile
  - [ ] Returns 401 for non-admin

### Frontend Tasks (6 tasks, 18h)

#### FE-001: Student register page
- **Agent:** Frontend
- **Estimate:** 4h
- **Dependencies:** None
- **Deliverables:**
  - Register form (email, phone, password)
  - Form validation
  - Error messages
  - Success redirect
- **Verification:**
  - [ ] Form validates input
  - [ ] Shows error messages
  - [ ] Redirects on success

#### FE-002: Student login page
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** FE-001
- **Deliverables:**
  - Login form (email/phone + password)
  - Form validation
  - Error messages
  - Success redirect
- **Verification:**
  - [ ] Form validates input
  - [ ] Shows error messages
  - [ ] Stores JWT token

#### FE-003: OTP verification UI
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** FE-001
- **Deliverables:**
  - OTP input form
  - Resend OTP button
  - Timer countdown
  - Error handling
- **Verification:**
  - [ ] OTP input accepts 6 digits
  - [ ] Resend button works
  - [ ] Shows timer

#### FE-004: Password reset UI
- **Agent:** Frontend
- **Estimate:** 4h
- **Dependencies:** FE-002
- **Deliverables:**
  - Reset request form
  - Reset confirmation form
  - Success/error messages
- **Verification:**
  - [ ] Request form validates email
  - [ ] Confirmation form validates password
  - [ ] Shows success message

#### FE-005: Admin login page
- **Agent:** Frontend
- **Estimate:** 2h
- **Dependencies:** FE-002
- **Deliverables:**
  - Admin login form
  - Admin-specific UI
  - Error messages
- **Verification:**
  - [ ] Form validates input
  - [ ] Shows admin-specific errors
  - [ ] Redirects to admin dashboard

#### FE-006: JWT token storage
- **Agent:** Frontend
- **Estimate:** 2h
- **Dependencies:** FE-002, FE-005
- **Deliverables:**
  - Token storage (localStorage)
  - Token retrieval
  - Token refresh logic
- **Verification:**
  - [ ] Token stored after login
  - [ ] Token sent with requests
  - [ ] Token refresh works

### DevOps Tasks (3 tasks, 8h)

#### DO-001: Razorpay account setup
- **Agent:** DevOps
- **Estimate:** 2h
- **Dependencies:** None
- **Deliverables:**
  - Razorpay account created
  - API keys configured
  - Webhook URL configured
- **Verification:**
  - [ ] API keys in environment
  - [ ] Webhook reachable
  - [ ] Test payment works

#### DO-002: OTP service integration
- **Agent:** DevOps
- **Estimate:** 3h
- **Dependencies:** None
- **Deliverables:**
  - OTP provider account
  - API integration
  - Rate limiting configured
- **Verification:**
  - [ ] OTP sent successfully
  - [ ] Rate limiting works
  - [ ] Error handling works

#### DO-003: JWT secret configuration
- **Agent:** DevOps
- **Estimate:** 3h
- **Dependencies:** None
- **Deliverables:**
  - JWT secret generated
  - Environment configured
  - Token expiry set
- **Verification:**
  - [ ] Secret in environment
  - [ ] Tokens expire correctly
  - [ ] Refresh tokens work

---

## Phase 2: Universities & Applications (Week 3)

### Backend Tasks (6 tasks, 18h)

#### BE-009: University list API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** None
- **Deliverables:**
  - GET `/api/universities` endpoint
  - Pagination
  - Filtering
  - Sorting
- **Verification:**
  - [ ] Returns list of universities
  - [ ] Pagination works
  - [ ] Filtering works

#### BE-010: University detail API
- **Agent:** Backend
- **Estimate:** 2h
- **Dependencies:** BE-009
- **Deliverables:**
  - GET `/api/universities/:id` endpoint
  - Full university details
- **Verification:**
  - [ ] Returns university details
  - [ ] Returns 404 for invalid ID

#### BE-011: Application submit API
- **Agent:** Backend
- **Estimate:** 4h
- **Dependencies:** BE-010
- **Deliverables:**
  - POST `/api/applications` endpoint
  - Form validation
  - Application creation
  - Timeline event generation
- **Verification:**
  - [ ] Creates application in DB
  - [ ] Generates timeline event
  - [ ] Returns 201 on success

#### BE-012: Application list API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-011
- **Deliverables:**
  - GET `/api/applications` endpoint
  - Student-specific list
  - Pagination
- **Verification:**
  - [ ] Returns student's applications
  - [ ] Pagination works

#### BE-013: Application detail API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-012
- **Deliverables:**
  - GET `/api/applications/:id` endpoint
  - Full application details
  - Timeline events
- **Verification:**
  - [ ] Returns application details
  - [ ] Returns timeline events
  - [ ] Returns 403 for other student's app

#### BE-014: Already applied check API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-013
- **Deliverables:**
  - GET `/api/student/applications/check/:universityId` endpoint
  - Check if student already applied
- **Verification:**
  - [ ] Returns true if applied
  - [ ] Returns false if not applied

### Frontend Tasks (5 tasks, 15h)

#### FE-007: University list page
- **Agent:** Frontend
- **Estimate:** 4h
- **Dependencies:** BE-009
- **Deliverables:**
  - University list UI
  - Search/filter UI
  - Loading states
- **Verification:**
  - [ ] Shows university list
  - [ ] Search works
  - [ ] Loading state shown

#### FE-008: University detail page
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-010, FE-007
- **Deliverables:**
  - University detail UI
  - Apply button
  - Already applied check
- **Verification:**
  - [ ] Shows university details
  - [ ] Apply button works
  - [ ] Already applied check works

#### FE-009: Application form (multi-step)
- **Agent:** Frontend
- **Estimate:** 5h
- **Dependencies:** BE-011, FE-008
- **Deliverables:**
  - Multi-step form UI
  - Form validation
  - Progress indicator
- **Verification:**
  - [ ] Form validates input
  - [ ] Progress indicator works
  - [ ] Submits successfully

#### FE-010: My applications page
- **Agent:** Frontend
- **Estimate:** 2h
- **Dependencies:** BE-012, FE-009
- **Deliverables:**
  - Applications list UI
  - Status badges
- **Verification:**
  - [ ] Shows applications list
  - [ ] Status badges correct

#### FE-011: Application detail page
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-013, FE-010
- **Deliverables:**
  - Application detail UI
  - Timeline UI
  - Action buttons
- **Verification:**
  - [ ] Shows application details
  - [ ] Shows timeline
  - [ ] Action buttons work

---

## Phase 3: Admin Review & Letters (Weeks 4-5)

### Backend Tasks (8 tasks, 24h)

#### BE-015: Admin dashboard API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-006
- **Deliverables:**
  - GET `/api/admin/dashboard/stats` endpoint
  - Application counts
  - Pending reviews count
- **Verification:**
  - [ ] Returns correct stats
  - [ ] Returns pending reviews

#### BE-016: Admin application list API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-015
- **Deliverables:**
  - GET `/api/admin/applications` endpoint
  - All applications list
  - Filtering
  - Sorting
- **Verification:**
  - [ ] Returns all applications
  - [ ] Filtering works
  - [ ] Sorting works

#### BE-017: Admin application detail API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-016
- **Deliverables:**
  - GET `/api/admin/applications/:id` endpoint
  - Full details
  - Timeline events
- **Verification:**
  - [ ] Returns full details
  - [ ] Returns timeline

#### BE-018: Approve/reject API
- **Agent:** Backend
- **Estimate:** 4h
- **Dependencies:** BE-017
- **Deliverables:**
  - PUT `/api/admin/applications/:id/status` endpoint
  - Approve/reject logic
  - Stage progression
  - Timeline event generation
- **Verification:**
  - [ ] Updates application status
  - [ ] Progresses stage
  - [ ] Generates timeline event

#### BE-019: Admission letter upload API
- **Agent:** Backend
- **Estimate:** 4h
- **Dependencies:** BE-018
- **Deliverables:**
  - POST `/api/admin/applications/:id/admission-letter` endpoint
  - File upload to S3/R2
  - Letter record creation
  - Timeline event generation
- **Verification:**
  - [ ] Uploads file successfully
  - [ ] Creates letter record
  - [ ] Generates timeline event

#### BE-020: Invitation letter upload API
- **Agent:** Backend
- **Estimate:** 4h
- **Dependencies:** BE-019
- **Deliverables:**
  - POST `/api/admin/applications/:id/invitation-letter` endpoint
  - File upload to S3/R2
  - Letter record creation
  - Timeline event generation
- **Verification:**
  - [ ] Uploads file successfully
  - [ ] Creates letter record
  - [ ] Generates timeline event

#### BE-021: Letter download API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-020
- **Deliverables:**
  - GET `/api/applications/:id/admission-letter` endpoint
  - GET `/api/applications/:id/invitation-letter` endpoint
  - Signed URL generation
- **Verification:**
  - [ ] Returns signed URL
  - [ ] URL expires after 5 minutes

### Frontend Tasks (6 tasks, 18h)

#### FE-012: Admin dashboard
- **Agent:** Frontend
- **Estimate:** 4h
- **Dependencies:** BE-015
- **Deliverables:**
  - Dashboard UI
  - Stats cards
  - Pending reviews list
- **Verification:**
  - [ ] Shows stats
  - [ ] Shows pending reviews

#### FE-013: Admin application list
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-016, FE-012
- **Deliverables:**
  - Applications table UI
  - Filtering UI
  - Sorting UI
- **Verification:**
  - [ ] Shows applications table
  - [ ] Filtering works
  - [ ] Sorting works

#### FE-014: Admin application detail
- **Agent:** Frontend
- **Estimate:** 4h
- **Dependencies:** BE-017, FE-013
- **Deliverables:**
  - Application detail UI
  - Timeline UI
  - Approve/reject buttons
- **Verification:**
  - [ ] Shows application details
  - [ ] Shows timeline
  - [ ] Buttons work

#### FE-015: Approve/reject UI
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-018, FE-014
- **Deliverables:**
  - Approve/reject modal
  - Confirmation dialog
  - Success/error messages
- **Verification:**
  - [ ] Modal shows
  - [ ] Confirmation works
  - [ ] Updates status

#### FE-016: Letter upload UI
- **Agent:** Frontend
- **Estimate:** 4h
- **Dependencies:** BE-019, BE-020, FE-014
- **Deliverables:**
  - File upload component
  - Progress indicator
  - Success/error messages
- **Verification:**
  - [ ] Uploads file
  - [ ] Shows progress
  - [ ] Shows success

---

## Phase 4: Payments & Exam (Weeks 6-7)

### Backend Tasks (8 tasks, 24h)

#### BE-022: Razorpay order creation API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** DO-001
- **Deliverables:**
  - POST `/api/payments/create-order` endpoint
  - Razorpay order creation
  - Order ID storage
- **Verification:**
  - [ ] Creates Razorpay order
  - [ ] Stores order ID
  - [ ] Returns order details

#### BE-023: Razorpay webhook handler
- **Agent:** Backend
- **Estimate:** 4h
- **Dependencies:** BE-022
- **Deliverables:**
  - POST `/api/payments/webhook` endpoint
  - Webhook signature verification
  - Payment status update
  - Timeline event generation
- **Verification:**
  - [ ] Verifies webhook signature
  - [ ] Updates payment status
  - [ ] Generates timeline event

#### BE-024: Payment verification API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-023
- **Deliverables:**
  - GET `/api/payments/:id` endpoint
  - Payment status retrieval
- **Verification:**
  - [ ] Returns payment status
  - [ ] Returns Razorpay details

#### BE-025: Exam schedule API
- **Agent:** Backend
- **Estimate:** 4h
- **Dependencies:** BE-018
- **Deliverables:**
  - POST `/api/admin/applications/:id/exam` endpoint
  - Exam creation
  - Timeline event generation
- **Verification:**
  - [ ] Creates exam record
  - [ ] Generates timeline event

#### BE-026: Exam update API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-025
- **Deliverables:**
  - PUT `/api/admin/applications/:id/exam` endpoint
  - Exam details update
- **Verification:**
  - [ ] Updates exam details
  - [ ] Returns updated exam

#### BE-027: Result declaration API
- **Agent:** Backend
- **Estimate:** 4h
- **Dependencies:** BE-026
- **Deliverables:**
  - PUT `/api/admin/applications/:id/exam-result` endpoint
  - Result update
  - Stage progression
  - Timeline event generation
- **Verification:**
  - [ ] Updates result
  - [ ] Progresses stage
  - [ ] Generates timeline event

#### BE-028: Document upload API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** None
- **Deliverables:**
  - POST `/api/applications/:id/exam-documents` endpoint
  - File upload to S3/R2
  - Document record creation
- **Verification:**
  - [ ] Uploads file successfully
  - [ ] Creates document record

#### BE-029: Document verification API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-028
- **Deliverables:**
  - PUT `/api/admin/documents/:id/status` endpoint
  - Accept/reject documents
  - Timeline event generation
- **Verification:**
  - [ ] Updates document status
  - [ ] Generates timeline event

### Frontend Tasks (7 tasks, 21h)

#### FE-017: Payment checkout UI
- **Agent:** Frontend
- **Estimate:** 4h
- **Dependencies:** BE-022
- **Deliverables:**
  - Razorpay checkout widget
  - Payment form
  - Error handling
- **Verification:**
  - [ ] Razorpay widget loads
  - [ ] Payment completes
  - [ ] Error handled

#### FE-018: Payment status UI
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-024, FE-017
- **Deliverables:**
  - Payment status display
  - Success/failure messages
- **Verification:**
  - [ ] Shows payment status
  - [ ] Shows success message

#### FE-019: Exam schedule UI (admin)
- **Agent:** Frontend
- **Estimate:** 4h
- **Dependencies:** BE-025, FE-014
- **Deliverables:**
  - Exam schedule form
  - Date picker
  - Location input
- **Verification:**
  - [ ] Form validates input
  - [ ] Schedules exam
  - [ ] Shows success

#### FE-020: Exam view UI (student)
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-025, FE-011
- **Deliverables:**
  - Exam details display
  - Date, location, instructions
- **Verification:**
  - [ ] Shows exam details
  - [ ] Shows location

#### FE-021: Document upload UI
- **Agent:** Frontend
- **Estimate:** 4h
- **Dependencies:** BE-028, FE-020
- **Deliverables:**
  - File upload component
  - Progress indicator
  - Success/error messages
- **Verification:**
  - [ ] Uploads document
  - [ ] Shows progress
  - [ ] Shows success

#### FE-022: Result view UI
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-027, FE-020
- **Deliverables:**
  - Result display
  - Pass/fail status
- **Verification:**
  - [ ] Shows result
  - [ ] Shows pass/fail

---

## Phase 5: Visa & Tickets (Week 8)

### Backend Tasks (6 tasks, 18h)

#### BE-030: Visa checklist API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** None
- **Deliverables:**
  - GET `/api/visa/checklist` endpoint
  - Checklist data
- **Verification:**
  - [ ] Returns checklist

#### BE-031: Visa centers API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** None
- **Deliverables:**
  - GET `/api/visa/centers` endpoint
  - Centers list
- **Verification:**
  - [ ] Returns centers list

#### BE-032: Ticket creation API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** None
- **Deliverables:**
  - POST `/api/tickets` endpoint
  - Ticket creation
- **Verification:**
  - [ ] Creates ticket
  - [ ] Returns ticket data

#### BE-033: Ticket list API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-032
- **Deliverables:**
  - GET `/api/tickets` endpoint
  - Student's tickets list
- **Verification:**
  - [ ] Returns student's tickets

#### BE-034: Ticket detail API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-033
- **Deliverables:**
  - GET `/api/tickets/:id` endpoint
  - Ticket details with messages
- **Verification:**
  - [ ] Returns ticket details
  - [ ] Returns messages

#### BE-035: Ticket message API
- **Agent:** Backend
- **Estimate:** 3h
- **Dependencies:** BE-034
- **Deliverables:**
  - POST `/api/tickets/:id/messages` endpoint
  - Message creation
- **Verification:**
  - [ ] Creates message
  - [ ] Returns message data

### Frontend Tasks (5 tasks, 15h)

#### FE-023: Visa checklist page
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-030
- **Deliverables:**
  - Checklist UI
  - Checkbox items
- **Verification:**
  - [ ] Shows checklist

#### FE-024: Visa centers page
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-031, FE-023
- **Deliverables:**
  - Centers list UI
  - Map integration
- **Verification:**
  - [ ] Shows centers
  - [ ] Shows map

#### FE-025: Ticket creation UI
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-032, FE-011
- **Deliverables:**
  - Ticket form
  - Subject input
  - Message textarea
- **Verification:**
  - [ ] Form validates
  - [ ] Creates ticket

#### FE-026: Tickets list UI
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-033, FE-025
- **Deliverables:**
  - Tickets table
  - Status badges
- **Verification:**
  - [ ] Shows tickets list
  - [ ] Status badges correct

#### FE-027: Ticket detail UI
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** BE-034, FE-026
- **Deliverables:**
  - Ticket detail display
  - Messages list
  - Reply form
- **Verification:**
  - [ ] Shows ticket detail
  - [ ] Shows messages
  - [ ] Reply form works

---

## Phase 6: Polish & Testing (Week 9)

### Frontend Tasks (4 tasks, 12h)

#### FE-028: Error handling
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** All previous FE tasks
- **Deliverables:**
  - Error boundaries
  - Error messages
  - Retry logic
- **Verification:**
  - [ ] Shows error messages
  - [ ] Retry works

#### FE-029: Loading states
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** All previous FE tasks
- **Deliverables:**
  - Loading spinners
  - Skeleton screens
- **Verification:**
  - [ ] Shows loading states
  - [ ] No layout shift

#### FE-030: Form validation
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** All forms
- **Deliverables:**
  - Real-time validation
  - Error messages
  - Success messages
- **Verification:**
  - [ ] Validates in real-time
  - [ ] Shows errors
  - [ ] Shows success

#### FE-031: Mobile responsive
- **Agent:** Frontend
- **Estimate:** 3h
- **Dependencies:** All pages
- **Deliverables:**
  - Responsive design
  - Mobile navigation
- **Verification:**
  - [ ] Works on mobile
  - [ ] Navigation works

### QA Tasks (5 tasks, 15h)

#### QA-001: Unit tests
- **Agent:** QA
- **Estimate:** 5h
- **Dependencies:** All BE tasks
- **Deliverables:**
  - 80%+ coverage
  - All API endpoints tested
- **Verification:**
  - [ ] Coverage >80%
  - [ ] All tests pass

#### QA-002: Integration tests
- **Agent:** QA
- **Estimate:** 4h
- **Dependencies:** QA-001
- **Deliverables:**
  - API integration tests
  - Database tests
- **Verification:**
  - [ ] Integration tests pass

#### QA-003: E2E tests
- **Agent:** QA
- **Estimate:** 4h
- **Dependencies:** All FE tasks
- **Deliverables:**
  - Student flow tests
  - Admin flow tests
- **Verification:**
  - [ ] E2E tests pass
  - [ ] All flows covered

#### QA-004: Performance testing
- **Agent:** QA
- **Estimate:** 2h
- **Dependencies:** QA-003
- **Deliverables:**
  - API response time <200ms
  - Load testing
- **Verification:**
  - [ ] Response time <200ms
  - [ ] Handles 100 concurrent users

#### QA-005: Security audit
- **Agent:** QA
- **Estimate:** 2h
- **Dependencies:** QA-004
- **Deliverables:**
  - Security scan
  - Vulnerability fixes
- **Verification:**
  - [ ] No critical vulnerabilities
  - [ ] OWASP Top 10 covered

---

## Summary

### Task Distribution
| Agent | Tasks | Hours | % |
|-------|-------|-------|---|
| Backend | 33 | 99 | 41% |
| Frontend | 29 | 87 | 36% |
| DevOps | 3 | 8 | 3% |
| QA | 5 | 15 | 6% |
| **Orchestrator** | **13** | **31** | **13%** |
| **TOTAL** | **83** | **240** | **100%** |

### Phase Timeline
- Phase 1: 2 weeks (17 tasks, 50h)
- Phase 2: 1 week (11 tasks, 33h)
- Phase 3: 2 weeks (14 tasks, 42h)
- Phase 4: 2 weeks (15 tasks, 45h)
- Phase 5: 1 week (11 tasks, 33h)
- Phase 6: 1 week (9 tasks, 27h)

### Quality Gates
- Phase 1: All auth tests pass, JWT working
- Phase 2: Application flow complete
- Phase 3: Admin review working
- Phase 4: Payments and exam complete
- Phase 5: Visa and tickets complete
- Phase 6: 80% coverage, all tests pass

---

**Document Version:** 1.0  
**Last Updated:** May 15, 2026  
**Status:** Ready for Orchestration  
**Next Step:** Run `./scripts/orchestrate-init.sh`
