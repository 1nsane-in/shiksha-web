# APP_FLOW_V2 - Student & Parent Journey

## Overview
A comprehensive platform for Indian students to pursue MBBS and other medical courses abroad (Russia, Ukraine, Georgia, Kazakhstan, Turkey, Philippines, China, etc.), with complete parent oversight and integrated financial support throughout the application-to-enrollment journey.

**Core Focus:** Simplified navigation with primary sections - Home, Courses, Application, Profile for students, with corresponding parent dashboard and payment features.

---

## User Roles & Access Points

### Student Portal
**Primary Sections:**
- **🏠 Home** - Application status, deadlines, notifications, quick actions
- **📚 Courses** - Browse universities, filters, compare programs
- **📝 Application** - Active applications, document uploads, payment status
- **👤 Profile** - Personal info, documents, academic records, settings

### Parent Portal
**Primary Sections:**
- **📊 Dashboard** - Student progress overview, payment history
- **💳 Payments** - Make payments, view receipts, manage methods
- **📄 Documents** - View submitted documents (read-only)
- **🔔 Notifications** - Progress updates, payment reminders

---

## Complete Flow Journey

### Phase 1: Discovery & Registration

**Student Actions:**
1. Land on platform homepage with search for medical courses abroad
2. Browse countries (Russia, Ukraine, Georgia, Kazakhstan, etc.)
3. View university listings with key details:
   - Fees range ($2,000 - $8,000/year)
   - Recognition status (WHO, NMC, ECFMG)
   - Medium of instruction (English)
   - Hostel facilities
   - Student reviews
4. Click "Apply Now" to register
5. Sign up with email/phone + Google OAuth  
6. Receive verification OTP
7. Complete basic profile (name, DOB, contact)
8. **Critical - Upload Essential Documents:**
   - Aadhaar Card (PDF, JPG - max 5MB)
   - PAN Card (PDF, JPG - max 5MB)
   - Passport (must be valid for 18+ months)
   - 10th Marksheet & Certificate
   - 12th Marksheet & Certificate  
   - NEET Scorecard (minimum eligibility check)
   - Birth Certificate
   - Passport-size photos (white background)
   - Medical Certificate

**System Actions:**
- Auto-verify document formats and sizes
- Extract OCR data for auto-filling forms
- Validate NEET score against university requirements
- Calculate profile completion percentage
- Send verification emails/SMS

**Parent Actions:**
1. Receive email invitation when student completes profile
2. Click invite link to create parent account
3. Verify relationship with student (mobile OTP verification)
4. Complete parent profile (occupation, income details)
5. Link to student's profile with read-only access

**Key Features:**
- Profile completion tracker with visual progress bar
- Document quality checker (image resolution, format validation)
- Automatic document categorization
- Upload progress saved as draft

---

### Phase 2: University Selection & Application Submission

**Student Actions:**
1. **From Home/Courses Tab:**
   - Browse universities by filters:
     - Country
     - Fee range slider ($2k-$10k/year)
     - NEET score eligibility
     - Recognition (WHO, NMC, ECFMG)
     - Intake period (September 2024, March 2025, etc.)
     - Hostel availability
   - View university details page with:
     - Course curriculum
     - Duration (5-6 years)
     - Fee structure table
     - Accommodation details
     - Gallery with campus photos
     - Student reviews (4.5/5)
     - Statistics (93% admission rate)

2. **Shortlist Universities:**
   - Add to "My Favorites" with heart icon
   - Compare side-by-side (up to 3 universities)
   - Share with parents for approval

3. **Submit Application:**
   - Select 1-3 universities from favorites
   - Pay application fee (₹500 - ₹2,000 per university)
   - Confirm document checklist for each university
   - Submit application

**Payment Process (Application Fee):**
- Select payment gateway (Razorpay/Stripe integration)
- Methods: UPI, Net Banking, Credit/Debit Cards, Direct Parent Payment
- Processing time: 2-5 minutes
- Immediate confirmation and receipt

**System Actions:**
- Generate unique application number (APP-2024-XXXXX)
- Create application record with status: `SUBMITTED`
- Send immediate confirmation to student + parent
- Forward application to university admin dashboard
- Email notification to university with student profile link
- Schedule automatic reminders for missing documents

**University Actions:**
- Receive notification in their admin dashboard
- Download student documents securely
- Review application and eligibility
- Update status to `UNDER_REVIEW`

**Parent Actions:**
- View shortlisted universities from dashboard
- Receive notification: "Your child has applied to 3 universities"
- Approve applications (optional approval workflow)
- Can pay application fees directly from parent portal
- Track application status in real-time

**Key Features:**
- Application deadline countdown timer
- Application fee payment history
- Application status badges (color-coded)
- Estimated response time (48-72 hours)

---

### Phase 3: Admission Letter & First Payment

**University Actions:**
1. Review application (48-72 hour SLA)
2. Verify documents and eligibility:
   - Check NEET score meets cutoff
   - Verify academic documents
   - Confirm passport validity
3. Update application status: `UNDER_REVIEW` → `ADMITTED` / `REJECTED`
4. Upload Admission Letter (PDF) to platform
5. Trigger notification workflow

**System Notifications:**
- **Email to Student/Parent:**
  ```
  Subject: 🎉 Congratulations! You've been admitted to [University Name]
  
  Your admission letter is now available.
  
  Next Steps:
  1. Download admission letter
  2. Pay 1st installment ($2,000 - $5,000)
  3. Deadline: 7 days
  
  Payment Link: [Secure Link]
  ```
- **Push Notification:** "Admission letter received from [University]"
- **Dashboard Badge:** Green "Admitted" status

**Student Actions:**
1. **Receive notification** (email + SMS + app push)
2. **Download Admission Letter** from Application tab
3. **View payment breakdown:**
   - 1st Year Tuition Fee: $2,000 - $5,000
   - Hostel Fee: $800 - $1,500
   - Registration Fee: $200
   - Total Payment Required: $3,000 - $6,700
4. **Make First Payment:**
   - Select payment method
   - Enter amount
   - Process via Razorpay/Stripe
   - Multi-currency support (USD, INR, EUR)

**Payment Flow:**
```
Payment Initiated → Processing → Success/Failed → Receipt Generated → University Notified → Next Stage Unlocked
```

**System Actions:**
- Generate invoice with unique payment ID
- Process payment through secure gateway
- Store payment record in `payments` table
- Update application status: `FIRST_PAYMENT_PENDING` → `FIRST_PAYMENT_DONE`
- Send payment receipt (PDF) via email
- Trigger invitation letter workflow
- Unlock entrance exam dashboard

**University Actions:**
- Receive payment confirmation in admin panel
- Verify payment receipt
- Send payment acknowledgment to student
- Confirm admission seat allocation

**Parent Actions:**
- Receive payment due notification
- View payment details and breakdown
- **Make direct payment from parent portal** (key feature)
- Receive payment receipt
- Payment added to family payment history

**Critical Feature - Parent Wallet:**
- Parents can add funds to wallet in advance
- Student requests payment → Parent approves → Auto-debit from wallet
- Spending limits and approval workflows
- Transaction history with filter options

---

### Phase 4: Entrance Exam Process

**University Actions:**
1. Schedule entrance exam (online/offline) after payment confirmation
2. Upload exam details to platform:
   - Exam date & time
   - Exam format (MCQ, practical, interview)
   - Syllabus and preparation materials (PDF)
   - Admit card for download
   - Exam center location (for offline exams)
3. Update application status: `EXAM_SCHEDULED`

**Student Dashboard (Exam Tab):**
- Exam countdown timer
- Admit card download button
- Syllabus PDF download
- Mock tests (if available)
- Exam preparation videos
- Previous year question papers

**Student Actions:**
1. **Receive exam notification** (7 days, 1 day, 1 hour before)
2. **Download admit card** from Application tab
3. **Prepare using provided materials:**
   - Download syllabus PDF
   - Access mock tests
   - Watch preparation videos
4. **Appear for exam:**
   - **Online Exam:**
     - Login via secure link
     - Proctoring integration (screen recording, webcam)
     - Submit answers online
     - Auto-grading for MCQs
     - Manual review for subjective questions
   - **Offline Exam:**
     - Visit designated exam center in India
     - Carry admit card and ID proof
     - Results scanned and uploaded by invigilator

**System Actions:**
- Send reminder notifications (7 days, 1 day, 1 hour before exam)
- Enable exam portal 30 minutes before scheduled time
- Record exam session for audit purposes
- For online exams: Real-time proctoring with AI fraud detection
- Store exam results in secure database
- Update application status: `EXAM_COMPLETED`

**Parent Actions:**
- Receive exam schedule notification
- View exam details and location
- Receive exam day reminder
- View exam results when published

---

### Phase 5: Invitation Letter & Final Payment

**University Actions:**
1. Evaluate exam results (within 7-10 days)
2. Upload results to platform
3. Update status: `EXAM_PASSED` or `EXAM_FAILED`
4. For passed students:
   - Generate **Invitation Letter** (Visa Support Letter)
   - Upload PDF to platform
   - Email to student + parent
   - Update application status: `INVITATION_RECEIVED`
5. Calculate final payment amount:
   - Remaining tuition fees
   - Hostel advance payment
   - Visa processing charges
   - Medical insurance (mandatory)
   - Total: $3,000 - $8,000

**Student Actions:**
1. **Receive exam result notification**
   - If **PASSED**: 
     - View invitation letter
     - Download PDF
     - View final payment details
     - Proceed to payment
   - If **FAILED**:
     - Option to reappear (if available)
     - Apply to other universities
     - Request counseling session

2. **Make Final Payment:**
   - View payment breakdown
   - Select payment method
   - Process payment
   - Receive instant confirmation
   - Download receipt

**System Actions:**
- Send exam result notification (email + SMS + push)
- Update application status
- Store invitation letter in document vault
- Trigger final payment workflow
- Generate payment invoice with due date
- Send payment reminder (24 hours before deadline)
- Implement tiered late payment system

**Payment Deadline:**
- Standard: 10-15 days from invitation
- Extended: Available with penalty fees
- Auto-expiration: Application cancelled after 30 days

**Parent Actions:**
- Receive exam result notification
- View invitation letter
- **Approve and make final payment** from parent portal
- Receive payment receipt
- View updated application timeline

---

### Phase 6: Visa Support & Documentation

**Platform Visa Support Services:**
1. **Visa Checklist Generator** (based on country):
   ```
   ✓ Valid passport (18+ months)
   ✓ Admission letter
   ✓ Invitation letter (visa support letter)
   ✓ Application form (pre-filled)
   ✓ Bank statements (6 months, min balance ₹5-10 lakhs)
   ✓ Sponsor letter (from parents)
   ✓ Income proof (IT returns, salary slips)
   ✓ Medical certificate
   ✓ Vaccination records
   ✓ Police clearance certificate
   ✓ Passport-size photos (white background)
   ✓ Flight booking confirmation
   ✓ Medical insurance (mandatory)
   ✓ Apostille for documents (if required)
   ```

2. **Document Preparation:**
   - Auto-fill visa application forms
   - Template for sponsor letter
   - Translation services (optional)
   - Apostille service guidance
   - Document verification support

3. **Visa Center Integration:**
   - Find nearest visa application center
   - Book appointment (Moscow, Kyiv, Tbilisi consulates)
   - Track appointment status
   - Preparation guide for interview

4. **Document Upload Requirements:**
   - Bank statements (PDF, last 6 months)
   - Sponsor letter (signed, PDF)
   - Income proof documents
   - Medical certificate
   - Police clearance certificate

**Student Actions:**
1. Access **Visa Assistance Dashboard** from Application tab
2. Download pre-filled visa application form
3. Upload additional documents:
   - Bank statements (student + sponsor/parent)
   - Sponsor letter (from parents, signed)
   - Income proof (IT returns, salary slips)
   - Medical certificate
   - Police clearance certificate
   - Flight booking confirmation
   - Medical insurance certificate
4. Book visa appointment via platform
5. Track visa application status in real-time
6. Receive visa approval notification

**Document Upload Flow:**
```
Upload → AI Scan → Verification (24-48 hrs) → Approved/Rejected → Can re-upload
```

**System Actions:**
- Generate country-specific visa checklist
- Auto-fill visa application with student data
- Send reminders for missing documents (3 days, 1 day before deadline)
- Send appointment reminders (7 days, 1 day before)
- Track visa application status in dashboard
- Send visa approval congratulations
- Update status: `VISA_APPROVED`

**Parent Actions:**
- **Upload sponsor documents** from parent portal:
  - Scan and upload bank statements
  - Sign sponsor letter
  - Upload income proof (IT returns)
- Provide financial declarations
- Receive visa status updates
- View visa approval notification
- Share excitement with child

**Visa Status Tracking:**
```
📊 Not Started → Documents Pending → Documents Submitted → Appointment Booked → Interview Done → Approved → Visa Received
```

---

### Phase 7: Travel Booking & Logistics

**Platform Services Integration:**
1. **Flight Booking** (API Integration with MakeMyTrip, Goibibo):
   - Search flights to destination
   - Compare prices and airlines
   - Book tickets with GST invoice
   - Bulk booking discounts (if available)
   - Cancellation protection

2. **Airport Pickup Service:**
   - University pickup or private service
   - Driver details (name, phone, vehicle)
   - Real-time tracking (24 hours before arrival)
   - Emergency contact support
   - Multiple language support

3. **Accommodation:**
   - Hostel room allocation confirmation
   - Temporary accommodation (if arriving early)
   - Hostel rules and guidelines PDF
   - Roommate selection (if available)

**Student Actions:**
1. **Book Flight Ticket:**
   - Select travel dates
   - Search from Delhi, Mumbai, Bangalore, etc.
   - Filter by airline, price, layover
   - Add passenger details
   - Make payment (₹30,000 - ₹50,000)
   - Receive e-ticket via email

2. **Book Airport Pickup:**
   - Confirm arrival time
   - Select pickup type (university/private)
   -Provide student review automatically.