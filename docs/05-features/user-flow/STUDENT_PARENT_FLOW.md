# Student & Parent Journey - Complete Flow

## Overview

A comprehensive platform enabling Indian students to pursue MBBS abroad (Russia, Georgia, Turkey, etc.) with complete application-to-enrollment support, including parent oversight and payment capabilities.

---

## User Roles

### Student
Primary user who applies to universities, submits documents, tracks application status, and manages their admission journey.

### Parent
Guardian with read-only dashboard access to monitor student progress, make payments on behalf of student, and receive notifications.

---

## Application Architecture

### Student Portal
- **Home** - Dashboard with application status, upcoming deadlines, notifications
- **Courses** - Browse universities and programs with filters (country, fees, ECFMG status)
- **Application** - Active applications, document uploads, payment tracking
- **Profile** - Personal info, documents, academic records, preferences

### Parent Portal
- **Dashboard** - Student progress overview, payment history
- **Payments** - Make payments for fees, visa, travel services
- **Documents** - View submitted documents (read-only)
- **Notifications** - Updates on student progress

---

## Complete Student Journey

### Phase 1: Registration & Profile Setup
**Student Actions:**
1. Sign up with email/phone + Google OAuth
2. Complete profile (personal details, academic background)
3. Upload essential documents:
   - Aadhaar Card
   - PAN Card
   - Passport (valid for 18+ months)
   - 10th Marksheet
   - 12th Marksheet
   - NEET Scorecard
   - Birth Certificate
   - Passport-size photos

**System Actions:**
- AI-powered OCR extracts data from documents
- Auto-validation of NEET scores, dates, names
- Document verification status (Pending → Verified → Rejected)
- Profile completion percentage tracker

**Parent Actions:**
- Receive invitation email to create parent account
- Link to student profile (read-only access)

---

### Phase 2: University Discovery & Application

**Student Actions:**
1. Browse universities with filters:
   - Country (Russia, Georgia, Turkey, Kazakhstan, etc.)
   - Fees range
   - ECFMG/WHO/NMC recognition
   - Medium of instruction (English)
   - Intake period (September, January, March)
2. View detailed university pages:
   - Course details, duration, fees
   - Infrastructure, hostel facilities
   - Recognition & accreditation
   - Student reviews & ratings
3. Shortlist universities (save to favorites)
4. Submit application to selected university:
   - Select course (MBBS, MD, etc.)
   - Confirm document checklist
   - Pay application fee (₹500-2000 per university)
   - Submit application

**System Actions:**
- Application status: `Submitted` → `Under Review`
- Email notification to university admin
- University dashboard shows new application
- Student receives confirmation email + SMS
- Application tracking number generated

**Parent Actions:**
- View shortlisted universities
- Receive notification when application submitted
- Can pay application fee on behalf of student

---

### Phase 3: University Review & Admission Letter

**University Actions (via platform or email):**
1. Review application in admin dashboard
2. Verify documents and eligibility
3. Update application status:
   - `Under Review` → `Approved` / `Rejected` / `Waitlisted`
4. Upload Admission Letter (PDF) to platform
5. Send admission letter via:
   - Platform notification
   - Email to student
   - SMS alert

**Student Actions:**
1. Receive notification of admission decision
2. Download admission letter from dashboard
3. Accept or decline admission offer
4. If accepted, proceed to fee payment

**System Actions:**
- Store admission letter in student documents
- Update application status to `Admitted`
- Trigger payment workflow
- Send congratulations email

**Parent Actions:**
- Receive notification of admission
- View admission letter
- Approve fee payment

---

### Phase 4: Tuition Fee Payment (1st Installment)

**Student/Parent Actions:**
1. View fee breakdown:
   - 1st year tuition fee
   - Hostel fee
   - Registration fee
   - Processing charges
2. Select payment method:
   - UPI (PhonePe, GPay, Paytm)
   - Net Banking
   - Credit/Debit Card
   - International wire transfer
3. Make payment via Razorpay/Stripe
4. Receive payment confirmation

**System Actions:**
- Generate payment invoice
- Process payment via payment gateway
- Update payment status: `Pending` → `Processing` → `Success`
- Send payment receipt via email
- Forward payment confirmation to university
- Unlock next stage (entrance exam)

**University Actions:**
- Receive payment notification
- Verify payment in their dashboard
- Confirm receipt to student

**Parent Actions:**
- Can make payment directly from parent portal
- Receive payment receipt
- View payment history

---

### Phase 5: Entrance Exam Scheduling

**University Actions:**
1. Schedule entrance exam (online/offline)
2. Send exam details via platform:
   - Exam date & time
   - Exam format (MCQ, essay, interview)
   - Syllabus/preparation material
   - Exam center location (if offline)

**Student Actions:**
1. Receive exam notification
2. View exam details in dashboard
3. Download admit card
4. Prepare for exam using provided materials
5. Appear for entrance exam:
   - Online: Take exam via platform
   - Offline: Visit exam center with admit card

**System Actions:**
- Send exam reminders (7 days, 1 day, 1 hour before)
- For online exams: Proctoring integration
- Store exam results
- Update application status to `Exam Completed`

**Parent Actions:**
- Receive exam schedule notification
- View exam details

---

### Phase 6: Exam Results & Invitation Letter

**University Actions:**
1. Evaluate exam results
2. Update result status: `Pass` / `Fail`
3. For passed students:
   - Generate Invitation Letter (Visa Support Letter)
   - Upload to platform
   - Send via email + platform notification
4. Specify 2nd payment amount (remaining fees)

**Student Actions:**
1. Receive exam result notification
2. If passed:
   - Download invitation letter
   - View 2nd payment details
   - Proceed to payment
3. If failed:
   - Option to reappear or apply to other universities

**System Actions:**
- Update application status to `Exam Passed`
- Store invitation letter in documents
- Trigger 2nd payment workflow
- Send congratulations + next steps email

**Parent Actions:**
- Receive exam result notification
- View invitation letter
- Approve 2nd payment

---

### Phase 7: Final Fee Payment & Visa Support

**Student/Parent Actions:**
1. Pay remaining fees:
   - Remaining tuition fee
   - Hostel advance
   - Visa processing fee
   - Travel assistance fee (optional)
2. Make payment via gateway
3. Receive payment confirmation

**System Actions:**
- Process payment
- Send receipt to student + university
- Unlock visa assistance services
- Update status to `Payment Completed`

**University Actions:**
- Confirm final payment receipt
- Provide additional visa documents if needed

---

### Phase 8: Visa Assistance

**Platform Services:**
1. **Visa Guidance:**
   - Country-specific visa checklist
   - Required documents list
   - Visa center locations in India
   - Appointment booking assistance
2. **Document Preparation:**
   - Visa application form filling
   - Document verification
   - Translation services (if needed)
   - Apostille guidance
3. **Visa Tracking:**
   - Application status tracking
   - Embassy appointment reminders
   - Visa approval notifications

**Student Actions:**
1. Access visa assistance dashboard
2. Upload additional documents:
   - Bank statements (6 months)
   - Sponsor letter (from parents)
   - Medical certificate
   - Police clearance certificate
3. Book visa appointment via platform
4. Track visa application status
5. Receive visa approval notification

**System Actions:**
- Provide visa checklist based on country
- Send reminders for document submission
- Track visa application status
- Send visa approval congratulations

**Parent Actions:**
- Upload sponsor documents
- Provide bank statements
- Receive visa status updates

---

### Phase 9: Travel & Accommodation Booking

**Platform Services:**
1. **Flight Booking:**
   - Compare flight options
   - Book tickets via integrated travel API
   - Receive e-tickets
2. **Airport Pickup:**
   - Book pickup service from university
   - Driver details shared 24 hours before arrival
   - Real-time tracking
3. **Accommodation:**
   - Hostel room allocation
   - Temporary accommodation (if needed)
   - Hostel rules & guidelines

**Student Actions:**
1. Select travel date
2. Book flight tickets:
   - View available flights
   - Compare prices
   - Make booking
3. Book airport pickup service
4. Confirm hostel accommodation
5. Download travel itinerary

**System Actions:**
- Integrate with flight booking APIs (MakeMyTrip, Goibibo)
- Send booking confirmations
- Share pickup driver details
- Send pre-departure checklist

**Parent Actions:**
- View travel itinerary
- Make payment for flights/pickup
- Receive real-time travel updates
- Emergency contact numbers

---

### Phase 10: Pre-Departure & Onboarding

**Platform Services:**
1. **Pre-Departure Orientation:**
   - Virtual orientation session
   - Country-specific guidelines
   - Cultural adaptation tips
   - Emergency contacts
2. **Checklist:**
   - Documents to carry
   - Packing list
   - Currency exchange guidance
   - SIM card activation
3. **Student Community:**
   - Connect with other students
   - Alumni mentorship
   - WhatsApp groups

**Student Actions:**
1. Attend pre-departure orientation
2. Complete pre-departure checklist
3. Join student community groups
4. Download offline documents
5. Confirm arrival date to university

**System Actions:**
- Send pre-departure email series
- Share emergency contacts
- Provide offline document access
- Send arrival reminders

**Parent Actions:**
- Attend parent orientation (optional)
- Receive emergency contact list
- Get platform support contact

---

### Phase 11: Post-Arrival Support

**Platform Services:**
1. **Arrival Confirmation:**
   - Student confirms safe arrival
   - Upload arrival photos
2. **Ongoing Support:**
   - Hostel check-in assistance
   - University registration guidance
   - Local SIM card activation
   - Bank account opening
3. **Parent Updates:**
   - Regular check-in notifications
   - Academic progress updates
   - Fee payment reminders

**Student Actions:**
1. Confirm arrival on platform
2. Complete university registration
3. Update profile with local details
4. Access ongoing support resources

**Parent Actions:**
1. Receive arrival confirmation
2. View student check-in status
3. Make subsequent fee payments
4. Receive periodic progress reports

---

## Payment Summary

### Student Payments
| Stage | Payment Type | Typical Amount | Paid To |
|-------|-------------|----------------|---------|
| Application | Application Fee | ₹500 - ₹2,000 | Platform |
| Admission | 1st Installment | $2,000 - $5,000 | University |
| Invitation | Remaining Fees | $3,000 - $8,000 | University |
| Visa | Visa Processing | ₹15,000 - ₹25,000 | Platform/Visa Center |
| Travel | Flight Tickets | ₹25,000 - ₹50,000 | Airlines |
| Travel | Airport Pickup | ₹2,000 - ₹5,000 | Platform/University |

### Parent Payment Options
- Direct payment from parent portal
- Payment on behalf of student
- Installment plans available
- Multiple payment methods supported

---

## Document Management

### Required Documents
**Personal Documents:**
- Aadhaar Card
- PAN Card
- Passport (18+ months validity)
- Birth Certificate
- Passport-size photos (white background)

**Academic Documents:**
- 10th Marksheet & Certificate
- 12th Marksheet & Certificate
- NEET Scorecard & Admit Card
- School Leaving Certificate
- Migration Certificate

**Financial Documents:**
- Bank statements (6 months)
- Sponsor letter from parents
- Income proof of sponsor

**Medical Documents:**
- Medical fitness certificate
- Vaccination records
- Blood group certificate

**Visa Documents:**
- Admission letter
- Invitation letter
- Visa application form
- Police clearance certificate
- Apostille documents

### Document Status Workflow
```
Uploaded → AI Processing → Under Review → Verified/Rejected
```

### Document Features
- AI-powered OCR extraction
- Auto-validation of details
- Version control (reupload if rejected)
- Secure encrypted storage
- Download anytime
- Share with university

---

## Notification System

### Student Notifications
**Channels:** Email, SMS, Push, WhatsApp

**Triggers:**
- Application submitted
- Application status update
- Admission letter received
- Payment due reminders
- Exam scheduled
- Exam result published
- Visa appointment reminder
- Flight booking confirmation
- Pre-departure checklist
- Arrival confirmation

### Parent Notifications
**Channels:** Email, SMS, WhatsApp

**Triggers:**
- Student application submitted
- Admission received
- Payment due
- Payment successful
- Exam scheduled
- Exam result
- Visa status update
- Travel booking confirmed
- Student arrival confirmed
- Monthly progress report

---

## Enhanced Features & Ideas

### 1. AI-Powered University Matching
**Feature:** Smart recommendation engine
- Analyze student profile (NEET score, budget, preferences)
- Match with best-fit universities
- Show match percentage (85% match)
- Explain why recommended

### 2. Virtual Campus Tours
**Feature:** 360° virtual tours
- Explore campus, hostels, classrooms
- View facilities in VR/AR
- Student testimonial videos
- Live Q&A with current students

### 3. Loan & Scholarship Assistance
**Feature:** Financial aid integration
- Partner with education loan providers
- Pre-approved loan offers
- Scholarship finder
- EMI calculator
- Compare loan options

### 4. Peer Community
**Feature:** Student networking
- Connect with seniors at same university
- Country-specific groups
- Mentorship program
- Discussion forums
- Success stories

### 5. Progress Tracking Dashboard
**Feature:** Visual journey map
- Timeline view of entire process
- Completion percentage
- Next action items
- Milestone celebrations
- Estimated completion date

### 6. Parent Control Panel
**Feature:** Enhanced parent features
- Set spending limits
- Approve payments above threshold
- Real-time location tracking (with student consent)
- Academic performance tracking
- Emergency SOS button
- Direct communication with university

### 7. Document Vault
**Feature:** Secure document storage
- Lifetime access to all documents
- Blockchain verification
- Share via secure links
- Download as ZIP
- Print-ready formats

### 8. Travel Companion App
**Feature:** Mobile app for travel
- Offline document access
- Flight status tracking
- Airport navigation
- Translation tool
- Emergency contacts
- Currency converter
- Local transport guide

### 9. Post-Enrollment Services
**Feature:** Ongoing support
- Semester fee payment reminders
- Academic progress tracking
- Internship opportunities
- Return flight booking
- Visa renewal assistance
- Career guidance

### 10. Referral Program
**Feature:** Earn rewards
- Refer friends and earn ₹5,000-10,000
- Track referral status
- Instant payouts
- Leaderboard
- Bonus for successful enrollments

### 11. Insurance Integration
**Feature:** Student insurance
- Health insurance (mandatory for visa)
- Travel insurance
- Baggage insurance
- Compare plans
- One-click purchase

### 12. Language Learning
**Feature:** Basic language courses
- Russian, Georgian, Turkish basics
- Medical terminology
- Survival phrases
- Audio pronunciation
- Flashcards

### 13. Emergency Support
**Feature:** 24/7 helpline
- Multi-language support
- Video call with support team
- Emergency contact to parents
- University liaison
- Embassy contacts

### 14. Gamification
**Feature:** Engagement rewards
- Points for completing tasks
- Badges for milestones
- Leaderboard
- Unlock premium features
- Redeem for discounts

### 15. Analytics Dashboard
**Feature:** Personal insights
- Application success rate
- Time spent on platform
- Document completion rate
- Comparison with peers
- Personalized tips

---

## Technical Implementation

### Database Schema Updates Needed

**New Tables:**
```prisma
model Application {
  id                String              @id @default(uuid())
  studentId         String
  universityId      String
  courseId          String
  status            ApplicationStatus
  applicationFee    Float
  admissionLetter   String?
  invitationLetter  String?
  examDate          DateTime?
  examResult        String?
  stage             ApplicationStage
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  
  student           Student             @relation(...)
  university        University          @relation(...)
  course            UniversityCourse    @relation(...)
  payments          ApplicationPayment[]
  timeline          ApplicationTimeline[]
}

model ApplicationPayment {
  id              String        @id @default(uuid())
  applicationId   String
  type            PaymentType   // APPLICATION_FEE, FIRST_INSTALLMENT, FINAL_PAYMENT, VISA_FEE, TRAVEL_FEE
  amount          Float
  currency        String
  status          PaymentStatus
  paidBy          String        // studentId or parentId
  razorpayOrderId String?
  createdAt       DateTime      @default(now())
  
  application     Application   @relation(...)
}

model Parent {
  id              String    @id @default(uuid())
  userId          String    @unique
  studentIds      String[]  // Can have multiple children
  relation        String    // Father, Mother, Guardian
  occupation      String?
  annualIncome    Float?
  
  user            User      @relation(...)
  payments        ApplicationPayment[]
}

model TravelBooking {
  id              String    @id @default(uuid())
  studentId       String
  applicationId   String
  flightDetails   Json
  pickupBooked    Boolean   @default(false)
  pickupDetails   Json?
  departureDate   DateTime
  arrivalDate     DateTime
  status          String
  
  student         Student   @relation(...)
}

model VisaApplication {
  id                String    @id @default(uuid())
  studentId         String
  applicationId     String
  country           String
  visaType          String
  applicationNumber String?
  appointmentDate   DateTime?
  status            VisaStatus
  documents         Json
  
  student           Student   @relation(...)
}

enum ApplicationStage {
  PROFILE_SETUP
  UNIVERSITY_SELECTION
  APPLICATION_SUBMITTED
  UNDER_REVIEW
  ADMITTED
  FIRST_PAYMENT_PENDING
  FIRST_PAYMENT_DONE
  EXAM_SCHEDULED
  EXAM_COMPLETED
  INVITATION_RECEIVED
  FINAL_PAYMENT_PENDING
  FINAL_PAYMENT_DONE
  VISA_PROCESSING
  VISA_APPROVED
  TRAVEL_BOOKED
  DEPARTED
  ARRIVED
  ENROLLED
}

enum VisaStatus {
  NOT_STARTED
  DOCUMENTS_PENDING
  DOCUMENTS_SUBMITTED
  APPOINTMENT_SCHEDULED
  INTERVIEW_DONE
  APPROVED
  REJECTED
  VISA_RECEIVED
}
```

### API Endpoints Needed

**Student Endpoints:**
```
POST   /api/student/applications                    - Submit application
GET    /api/student/applications                    - List applications
GET    /api/student/applications/:id                - Get application details
PATCH  /api/student/applications/:id/accept         - Accept admission
POST   /api/student/applications/:id/payments       - Make payment
GET    /api/student/applications/:id/timeline       - Get application timeline
POST   /api/student/documents/upload                - Upload document
GET    /api/student/documents                       - List documents
POST   /api/student/visa/apply                      - Start visa process
GET    /api/student/visa/:id                        - Get visa status
POST   /api/student/travel/book-flight              - Book flight
POST   /api/student/travel/book-pickup              - Book pickup
GET    /api/student/dashboard                       - Dashboard data
```

**Parent Endpoints:**
```
GET    /api/parent/students                         - List linked students
GET    /api/parent/students/:id/applications        - View student applications
POST   /api/parent/payments                         - Make payment
GET    /api/parent/payments/history                 - Payment history
GET    /api/parent/students/:id/documents           - View documents (read-only)
GET    /api/parent/students/:id/progress            - Progress report
```

**University Endpoints:**
```
GET    /api/university/applications                 - List applications
PATCH  /api/university/applications/:id/status      - Update status
POST   /api/university/applications/:id/admission   - Upload admission letter
POST   /api/university/applications/:id/invitation  - Upload invitation letter
POST   /api/university/applications/:id/exam        - Schedule exam
PATCH  /api/university/applications/:id/exam-result - Update exam result
```

### Frontend Pages Structure

```
/student
  /dashboard                    - Overview, quick actions
  /courses                      - Browse universities
  /courses/:slug                - University detail page
  /applications                 - My applications list
  /applications/:id             - Application detail & timeline
  /applications/new             - Apply to university
  /documents                    - Document vault
  /documents/upload             - Upload documents
  /visa                         - Visa assistance
  /travel                       - Travel booking
  /profile                      - Profile & settings
  /payments                     - Payment history

/parent
  /dashboard                    - Children overview
  /students/:id                 - Student detail
  /students/:id/applications    - Student applications
  /students/:id/documents       - Student documents
  /payments                     - Make payment
  /payments/history             - Payment history
  /settings                     - Parent settings

/university/:slug               - Public university page
```

---

## Success Metrics

### Student Success
- Profile completion rate: >90%
- Application submission rate: >70%
- Admission success rate: >60%
- Visa approval rate: >95%
- Student satisfaction: >4.5/5

### Parent Satisfaction
- Parent portal adoption: >80%
- Payment completion rate: >95%
- Support ticket resolution: <24 hours
- Parent satisfaction: >4.5/5

### Platform Metrics
- Average time to admission: <45 days
- Document verification time: <48 hours
- Payment success rate: >98%
- Support response time: <2 hours
- Platform uptime: >99.9%

---

## Support & Help

### Student Support
- **Live Chat:** 24/7 support
- **WhatsApp:** +91-XXXXX-XXXXX
- **Email:** support@shiksha.com
- **Phone:** 1800-XXX-XXXX (toll-free)
- **Help Center:** Comprehensive FAQs

### Parent Support
- **Dedicated Parent Helpline:** 1800-XXX-YYYY
- **Email:** parents@shiksha.com
- **Video Call Support:** Schedule calls
- **Regional Language Support:** Hindi, Tamil, Telugu, Bengali

### Emergency Support
- **24/7 Emergency Hotline:** +91-XXXXX-XXXXX
- **Embassy Contacts:** Pre-loaded in app
- **University Emergency Contact:** Direct line
- **Medical Emergency:** Tie-up with insurance providers

---

## Compliance & Security

### Data Protection
- GDPR compliant
- ISO 27001 certified
- End-to-end encryption
- Regular security audits
- Data backup every 6 hours

### Payment Security
- PCI DSS compliant
- Secure payment gateway
- 3D secure authentication
- Fraud detection system
- Refund protection

### Document Security
- Encrypted storage
- Access logs maintained
- Watermarked downloads
- Blockchain verification (optional)
- GDPR right to deletion

---

## Roadmap

### Phase 1 (Current) - Q2 2024
- ✅ Admin panel
- ✅ University management
- 🚧 Student registration
- 🚧 Document upload
- 🚧 Application submission

### Phase 2 - Q3 2024
- Parent portal
- Payment integration
- Visa assistance
- Travel booking
- Notification system

### Phase 3 - Q4 2024
- AI recommendations
- Virtual campus tours
- Loan integration
- Mobile app (iOS/Android)
- Offline mode

### Phase 4 - Q1 2025
- Peer community
- Language learning
- Insurance integration
- Gamification
- Analytics dashboard

---

## Conclusion

This platform provides end-to-end support for Indian students pursuing MBBS abroad, with comprehensive parent oversight and a seamless application-to-enrollment journey. The focus is on transparency, automation, and exceptional support at every stage.

**Key Differentiators:**
1. Complete journey management (not just application)
2. Parent involvement and control
3. AI-powered matching and document processing
4. Integrated payments, visa, and travel
5. Post-enrollment support
6. 24/7 multilingual support

**Target:** Help 10,000+ students enroll in international medical universities annually with >95% satisfaction rate.

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Implementation
