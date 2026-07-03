# University Onboarding Guide

## Overview

This document outlines the comprehensive data requirements and process for onboarding universities to the Medical Admission Platform. The information collected ensures students have all necessary details to make informed decisions about their medical education.

---

## Data Collection Requirements

### 1. Basic Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| University Name (Full) | String | Yes | Official registered name |
| University Name (Short) | String | Yes | Commonly used abbreviation |
| Established Year | Number | Yes | Year of establishment |
| University Type | Enum | Yes | Government/Private/Deemed/Autonomous |
| Official Website | URL | Yes | Primary website URL |
| Logo | Image | Yes | High-resolution logo (PNG, min 512x512px) |
| Banner Image | Image | Yes | Campus/building image (min 1920x1080px) |
| Country | String | Yes | Country name |
| City | String | Yes | City name |
| State/Province | String | Yes | State or province |
| Contact Email | Email | Yes | Official admission email |
| Contact Phone | String | Yes | Admission office phone with country code |
| Physical Address | Text | Yes | Complete postal address |
| Slug | String | Auto | URL-friendly identifier (auto-generated) |

**Validation Rules:**
- Email must be from official university domain
- Phone must include country code
- Logo must be transparent background
- Images must be optimized for web

---

### 2. Academic Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Degree Programs | Array | Yes | MBBS, MD, MS, BDS, etc. |
| Course Duration | String | Yes | e.g., "6 years" |
| Medium of Instruction | String | Yes | English/Local Language/Bilingual |
| Specializations | Array | Yes | Available specialization fields |
| Academic Calendar | String | Yes | Intake months (e.g., "August, January") |
| Total Seats | Number | Yes | Total intake capacity per year |
| Seat Distribution | Object | Yes | Government/Management/NRI quota breakdown |
| Curriculum Type | String | No | Credit-based/Semester/Annual |
| Clinical Training Start | String | No | Year when clinical training begins |

**Example Seat Distribution:**
```json
{
  "government": 150,
  "management": 50,
  "nri": 25,
  "total": 225
}
```

---

### 3. Accreditation & Recognition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Recognition Bodies | Array | Yes | MCI/NMC/WHO/UNESCO/GMC |
| ECFMG Status | Enum | Yes | Approved/Not Approved/Pending |
| NAAC Grade | String | No | A++/A+/A/B++/B+/B |
| NBA Accreditation | Boolean | No | Yes/No |
| World Ranking | Number | No | QS/THE World University Ranking |
| National Ranking | Number | No | NIRF or country-specific ranking |
| Other Accreditations | Array | No | Additional certifications |
| Recognition Documents | Files | Yes | PDF copies of certificates |

**Required Documents:**
- MCI/NMC Recognition Certificate
- WHO Recognition Letter
- NAAC/NBA Certificate (if applicable)
- University Grant Commission approval

---

### 4. Financial Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Tuition Fee (Annual) | Number | Yes | Per year in local currency |
| Total Program Fee | Number | Yes | Complete program cost |
| Hostel Fee (Annual) | Number | No | Per year accommodation cost |
| Registration Fee | Number | Yes | One-time registration |
| Examination Fee | Number | No | Per semester/year |
| Library Fee | Number | No | Annual library charges |
| Other Fees | Object | No | Miscellaneous charges breakdown |
| Currency | String | Yes | ISO currency code (USD, INR, EUR) |
| Scholarship Available | Boolean | Yes | Yes/No |
| Scholarship Details | Text | No | Types and eligibility |
| Payment Schedule | Text | Yes | Installment options |
| Refund Policy | Text | Yes | Cancellation and refund terms |
| Fee Hike Policy | Text | No | Annual increment policy |

**Example Fee Structure:**
```json
{
  "tuitionFeeAnnual": 500000,
  "totalProgramFee": 3000000,
  "hostelFeeAnnual": 80000,
  "registrationFee": 25000,
  "currency": "INR",
  "otherFees": {
    "library": 5000,
    "sports": 3000,
    "medical": 2000
  }
}
```

---

### 5. Infrastructure & Facilities

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Hospital Beds | Number | Yes | Attached hospital bed count |
| Number of Departments | Number | Yes | Academic departments |
| Library Size | String | No | Books count or area |
| Hostel Capacity | Object | Yes | Boys/Girls separate capacity |
| Laboratory Count | Number | Yes | Number of labs |
| Campus Area | Number | No | In acres or hectares |
| Sports Facilities | Array | No | Available sports |
| Cafeteria | Boolean | No | Yes/No |
| Wi-Fi Campus | Boolean | No | Yes/No |
| Transportation | Boolean | No | Bus facility available |
| Medical Facilities | Text | No | On-campus medical support |

**Example Hostel Capacity:**
```json
{
  "boys": 500,
  "girls": 400,
  "total": 900,
  "type": "On-campus"
}
```

---

### 6. Admission Requirements

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Entrance Exam | Array | Yes | NEET/MCAT/UCAT/University-specific |
| Minimum Qualifying Marks | String | Yes | Percentile or marks required |
| Age Criteria | String | Yes | Min/Max age limits |
| Eligibility Requirements | Text | Yes | 10+2 with PCB, etc. |
| Required Documents | Array | Yes | List of mandatory documents |
| Application Deadline | Date | Yes | Last date to apply |
| Application Fee | Number | Yes | Non-refundable application fee |
| Selection Process | Text | Yes | Steps in admission process |
| Reservation Policy | Text | No | SC/ST/OBC quotas if applicable |

**Required Documents List:**
- 10th Mark Sheet
- 12th Mark Sheet
- Entrance Exam Scorecard
- Transfer Certificate
- Migration Certificate
- Passport Size Photos
- ID Proof (Passport/Aadhar)
- Domicile Certificate (if applicable)

---

### 7. Student Support Services

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Placement Rate | Number | No | Percentage of students placed |
| Average Package | Number | No | In local currency |
| Top Recruiters | Array | No | Hospital/company names |
| Alumni Network | Boolean | No | Active alumni association |
| Alumni Count | Number | No | Total registered alumni |
| International Student Support | Boolean | Yes | Dedicated support for foreign students |
| Visa Assistance | Boolean | No | Help with visa process |
| Language Support | Array | No | Language training programs |
| Counseling Services | Boolean | No | Mental health support |
| Career Guidance | Boolean | No | Career counseling available |

---

### 8. Marketing & Content

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Short Description | Text | Yes | 150-200 characters summary |
| Long Description | Text | Yes | Detailed university overview (500-1000 words) |
| Key Highlights | Array | Yes | 5-7 unique selling points |
| Why Choose Us | Text | No | Compelling reasons |
| Success Stories | Array | No | Notable alumni achievements |
| Faculty Profiles | Array | No | Key faculty members |
| Student Testimonials | Array | No | Current/past student reviews |
| Photo Gallery | Images | Yes | Minimum 10 high-quality images |
| Video Tour | URL | No | YouTube/Vimeo campus tour |
| Virtual Tour | URL | No | 360° virtual tour link |

**Photo Gallery Categories:**
- Campus exterior
- Lecture halls
- Laboratories
- Library
- Hostel rooms
- Sports facilities
- Hospital/Clinical area
- Student activities

---

### 9. Documents to Upload

| Document | Format | Required | Max Size |
|----------|--------|----------|----------|
| University Brochure | PDF | Yes | 10 MB |
| Prospectus | PDF | Yes | 10 MB |
| Recognition Certificates | PDF | Yes | 5 MB each |
| Affiliation Documents | PDF | Yes | 5 MB |
| Sample Degree Certificate | PDF | No | 2 MB |
| Fee Structure Document | PDF | Yes | 2 MB |
| Admission Form Sample | PDF | No | 2 MB |
| Hostel Rules | PDF | No | 2 MB |
| Anti-Ragging Policy | PDF | Yes | 2 MB |

---

### 10. Administrative Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Point of Contact Name | String | Yes | Admission officer name |
| POC Designation | String | Yes | Job title |
| POC Email | Email | Yes | Direct contact email |
| POC Phone | String | Yes | Direct phone number |
| Admission Office Hours | String | Yes | Working hours |
| Bank Account Name | String | Yes | For fee collection |
| Bank Account Number | String | Yes | Account number |
| Bank Name | String | Yes | Bank name |
| Bank Branch | String | Yes | Branch name |
| IFSC/SWIFT Code | String | Yes | Bank routing code |
| GST Number | String | No | Tax identification |
| PAN Number | String | No | Permanent Account Number |
| Agreement Terms | File | Yes | MOU/Agreement document |
| Commission Structure | Number | Yes | Platform commission percentage |

---

## Implementation Phases

### Phase 1: Must-Have (MVP)
**Timeline:** Week 1-2

- Basic Information (all fields)
- Academic Details (all fields)
- Accreditation & Recognition (core fields)
- Financial Information (fee structure)
- Admission Requirements (eligibility)
- Marketing Content (descriptions, images)

**Goal:** Enable university listing and basic student discovery

---

### Phase 2: Important
**Timeline:** Week 3-4

- Infrastructure & Facilities (complete)
- Student Support Services (placement, alumni)
- All required documents upload
- Administrative details (payment setup)

**Goal:** Complete university profile for informed decision-making

---

### Phase 3: Nice-to-Have
**Timeline:** Week 5-6

- Faculty profiles
- Student testimonials
- Video tours
- Virtual campus tours
- Advanced analytics integration

**Goal:** Enhanced user experience and engagement

---

## Data Validation Rules

### Mandatory Validations

1. **Email Validation**
   - Must be valid email format
   - Preferably from university domain
   - Verified via OTP/confirmation link

2. **Phone Validation**
   - Must include country code
   - Format: +[country code][number]
   - Verified via OTP

3. **URL Validation**
   - Must be valid HTTPS URL
   - Must be accessible (200 status check)

4. **Image Validation**
   - Formats: JPG, PNG, WebP
   - Logo: Min 512x512px, transparent background preferred
   - Banner: Min 1920x1080px
   - Max file size: 5 MB per image

5. **Document Validation**
   - Format: PDF only
   - Max size as specified in table
   - Must be readable (not corrupted)

6. **Financial Data**
   - Must be positive numbers
   - Currency must be valid ISO code
   - Total fee should match sum of components

---

## API Schema

### University Model

```typescript
interface University {
  // Basic Info
  id: string;
  slug: string;
  name: string;
  shortName: string;
  establishedYear: number;
  type: 'Government' | 'Private' | 'Deemed' | 'Autonomous';
  website: string;
  logo: string;
  bannerImage: string;
  brochureUrl?: string; // PDF only
  
  // Location
  location: {
    country: string;
    state: string;
    city: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Contact
  contact: {
    email: string;
    phone: string;
    admissionOfficeHours: string;
  };
  
  // Academic
  academic: {
    programs: string[];
    duration: string;
    medium: string;
    specializations: string[];
    intakeMonths: string[];
    totalSeats: number;
    seatDistribution: {
      government: number;
      management: number;
      nri: number;
    };
  };
  
  // Recognition
  recognition: {
    bodies: string[];
    ecfmgStatus: 'Approved' | 'Not Approved' | 'Pending';
    naacGrade?: string;
    nbaAccredited: boolean;
    worldRank?: number;
    nationalRank?: number;
    certificates: string[];
  };
  
  // Fees
  fees: {
    tuitionAnnual: number;
    totalProgram: number;
    hostelAnnual?: number;
    registration: number;
    currency: string;
    scholarshipAvailable: boolean;
    scholarshipDetails?: string;
    paymentSchedule: string;
    refundPolicy: string;
  };
  
  // Infrastructure
  infrastructure: {
    hospitalBeds: number;
    departments: number;
    hostelCapacity: {
      boys: number;
      girls: number;
    };
    laboratories: number;
    campusArea?: number;
    facilities: string[];
  };
  
  // Admission
  admission: {
    entranceExams: string[];
    minimumMarks: string;
    ageCriteria: string;
    eligibility: string;
    requiredDocuments: string[];
    applicationDeadline: Date;
    applicationFee: number;
    selectionProcess: string;
  };
  
  // Support
  support: {
    placementRate?: number;
    internationalStudentSupport: boolean;
    visaAssistance: boolean;
    languageSupport: string[];
  };
  
  // Content
  content: {
    shortDescription: string;
    longDescription: string;
    highlights: string[];
    gallery: string[];
    brochureUrl: string;
    prospectusUrl: string;
  };
  
  // Admin
  admin: {
    poc: {
      name: string;
      designation: string;
      email: string;
      phone: string;
    };
    bankDetails: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      branch: string;
      ifscCode: string;
    };
    commission: number;
    agreementUrl: string;
  };
  
  // Metadata
  status: 'Draft' | 'Under Review' | 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
}
```

---

## Onboarding Workflow

### Step 1: Registration
1. University fills basic registration form
2. Email verification
3. Account creation

### Step 2: Profile Setup
1. Complete all mandatory fields
2. Upload required documents
3. Add images and brochures

### Step 3: Verification
1. Platform admin reviews submission
2. Document verification
3. Contact verification call

### Step 4: Agreement
1. Review terms and conditions
2. Sign digital agreement
3. Setup payment details

### Step 5: Go Live
1. Profile published
2. University notified
3. Training session scheduled

---

## Quality Checklist

Before approving a university profile, verify:

- [ ] All mandatory fields completed
- [ ] Recognition certificates uploaded and valid
- [ ] Contact details verified (email + phone)
- [ ] Fee structure clearly mentioned
- [ ] High-quality images uploaded
- [ ] Brochure and prospectus available
- [ ] Bank details verified
- [ ] Agreement signed
- [ ] No misleading information
- [ ] Grammar and spelling checked
- [ ] Website URL accessible
- [ ] Admission requirements clear

---

## Support & Training

### For Universities
- Onboarding video tutorial
- Step-by-step documentation
- Dedicated support email
- Weekly Q&A sessions
- Dashboard training

### For Platform Admins
- Verification guidelines
- Document checklist
- Fraud detection tips
- Communication templates
- Escalation process

---

## Compliance & Legal

### Data Privacy
- GDPR compliance for EU students
- Data encryption at rest and transit
- Regular security audits
- Privacy policy acceptance

### Legal Requirements
- Valid university registration
- Accreditation proof
- No false advertising
- Transparent fee disclosure
- Anti-ragging compliance

---

## Future Enhancements

1. **AI-Powered Matching**
   - Student-university compatibility score
   - Personalized recommendations

2. **Virtual Counseling**
   - Live chat with admission officers
   - Video call integration

3. **Application Tracking**
   - Real-time application status
   - Document verification status

4. **Analytics Dashboard**
   - Student interest metrics
   - Conversion tracking
   - ROI analysis

5. **Multi-language Support**
   - Content in regional languages
   - Translation management

---

## Contact

For questions about university onboarding:
- Email: onboarding@platform.com
- Phone: +91-XXXX-XXXX
- Support Portal: https://support.platform.com

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Owner:** Product Team
