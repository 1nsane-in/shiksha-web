# Medical Admission Management Platform - User Flows Design

**Version:** 1.0  
**Date:** May 14, 2026  
**Status:** Approved  
**Author:** Design Team

---

## Overview

This document defines the complete user flows for the Medical Admission Management Platform across all user roles.

### Roles Covered
- Student
- Admin
- Super Admin
- Agent

### Platform Scope
- Web Application (Next.js)
- Mobile Application (Android)
- All modules: Admission Workflow, LMS, Payments, Documents, Letters, Visa Support, Commission, Automation

---

## Table of Contents

1. [Student User Flows](#1-student-user-flows)
2. [Admin User Flows](#2-admin-user-flows)
3. [Agent User Flows](#3-agent-user-flows)
4. [Super Admin User Flows](#4-super-admin-user-flows)
5. [Mobile App Flows](#5-mobile-app-flows)
6. [Cross-Cutting Flows](#6-cross-cutting-flows)

---

## 1. Student User Flows

### 1.1 Authentication & Registration

#### Flow: Registration
```
Landing Page → Register Form → Email Verification → Profile Setup → Dashboard
```

**Steps:**
1. Student visits landing page
2. Clicks "Register" button
3. Fills registration form:
   - Email (required)
   - Password (required, min 8 characters)
   - Full Name (required)
   - Phone Number (required)
4. System sends verification email with OTP/link
5. Student verifies email
6. Redirected to Profile Completion form:
   - Father's Name
   - Mother's Name
   - Date of Birth
   - Gender
   - Address (Street, City, State, Country, Pincode)
   - NEET Score (if applicable)
   - NEET Rank (if applicable)
   - 12th Percentage
   - 10th Percentage
7. Profile submitted → Student Dashboard Home

**Alternative:** Social Login (Google/Microsoft)
```
Social Login Button → OAuth Redirect → Profile Completion → Dashboard
```

#### Flow: Login
```
Login Page → Email/Password → 2FA (if enabled) → Dashboard
```

**Steps:**
1. Enter email and password
2. System validates credentials
3. If 2FA enabled: Enter OTP
4. Redirect to Dashboard

#### Flow: Password Recovery
```
Forgot Password → Enter Email → Verify OTP → Reset Password → Login
```

---

### 1.2 Student Dashboard

**Dashboard URL:** `/student/dashboard`

**Components:**
- Header: Logo, Search, Notifications, Profile Menu, Logout
- Sidebar Navigation:
  - Home
  - Application
  - Documents
  - Payments
  - Letters
  - Visa Support
  - LMS
  - Settings
  - Help

**Home Page Cards:**
- Application Status Card
  - Current Stage (1-5)
  - Application Status badge
  - Progress percentage bar
  - Next action required
- Pending Documents Card
  - Count of pending documents
  - Quick access to upload
- Pending Payments Card
  - Total pending amount
  - Quick pay button
- Recent Activity Feed
  - Document approvals
  - Payment reminders
  - Announcements
  - Stage changes

---

### 1.3 Admission Stages Overview

**Stage Progression Model:**

| Stage | Name | Unlock Condition |
|-------|------|------------------|
| 1 | Initial Application | Default (after registration) |
| 2 | Entrance Exam | Stage 1 documents approved + Stage 1 payment success |
| 3 | Admission Letter | Stage 2 documents approved + Stage 2 payment success |
| 4 | Invitation Letter | Final payment success |
| 5 | Visa Support | Final payment success |

---

### 1.4 Stage 1: Initial Application

**Flow:**
```
Select University → Course Selection → Document Checklist → Upload Documents → Document Review → Stage 1 Payment → Submission Complete
```

**Detailed Steps:**

#### 1.4.1 University Selection
1. Navigate to "Application" section
2. Browse universities (filter by country, ranking, fees)
3. View university details:
   - Name, Country, City
   - Ranking
   - Courses available
   - Fees structure
   - Eligibility criteria
4. Compare universities (up to 3)
5. Select preferred university

#### 1.4.2 Course Selection
1. View available courses for selected university
2. Compare courses:
   - Duration
   - Fees (per year)
   - Total fees
   - Eligibility
   - Available seats
3. Select course
4. Confirm selection

#### 1.4.3 Document Upload

**Stage 1 Required Documents (Configurable by Admin):**
- Passport (Required)
- 10th Marksheet (Required)
- 12th Marksheet (Required)
- NEET Scorecard (Required)
- Passport Size Photo (Required)
- Signature (Required)
- Migration Certificate (Optional)
- Character Certificate (Optional)

**Upload Flow per Document:**
```
Click Upload → Select File → Validate Type/Size → Preview → Crop/Rotate (optional) → Confirm Upload → AI Processing (if enabled) → Status: UPLOADED
```

**Document Statuses:**
- NOT_STARTED: Document not uploaded
- UPLOADED: Uploaded, awaiting review
- PROCESSING: AI validation in progress
- IN_REVIEW: Admin reviewing
- APPROVED: Document verified
- REJECTED: Document rejected with remarks
- REUPLOAD_REQUIRED: Student needs to re-upload

**File Validation Rules:**
- Allowed types: jpg, jpeg, png, pdf
- Max file size: 10MB (configurable per document type)
- Min resolution for photos: 300x300 pixels

#### 1.4.4 Payment
1. All documents approved → "Pay Now" button activates
2. View payment breakdown:
   - Stage 1 Application Fee
   - Processing Fee (if any)
   - Total Amount
3. Click "Pay Now"
4. Redirect to Razorpay Checkout
5. Select payment method:
   - UPI
   - Credit/Debit Card
   - Net Banking
   - Wallet
6. Complete payment
7. Webhook received → Payment status updated to SUCCESS
8. Stage 1 marked complete
9. Stage 2 unlocked

---

### 1.5 Stage 2: Entrance Exam

**Flow:**
```
Stage 2 Unlocked → Exam Dashboard → Download Admit Card → LMS Preparation → Upload Exam Result → Stage 2 Payment → Stage 2 Complete
```

**Exam Dashboard Components:**
- Exam date, time, venue
- Admit card download (uploaded by admin)
- Center details and instructions
- LMS access for preparation
- Mock tests

**Required for Stage 2 Completion:**
- Exam Admit Card (view/download)
- Exam Result/Scorecard (upload)
- Stage 2 Payment

**LMS Integration:**
- Access study materials
- Watch video lectures
- Take mock tests
- Track progress

---

### 1.6 Stage 3: Admission Letter

**Flow:**
```
Stage 3 Unlocked → Admission Letter Available → View Watermarked Preview → Pay Final Fee → Download Full PDF
```

**Rules:**
- Student can VIEW letter with watermark before final payment
- Student can DOWNLOAD only after final payment approval
- View/Download tracked in database

**Admission Letter View:**
- Watermarked preview showing:
  - University letterhead
  - Student details
  - Course admitted
  - "PREVIEW ONLY - PAY FINAL FEE TO DOWNLOAD" watermark
- Download locked indicator
- "Pay Final Fee" button

---

### 1.7 Stage 4: Invitation Letter

**Flow:**
```
Final Payment Complete → Invitation Letter Uploaded by Admin → Download Full PDF
```

**Purpose:**
- Official invitation from university
- Required for visa application
- Contains:
  - Student details
  - University details
  - Course details
  - Duration of study
  - Financial guarantee

---

### 1.8 Stage 5: Visa Support

**Flow:**
```
Stage 5 Unlocked → View Visa Centers → View Checklist → Download Guidance Materials → Contact Consultancy (optional)
```

**Visa Support Dashboard:**

#### Visa Centers
- List of visa centers by country
- Contact details
- Address
- Website
- Working hours

#### Visa Checklist
- Country-specific document requirements
- Checklist items:
  - Invitation Letter (from Stage 4) ✓
  - Admission Letter (from Stage 3) ✓
  - Passport (from Stage 1) ✓
  - Bank Statement
  - Medical Insurance
  - HIV Test Certificate
  - Photographs (specifications)
  - Visa Application Form

#### Consultancy Support
- Contact information for visa consultancy
- Phone, Email
- Working hours

**Note:** No submission through platform - informational only

---

### 1.9 Payments Module

**Payment Stages:**
- Stage 1: Initial Application Fee
- Stage 2: Entrance Exam Fee
- Final: Final Admission Fee (unlocks letters + visa)

**Payment Dashboard:**
```
+------------------+----------------+
| Stage | Amount  | Status         |
+-------+---------+----------------+
| 1     | ₹50,000 | ✓ Paid         |
| 2     | ₹30,000 | ⏳ Pending     |
| Final | ₹1,00,000 | 🔒 Locked     |
+-------+---------+----------------+
```

**Payment Flow:**
1. Student views payment dashboard
2. Clicks "Pay" on pending payment
3. Views amount breakdown
4. Redirects to Razorpay Checkout
5. Selects payment method
6. Completes authentication
7. Payment processed
8. Webhook hits backend
9. Backend verifies signature
10. Payment status updated
11. Stage unlocked (if requirements met)

**Payment Statuses:**
- PENDING: Payment initiated, not completed
- PROCESSING: Payment in progress
- SUCCESS: Payment successful
- FAILED: Payment failed
- REFUNDED: Payment refunded
- MANUALLY_APPROVED: Approved by admin (offline payment)

---

### 1.10 LMS Module (Student)

**Flow:**
```
LMS Dashboard → Course List → Subject Selection → Video Lectures/Study Materials → Mock Tests → Results → Certificate
```

**Components:**

#### Course Dashboard
- Enrolled courses with progress
- Recent activity (last watched video, last test)
- Upcoming tests
- Course completion certificates

#### Course View
- Course modules/subjects
- Progress per subject
- Continue where left off

#### Video Lecture
- Video player with controls
- Module navigation
- Personal notes
- Question/Ask feature
- Progress auto-save

#### Mock Test Flow
```
Start Test → Timer Starts → Answer Questions → Auto Submit (time up) OR Manual Submit → Calculate Results → Show Score → Review Answers
```

#### Test Result
- Total score
- Percentage
- Correct/Wrong/Skipped breakdown
- Time taken
- Subject-wise performance
- Review answers option
- Retake option

#### Progress Tracking
- Course completion percentage
- Videos watched
- Tests completed
- Average test scores
- Time spent learning

---

### 1.11 Notifications (Student)

**Notification Types:**
- Document approved/rejected
- Payment success/failed/reminder
- Stage unlock
- New announcement
- Letter available
- Visa support unlocked
- Test results

**Delivery Channels:**
- In-app notifications
- Email
- SMS (if enabled)
- Push notifications (mobile)

---

### 1.12 Settings (Student)

**Profile Settings:**
- Edit personal details
- Change password
- Profile photo
- Contact details

**Notification Preferences:**
- Email notifications toggle
- SMS notifications toggle
- Push notifications toggle
- Document updates toggle
- Payment reminders toggle
- Stage changes toggle
- Announcements toggle

**Security:**
- Two-factor authentication
- Active sessions
- Login history
- Logout all devices

---

## 2. Admin User Flows

### 2.1 Admin Authentication

**URL:** `/admin/login`

**Flow:**
```
Admin Login → Email/Password → 2FA (if required by settings) → Admin Dashboard
```

**Security:**
- Rate-limited login attempts (max 5)
- Account lockout after failed attempts
- Session timeout (configurable)
- IP whitelist (optional)

---

### 2.2 Admin Dashboard

**Dashboard URL:** `/admin/dashboard`

**Widgets:**
- Quick Stats:
  - Total students (with weekly growth)
  - Pending document reviews
  - Today's payments
  - Active agents
- Pending Verifications Queue:
  - Priority-sorted list
  - Quick approve/reject actions
- Stage Distribution Chart
- Recent Activity Feed
- Agent Commission Summary

---

### 2.3 Student Management (Admin)

**URL:** `/admin/students`

**List View:**
- Search by name, email, phone
- Filter by:
  - Stage
  - Status
  - Assigned agent
  - University
- Columns:
  - Name, Email, Phone
  - Stage, Status
  - Assigned Agent
  - University
  - Actions (View, Edit, Assign Agent)

**Student Detail View:**
- Profile section
- Application status section
- Documents section
- Payments section
- Activity log
- Stage history

**Actions:**
- View student details
- Edit student information
- Assign/Change agent
- Manually change stage (with audit)
- View activity history
- Delete student (soft delete, audit logged)

---

### 2.4 Document Verification (Admin)

**URL:** `/admin/documents`

**Queue View:**
- Priority-sorted pending documents
- Filters:
  - Document type
  - Student
  - Uploaded date
  - AI status
- Quick actions:
  - View document
  - Approve
  - Reject
  - Skip

**Document Review Panel:**
- Document preview (image/PDF viewer)
- AI Analysis Panel (if enabled):
  - Document type detected
  - Confidence score
  - Extracted fields
  - Flags/Warnings
  - Recommended action
- Student submitted info comparison
- Remarks field
- Actions:
  - Approve
  - Reject
  - Download original
  - Skip to next

**Approval Flow:**
```
View Document → Compare with AI Data → Approve/Reject → Add Remarks → Update Status → Notification to Student → Check Stage Unlock
```

**Rejection Flow:**
```
View Document → Identify Issues → Reject → Add Rejection Reason → Status: REJECTED → Notification to Student → Allow Re-upload
```

---

### 2.5 Payment Management (Admin)

**URL:** `/admin/payments`

**Summary Cards:**
- Today's collection
- This week collection
- This month collection
- Pending payments total

**List View:**
- Filter by:
  - Status
  - Stage
  - Date range
  - Student
- Columns:
  - Student
  - Stage
  - Amount
  - Status
  - Date
  - Transaction ID
  - Actions

**Actions:**
- View payment details
- Download receipt
- Manual approval (offline payments)
- Initiate refund
- Export to CSV/Excel

**Manual Payment Approval:**
1. Select pending payment
2. Click "Mark Manually Approved"
3. Enter:
   - Payment reference (bank/UPI/other)
   - Approval note
4. Click "Approve Manually"
5. System logs to audit trail
6. Stage updated

**Refund Flow:**
1. View payment details
2. Click "Initiate Refund"
3. Enter refund amount (partial allowed)
4. Enter refund reason
5. Click "Initiate Refund via Razorpay"
6. Refund processed by Razorpay
7. Status updated to REFUNDED

---

### 2.6 Agent Management (Admin)

**URL:** `/admin/agents`

**List View:**
- Agent name, email
- Assigned students count
- Commission summary
- Status (Active/Inactive)
- Actions

**Agent Detail View:**
- Profile
- Stats:
  - Total students
  - Students per stage
- Assigned students list
- Commission history
- Activity log

**Actions:**
- Add new agent
- Edit agent details
- Assign students to agent
- Enable/Disable agent
- View commission details
- Mark commission as paid

**Add Agent:**
```
Add Agent Button → Enter Details (Name, Email, Phone) → Set Commission Rate → Create Account → Send Credentials to Agent
```

**Assign Students:**
```
Select Agent → View Available Students → Select Students → Assign
```

---

### 2.7 University Management (Admin)

**URL:** `/admin/universities`

**List View:**
- University name, country
- Courses count
- Students enrolled
- Ranking
- Status
- Actions

**University Detail:**
- Basic info (name, country, city, website, ranking)
- Logo
- Courses list
- Enrolled students summary
- Settings (active/inactive)

**Course Management:**
- Add/Edit courses
- Course details:
  - Name
  - Duration (years)
  - Fees (per year)
  - Total seats
  - Available seats
  - Eligibility

---

### 2.8 Letters Management (Admin)

**URL:** `/admin/letters`

**Admission Letters:**
1. Filter students by stage (Stage 3+)
2. Select student
3. Upload admission letter PDF
4. Set downloadable flag:
   - Yes: Student can download
   - No: Preview only with watermark
5. Save

**Invitation Letters:**
1. Filter students (Final payment done)
2. Select student
3. Upload invitation letter PDF
4. Save (always downloadable for visa purposes)

**Batch Upload:**
- Upload multiple letters at once
- Map files to students by filename pattern or manual mapping

---

### 2.9 Visa Centers Management (Admin)

**URL:** `/admin/visa-centers`

**Visa Centers:**
- List by country
- Add/Edit/Delete centers
- Fields:
  - Name
  - Address
  - City, Country
  - Contact number
  - Email
  - Website

**Visa Checklists:**
- Country-specific document requirements
- Add/Edit checklist items
- Mark as required/optional
- Update specifications

---

### 2.10 LMS Management (Admin)

**URL:** `/admin/lms`

**Course Management:**
- Create courses
- Edit course details
- Delete courses

**Course Structure:**
```
Course → Subjects → Modules → Content (Video/PDF) + Tests
```

**Content Upload:**
- Videos (upload or embed link)
- PDFs
- Notes

**Test Creation:**
- Test name
- Duration (minutes)
- Total questions
- Passing marks (%)
- Questions:
  - Question text
  - Options (A, B, C, D)
  - Correct answer
  - Marks per question

**Enrollment:**
- Assign courses to students
- Bulk enrollment by:
  - Stage
  - University
  - Individual selection

**Results Dashboard:**
- View all test results
- Filter by course, student, date
- Export results

---

### 2.11 Reports (Admin)

**URL:** `/admin/reports`

**Report Types:**

#### Student Reports
- Stage-wise students count
- Application status summary
- Agent performance
- University enrollment

#### Payment Reports
- Daily collection
- Stage-wise payments
- Pending payments
- Refund report

#### Document Reports
- Pending verifications
- Approval/Rejection rate
- Document type summary

#### Analytics
- Conversion rate (registration → completion)
- Average time per stage
- Monthly trends
- Student drop-off analysis

**Export Formats:**
- CSV
- Excel
- PDF

---

### 2.12 Settings (Admin)

**URL:** `/admin/settings`

**General Settings:**
- Platform name
- Logo & branding
- Contact info

**Notification Settings:**
- Email templates
- SMS gateway configuration
- WhatsApp integration

**Payment Settings:**
- Razorpay credentials
- Payment amounts per stage
- Refund policy

**Stage Configuration:**
- Stage requirements
- Document requirements per stage
- Unlock rules

**AI Settings:**
- Enable/disable AI validation
- Confidence threshold
- Auto-approval rules

**Security:**
- Two-factor authentication requirement
- Session timeout
- IP whitelist

---

### 2.13 Audit Logs (Admin)

**URL:** `/admin/audit-logs`

**Log Fields:**
- Timestamp
- User (who performed action)
- Action type
- Entity type (Student, Document, Payment, etc.)
- Entity ID
- Old value (before change)
- New value (after change)
- IP address
- User agent

**Filters:**
- User
- Action type
- Entity type
- Date range

**Actions:**
- Export logs
- Clear old logs (older than X days)

---

## 3. Agent User Flows

### 3.1 Agent Authentication

**Note:** Agent accounts are created by Admin, not self-registration.

**Flow:**
```
Admin Creates Agent → Agent receives credentials via email → Agent Login → Change password → Dashboard
```

**Login:**
- Email and password
- Role check: AGENT
- Redirect to Agent Dashboard

---

### 3.2 Agent Dashboard

**URL:** `/agent/dashboard`

**Widgets:**
- Assigned students count
- Active students count
- Pending actions (students needing attention)
- Pending commission amount
- Stage distribution of assigned students
- Recent commission credits
- Students requiring attention list

---

### 3.3 Student Management (Agent)

**URL:** `/agent/students`

**Agent Permissions:**
- View assigned students only
- Cannot edit student profiles
- Cannot approve/reject documents
- Cannot change stages
- Cannot process payments

**List View:**
- Filter by stage, status
- Search by name, phone

**Student Detail View:**
- Profile (view only)
- Application status
- Document status (view, not download)
- Payment status
- Commission for this student
- Communication log

**Actions Agent CAN Perform:**
- View student details
- Contact student (call/WhatsApp/email)
- Log communication
- Send payment reminders
- Send document upload reminders
- View own commission status

**Actions Agent CANNOT Perform:**
- Edit student profiles
- Approve/reject documents
- Change student stages
- Process payments
- Upload letters
- Access other agents' students
- Access admin settings

---

### 3.4 Commission Tracking (Agent)

**URL:** `/agent/commission`

**Dashboard:**
- Total earned
- Pending commission
- Paid commission
- On-hold commission

**Commission History:**
- Date
- Student
- Stage
- Amount
- Status (Pending/Paid/On-Hold/Cancelled)
- Paid on
- Remarks

**Commission Detail:**
- Commission ID
- Student details
- Stage
- Amount
- Calculation (rate × payment)
- Status
- Expected payment date

**Actions:**
- Download statement (PDF/Excel)
- Contact admin regarding commission

---

### 3.5 Agent Settings

**Profile:**
- View profile
- Change password

**Notification Preferences:**
- Email when student makes payment
- Email when student uploads document
- SMS notifications
- Push notifications
- Commission credit alerts

**Communication Settings:**
- Default WhatsApp message templates
- Reminder frequency

---

## 4. Super Admin User Flows

### 4.1 Additional Permissions

| Permission | Admin | Super Admin |
|------------|-------|-------------|
| View all students | ✓ | ✓ |
| Edit any student | ✓ | ✓ |
| Delete student | ✗ | ✓ |
| Add/Edit admins | ✗ | ✓ |
| Delete admins | ✗ | ✓ |
| System settings | View | Full Access |
| Audit logs | View | View + Export |
| API keys | ✗ | ✓ |
| Organization settings | ✗ | ✓ |
| Integration setup | ✗ | ✓ |
| Billing/Subscription | ✗ | ✓ |

### 4.2 Admin Management

**URL:** `/admin/admins`

**List View:**
- Admin name, email
- Role (ADMIN/SUPER_ADMIN)
- Status
- Last login
- Actions

**Actions:**
- Add admin user
- Edit admin
- Enable/Disable admin
- Delete admin (soft delete)

**Add Admin:**
- Name, Email, Phone
- Role selection
- Custom permissions (if ADMIN role)
- Send invitation email

---

### 4.3 API Keys & Webhooks

**URL:** `/admin/api-keys`

**API Keys:**
- Generate new key
- View key prefix
- Last used
- Expiration
- Revoke

**Webhooks:**
- Create webhook endpoint
- URL
- Events to trigger
- Status
- Test webhook
- View delivery history

**Available Events:**
- student.created
- student.stage_changed
- payment.success
- payment.failed
- document.uploaded
- document.approved
- document.rejected
- commission.generated
- letter.uploaded

---

### 4.4 Integrations

**URL:** `/admin/integrations`

**Communication Integrations:**
- Twilio (SMS)
- MSG91 (SMS)
- WhatsApp Business API
- SendGrid (Email)
- Mailgun (Email)

**Analytics Integrations:**
- Google Analytics

**Other Integrations:**
- Google Calendar
- Zoom
- Slack

**Configuration:**
- Provider selection
- API credentials
- Test connection
- Disconnect

---

### 4.5 Billing & Subscription

**URL:** `/admin/billing`

**Subscription Dashboard:**
- Current plan
- Usage (students, admins, storage)
- Billing cycle
- Next payment date
- Payment method

**Plans:**
- FREE (10 students, 2 admins)
- STARTER (100 students, 5 admins)
- PROFESSIONAL (1000 students, 10 admins)
- ENTERPRISE (Unlimited)

**Actions:**
- Upgrade plan
- Downgrade plan
- Cancel subscription
- Update payment method
- View invoices
- Download invoices

---

### 4.6 System Settings

**URL:** `/admin/system-settings`

**General:**
- Platform name
- Support email/phone
- Timezone
- Date format

**Security:**
- Session timeout
- Max login attempts
- Password policy
- 2FA required for admins
- IP whitelist

**File Storage:**
- Storage provider (AWS S3 / Cloudflare R2)
- Max file size
- Allowed file types
- Bucket configuration

**AI Settings:**
- Enable/disable AI document validation
- Confidence threshold
- Auto-flag low confidence

**Feature Flags:**
- Enable/disable features
- Rollout percentage
- Target users

---

## 5. Mobile App Flows

### 5.1 App Structure

**Bottom Navigation:**
- Home
- Documents
- Payments
- LMS
- More (Settings, Help)

### 5.2 Platform-Specific Features

#### Push Notifications
- Payment reminders
- Document status updates
- Stage changes
- New announcements
- Test results

#### Document Upload (Mobile)
```
Tap Upload → Camera/Gallery → Take Photo/Select → Auto-detect edges (optional) → Crop/Rotate → Confirm → Upload Progress → Complete
```

#### Payment (Mobile)
- Deep link to UPI apps (GPay, Paytm, PhonePe)
- In-app WebView for card payments
- Razorpay SDK integration

#### Offline Capabilities
- Download videos for offline viewing
- Download study materials (PDFs)
- View downloaded certificates
- Access cached notification history

---

## 6. Cross-Cutting Flows

### 6.1 Automation Flows

#### Payment Reminders
- Trigger: Stage payment pending after X days
- Action: Send email/SMS/WhatsApp reminder
- Frequency: Configurable (daily, weekly)

#### Document Reminders
- Trigger: Document pending after X days
- Action: Send reminder
- Include: Document type, instructions

#### Stage Change Alerts
- Trigger: Student stage changed
- Action: Notify student, agent (if assigned)
- Include: New stage, next actions

#### Admin Task Alerts
- Trigger: Document pending review, manual payment pending
- Action: Alert admin dashboard
- Include: Priority, due time

### 6.2 Notification Flow

```
Event Occurs → Check Notification Preferences → Queue Notification → Send via Channels → Log Delivery
```

**Channels:**
- In-app (real-time via WebSocket)
- Email (SendGrid/Mailgun)
- SMS (Twilio/MSG91)
- WhatsApp (Business API)
- Push (Mobile)

### 6.3 Audit Flow

```
Sensitive Action → Capture Before State → Perform Action → Capture After State → Log to Audit → Include Metadata (IP, User Agent, Timestamp)
```

**Audited Actions:**
- Student stage changes
- Document approvals/rejections
- Payment manual approvals
- Commission status changes
- Admin added/deleted
- Settings changes
- Login/logout

---

## Summary

This document provides a comprehensive overview of all user flows for the Medical Admission Management Platform. Each flow has been designed to:

1. Support the 5-stage admission workflow
2. Provide role-appropriate access and permissions
3. Include proper validation and verification steps
4. Maintain audit trails for sensitive actions
5. Support both web and mobile interfaces
6. Enable automation for reminders and alerts

---

**Document Status:** Approved for Implementation  
**Next Step:** Implementation planning and development
