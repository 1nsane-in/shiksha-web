# Shiksha — App Flow Document

> **Platform:** Android App
> **Purpose:** Help Indian students pursue MBBS abroad (Russia, Ukraine, Kazakhstan)
> **Personas:** Student, Parent

---

## 1. Product Overview

### 1.1 Vision

Shiksha is a mobile-first platform that simplifies the entire journey of an Indian student seeking MBBS admission abroad — from university discovery to visa support. The app removes the opacity, paperwork fragmentation, and payment anxiety that plague the current study-abroad experience.

### 1.2 Target Countries (V1)

| Country | Language of Instruction | Typical Duration |
|---------|------------------------|------------------|
| Russia | English / Russian | 6 years |
| Ukraine | English / Ukrainian | 6 years |
| Kazakhstan | English / Kazakh | 5-6 years |

Expansion to more countries is planned post-V1.

### 1.3 Personas

#### Student

The primary user. A student who has completed 12th grade (PCB) with NEET qualification. They use Shiksha to:

- Browse and compare universities
- Submit applications and track their status
- Upload required documents
- Make stage-wise payments
- Receive admission and invitation letters
- Access visa and travel support

#### Parent

A linked secondary user. A parent/guardian who is invited by the student during onboarding. They use Shiksha to:

- View their child's application progress in real time
- Send money directly to universities (tuition, hostel fees)
- Send funds to the student's linked account for expenses
- Stay notified of key milestones

### 1.4 App Navigation (Bottom Tab Bar)

| Tab | Description |
|-----|-------------|
| **Home** | Dashboard showing current stage, upcoming actions, notifications feed |
| **Courses** | University catalog, course comparison, eligibility checker |
| **Application** | Full application pipeline — stage tracking, document uploads, payment history |
| **Profile** | Personal info, documents vault, settings, logout |

---

## 2. Complete Student Journey

### 2.1 Onboarding & Registration

1. Student downloads the app and registers (email + OTP, or Google).
2. Completes profile: name, DOB, gender, address, phone.
3. Uploads essential documents for identity verification:
   - Aadhaar Card
   - PAN Card
   - Class 10th Marksheet
   - Class 12th Marksheet (PCB)
   - NEET Scorecard / Admit Card
   - Passport (or apply-now-with-later option)
4. Invites a parent via phone number or email. Parent receives a link to create their linked account.
5. Student selects target country / countries and preferred courses.

Once onboarding is complete, the student is directed to the **Home** tab where their active application stage is displayed prominently.

### 2.2 Stage 1 — Initial Admission Application

**Unlock Condition:** Onboarding completed, identity documents verified.

**Steps:**

1. **Browse Universities** — The Courses tab lists all universities with:
   - University name, location, rankings
   - Course fee structure (tuition + hostel + miscellaneous)
   - Eligibility criteria (NEET cutoff, minimum 12th %)
   - Infrastructure highlights
   - Recognition bodies (NMC, WHO, ECFMG)

2. **Shortlist & Compare** — Students can shortlist universities and compare them side-by-side on fees, ranking, and facilities.

3. **Submit Application** — Student selects a university and course, then submits their application. This includes:
   - Academic history (10th, 12th, NEET scores)
   - Personal details
   - Passport copy
   - University-specific documents (if any)

4. **Processing Fee Payment** — A non-refundable application processing fee is charged:
   - Gateway: Razorpay
   - Status: PENDING → SUCCESS / FAILED
   - On success → application moves to `STAGE_1_IN_REVIEW`

5. **Application Forwarding** — The application is forwarded to the university:
   - Method 1: Email notification with application PDF and platform access link
   - Method 2: University admin can log into Shiksha (university portal) to view and manage applications
   - Application status updates as the university processes it

**Stage 1 requires:**
- Documents: Aadhaar, PAN, 12th Marksheet, NEET Scorecard, Passport
- Payment: Application processing fee (one-time)
- System action: Notify admin → forward to university

**Exit Gate:** Application status changes to `STAGE_1_APPROVED` (by admin/university).

---

### 2.3 Stage 2 — Admission Letter & Exam Dashboard

**Entry Condition:** Stage 1 approved.

**Steps:**

1. **Admission Letter Issuance** — The university issues an admission letter:
   - Uploaded to the platform (signed URL, watermarked preview)
   - Also emailed to the student
   - Letter contains: student name, course, university details, program start date

2. **Admission Confirmation Payment** — Student pays the first tuition installment / confirmation fee:
   - Amount determined by university
   - Gateway: Razorpay
   - On success → system marks `STAGE_2_APPROVED`

3. **Exam Dashboard Unlocks** — After payment approval:
   - Student can view entrance exam schedule
   - Exam syllabus, format, and preparation resources
   - Previous year papers (if provided by university)

4. **Entrance Exam** — The student appears for the university's entrance exam (online or offline based on university policy).

**Stage 2 requires:**
- Documents: Admission Letter (system-generated)
- Payment: Confirmation fee / first tuition installment
- System action: Watermarked admission letter → email + in-app notification → exam dashboard

**Exit Gate:** Exam cleared + payment confirmed.

---

### 2.4 Stage 3 — Invitation Letter Process

**Entry Condition:** Stage 2 approved (exam cleared + payment confirmed).

**Steps:**

1. **Invitation Letter Issuance** — The university issues an invitation letter (required for visa application):
   - Uploaded to platform (signed URL, watermarked preview)
   - Also emailed to student
   - Letter contains: student details, university confirmation, program duration, accommodation details

2. **Invitation Letter Fee Payment** — Student pays the processing fee for the invitation letter:
   - Amount determined by university
   - Gateway: Razorpay
   - On success → `STAGE_3_APPROVED` and letter becomes downloadable

3. **Download** — Student can download the invitation letter (watermark removed on final payment, or kept watermarked until arrival — configurable).

**Stage 3 requires:**
- Documents: Invitation Letter (system-generated)
- Payment: Invitation letter processing fee
- System action: Watermarked invitation letter → email + in-app notification → download access

**Exit Gate:** Payment confirmed, letter downloadable.

---

### 2.5 Stage 4 — Visa Support

**Entry Condition:** Stage 3 approved.

**Steps:**

1. **Visa Documentation Checklist** — Student is shown a personalized checklist of visa-required documents:
   - Valid passport (with minimum 6 months validity)
   - Invitation letter (downloaded from Stage 3)
   - Admission letter
   - Passport-size photographs
   - Medical fitness certificate
   - HIV test report
   - Bank statements (or parent's financial proof)
   - Visa application form

2. **Document Upload** — Student uploads visa-related documents for verification.

3. **Visa Guidance** — The platform provides:
   - Step-by-step visa application guide
   - Nearest visa center details (VFS Global, embassy, consulate)
   - Appointment booking assistance

4. **Pre-Departure Services** — After visa is secured:
   - Flight booking assistance
   - Airport pick-up arrangement at destination
   - Accommodation facilitation (hostel / university housing)
   - Pre-departure orientation (packing list, culture tips, emergency contacts)

**Stage 4 requires:**
- Documents: Visa application docs, medical certificates
- Payment: Visa support fee (if applicable); flight & travel costs
- System action: Visa checklist → document verification → service coordination

**Exit Gate:** Student departs and arrives at the university.

---

### 2.6 Stage 5 — Post-Arrival & Ongoing Support

**Entry Condition:** Student arrives at destination.

**Steps:**

1. **University Registration** — Assistance with on-campus registration and orientation.
2. **Local Support** — Contact details for university coordinator, local Shiksha representative.
3. **Parent Connection** — Parent receives arrival confirmation notification.
4. **Ongoing Milestones** — Semester reminders, exam schedules, fee due dates.

**Stage 5 is ongoing** for the duration of the program.

---

## 3. Parent Experience

### 3.1 Parent Onboarding

1. Parent receives an invite link (SMS / email) from the student during student onboarding.
2. Parent downloads the app and registers using the invite link.
3. Parent account is automatically linked to the student.
4. Parent sees a dashboard with their child's name and current progress.

### 3.2 Parent Dashboard (Home Tab)

The parent's Home tab shows:

- **Child's Current Stage** — Visual progress bar with the 5 stages, highlighted at the current one
- **Recent Activity Feed** — Timeline of status changes, payments made, documents verified
- **Action Required Alerts** — If a payment is pending, if documents need attention
- **Quick Send Money** — FAB or prominent button to initiate a transfer

### 3.3 Send Money to Student

Parents can send money in two ways:

**Option A — Direct University Payment**
- Parent pays tuition fees / hostel fees directly to the university
- Payment is processed through Razorpay, receipt and confirmation are shared with both parent and university
- Transaction history maintained in the app

**Option B — Send Funds to Student**
- Parent sends money to a student-held account or digital wallet linked to the app
- Student can use these funds for living expenses, travel, accommodation
- Transaction tracking with date, amount, and purpose

### 3.4 Application Tracking

The **Application** tab for parents mirrors their child's application pipeline but is read-only:

- Stage-by-stage progress with completion status
- Documents uploaded (viewable but not editable)
- Payment history with receipts
- Letters (admission, invitation) viewable
- Communication from admin

Parent cannot submit or edit anything — only monitor and pay.

---

## 4. Document Pipeline

### 4.1 Required Documents (by Category)

| Category | Documents |
|----------|-----------|
| **Identity** | Aadhaar Card, PAN Card, Passport |
| **Academic** | 10th Marksheet, 12th Marksheet (PCB), NEET Scorecard |
| **Medical** | Medical Fitness Certificate, HIV Test Report |
| **University** | Admission Letter, Invitation Letter (system-generated) |
| **Visa** | Visa Application Form, Bank Statements, Photographs |

### 4.2 Document Lifecycle

```
UPLOAD → IN_REVIEW → APPROVED / REJECTED
                         ↓
                  REUPLOAD_REQUIRED → UPLOAD → ...
```

- Documents are stored in private object storage (S3 / R2).
- Only metadata (file URL, type, size, status, version) is stored in PostgreSQL.
- Signed URLs with expiry are used for viewing/downloading.
- Admins can approve/reject with remarks. Student re-uploads after rejection.
- Version tracking: each re-upload creates a new version; old versions are retained for audit.

---

## 5. Payment Architecture

### 5.1 Payment Stages

| Stage | Payment Description | Trigger |
|-------|---------------------|---------|
| Stage 1 | Application processing fee | Submitted to admin review |
| Stage 2 | Admission confirmation / first tuition installment | Admission letter received |
| Stage 3 | Invitation letter processing fee | Invitation letter received |
| Stage 4+ | Visa support, flight, travel services | Visa process initiated |
| Ongoing | Semester tuition, hostel fees | Semester cycles |

### 5.2 Payment Gateway

- **Provider:** Razorpay
- **Statuses:** PENDING → PROCESSING → SUCCESS / FAILED
- **Special statuses:** REFUNDED, MANUALLY_APPROVED (admin override)
- **Webhook-driven:** Payment confirmation relies on Razorpay webhooks, not just app-side success response
- **Receipts:** Digital receipts stored in the app for every transaction

### 5.3 Payment Flow

```
Student taps "Pay Now"
  → Razorpay order created (backend)
  → Payment UI opens (UPI / Card / NetBanking / Wallet)
  → Success → Webhook hits backend → Status updated → Stage unlocked
  → Failure → Retry option
  → Manual approval → Admin marks MANUALLY_APPROVED
```

---

## 6. Notification Strategy

| Event | Channel |
|-------|---------|
| Application submitted | In-app + Email |
| Application approved | In-app + SMS + Email |
| Document approved / rejected | In-app + Email |
| Payment due reminder | In-app + SMS |
| Payment received | In-app + Email |
| Admission letter issued | In-app + Email |
| Invitation letter issued | In-app + Email |
| Visa checklist ready | In-app |
| Visa appointment reminder | In-app + SMS |
| Travel coordination | In-app + Email |
| Parent payment notification | In-app + SMS |
| Stage unlocked | In-app push notification |

---

## 7. Future Ideas

These are potential post-V1 enhancements that came up during design:

### 7.1 Multi-University Applications
Allow students to apply to multiple universities simultaneously (with a primary and backup preference). Each application progresses independently through its own stages.

### 7.2 Agent / Consultant Module
A new persona (Agent) who can register students in bulk, track commissions, and manage their portfolio of applicants. This would unlock a revenue model for Shiksha.

### 7.3 University Comparison Tool
A side-by-side comparison view for 2-3 universities covering fees, ranking, recognition, infrastructure, intake capacity, and placement history — all with visual indicators.

### 7.4 Peer Community & Alumni Connect
A community feature where prospective students can ask questions to current students or alumni of specific universities. This builds trust and reduces drop-off at the consideration stage.

### 7.5 Document Expiry Tracking
Proactive reminders for passport renewal, visa expiry, medical certificate validity — with a calendar view of all upcoming document expiries.

### 7.6 Scholarship & Loan Matching
Students input their profile (NEET score, 12th %, family income) and the system suggests applicable scholarships or education loan providers.

### 7.7 In-App Translation
Real-time translation of university documents, letters, and communication from Russian/Ukrainian/Kazakh to English or Hindi.

### 7.8 Parent-to-Student Wallet
Parents maintain a digital wallet balance in the app and can transfer funds to the student instantly. The student can withdraw or use it for university fees directly.

---

## 8. Glossary

| Term | Definition |
|------|------------|
| Stage | One of 5 sequential phases in the admission pipeline |
| Stage Gate | The condition that must be met to progress to the next stage |
| Admission Letter | Official university document confirming admission offer |
| Invitation Letter | Official document required for visa application |
| Signed URL | Time-limited URL for secure document access |
| Watermark | Overlay on document previews to prevent unauthorized sharing |
| Razorpay | Payment gateway used for all transactions |
| NMC | National Medical Commission (India) — recognition body for foreign medical degrees |

---

## 9. Appendix — Stage Transition Summary

| Stage | Name | Entry Condition | Key Action | Exit Gate |
|-------|------|----------------|------------|-----------|
| 1 | Initial Application | Onboarding complete | Submit application + processing fee | Admin/university approval |
| 2 | Admission & Exam | Stage 1 approved | Admission letter received + confirmation payment | Exam cleared |
| 3 | Invitation Letter | Stage 2 approved | Invitation letter received + processing fee | Payment confirmed |
| 4 | Visa Support | Stage 3 approved | Visa documents + travel arrangements | Student departs |
| 5 | Post-Arrival | Student arrives | Ongoing support | Program completion |
