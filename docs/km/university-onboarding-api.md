# University Onboarding API Documentation

## Base URLs

- Admin API: `/admin/universities`
- Public API: `/universities`

---

## Admin Endpoints

### 1. Get All Universities

**GET** `/admin/universities`

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `country` (optional): Filter by country
- `status` (optional): Filter by status (DRAFT, UNDER_REVIEW, ACTIVE, INACTIVE, SUSPENDED)
- `type` (optional): Filter by type (GOVERNMENT, PRIVATE, DEEMED, AUTONOMOUS)
- `search` (optional): Search by name or short name

Response:
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

### 2. Get Statistics

**GET** `/admin/universities/statistics`

Response:
```json
{
  "total": 100,
  "active": 80,
  "draft": 15,
  "underReview": 5,
  "byType": [...],
  "byCountry": [...],
  "recentlyAdded": 10
}
```

---

### 3. Get Countries

**GET** `/admin/universities/countries`

Response:
```json
["India", "Russia", "China", "Philippines"]
```

---

### 4. Get Single University

**GET** `/admin/universities/:id`

Response: Full university object with all relations

---

### 5. Create University

**POST** `/admin/universities`

Request Body:
```json
{
  "name": "ABC Medical College",
  "shortName": "ABC MC",
  "establishedYear": 2000,
  "type": "PRIVATE",
  "website": "https://abcmc.edu",
  "logo": "https://cdn.example.com/logo.png",
  "bannerImage": "https://cdn.example.com/banner.jpg",
  "location": {
    "country": "India",
    "state": "Maharashtra",
    "city": "Mumbai",
    "address": "123 Medical Street",
    "latitude": 19.0760,
    "longitude": 72.8777
  },
  "contact": {
    "email": "admissions@abcmc.edu",
    "phone": "+91-9876543210",
    "admissionOfficeHours": "Mon-Fri 9AM-5PM"
  },
  "academic": {
    "programs": ["MBBS", "MD"],
    "duration": "5.5 years",
    "medium": "English",
    "specializations": ["General Medicine", "Surgery"],
    "intakeMonths": ["August"],
    "totalSeats": 150,
    "governmentSeats": 100,
    "managementSeats": 40,
    "nriSeats": 10,
    "curriculumType": "Semester",
    "clinicalTraining": "Year 3 onwards"
  },
  "recognition": {
    "bodies": ["MCI", "WHO"],
    "ecfmgStatus": "APPROVED",
    "naacGrade": "A+",
    "nbaAccredited": true,
    "worldRank": 500,
    "nationalRank": 50,
    "accreditations": ["NAAC", "NBA"]
  },
  "fees": {
    "tuitionAnnual": 500000,
    "totalProgram": 3000000,
    "hostelAnnual": 80000,
    "registration": 25000,
    "examination": 10000,
    "library": 5000,
    "otherFees": {
      "sports": 3000,
      "medical": 2000
    },
    "currency": "INR",
    "scholarshipAvailable": true,
    "scholarshipDetails": "Merit-based scholarships available",
    "paymentSchedule": "Annual or semester-wise",
    "refundPolicy": "50% refund before course start",
    "feeHikePolicy": "5% annual increase"
  },
  "infrastructure": {
    "hospitalBeds": 500,
    "departments": 15,
    "librarySize": "50000 books",
    "hostelBoys": 300,
    "hostelGirls": 200,
    "laboratories": 20,
    "campusArea": 50,
    "facilities": ["Library", "Sports Complex", "Cafeteria"],
    "cafeteria": true,
    "wifiCampus": true,
    "transportation": true
  },
  "admission": {
    "entranceExams": ["NEET"],
    "minimumMarks": "50th percentile",
    "ageCriteria": "17-25 years",
    "eligibility": "10+2 with PCB",
    "requiredDocuments": ["10th Marksheet", "12th Marksheet", "NEET Scorecard"],
    "applicationDeadline": "2024-08-31T23:59:59Z",
    "applicationFee": 2000,
    "selectionProcess": "Merit-based on NEET score",
    "reservationPolicy": "As per government norms"
  },
  "support": {
    "placementRate": 95,
    "averagePackage": 800000,
    "topRecruiters": ["Apollo Hospitals", "Fortis Healthcare"],
    "alumniNetwork": true,
    "alumniCount": 5000,
    "internationalStudentSupport": true,
    "visaAssistance": true,
    "languageSupport": ["English", "Hindi"],
    "counselingServices": true,
    "careerGuidance": true
  },
  "content": {
    "shortDescription": "Premier medical college in Mumbai",
    "longDescription": "Detailed description...",
    "highlights": ["WHO Approved", "500 Hospital Beds", "95% Placement"],
    "whyChooseUs": "Excellence in medical education...",
    "gallery": ["https://cdn.example.com/img1.jpg"],
    "videoTour": "https://youtube.com/watch?v=xxx",
    "virtualTour": "https://virtualtour.example.com"
  },
  "admin": {
    "pocName": "Dr. John Doe",
    "pocDesignation": "Admission Officer",
    "pocEmail": "john@abcmc.edu",
    "pocPhone": "+91-9876543210",
    "accountName": "ABC Medical College",
    "accountNumber": "1234567890",
    "bankName": "State Bank of India",
    "bankBranch": "Mumbai Main",
    "ifscCode": "SBIN0001234",
    "gstNumber": "27AABCU9603R1ZM",
    "panNumber": "AABCU9603R",
    "commission": 10
  }
}
```

---

### 6. Update University

**PUT** `/admin/universities/:id`

Request Body: Same as create (all fields optional)

---

### 7. Update Status

**PATCH** `/admin/universities/:id/status`

Request Body:
```json
{
  "status": "ACTIVE"
}
```

---

### 8. Delete University

**DELETE** `/admin/universities/:id`

Soft deletes by setting status to INACTIVE

---

### 9. Upload Document

**POST** `/admin/universities/:id/documents`

Request Body:
```json
{
  "type": "BROCHURE",
  "fileUrl": "https://cdn.example.com/brochure.pdf",
  "fileName": "brochure.pdf",
  "fileSize": 2048576
}
```

Document Types:
- BROCHURE
- PROSPECTUS
- RECOGNITION_CERTIFICATE
- AFFILIATION_DOCUMENT
- DEGREE_SAMPLE
- FEE_STRUCTURE
- ADMISSION_FORM
- HOSTEL_RULES
- ANTI_RAGGING_POLICY
- AGREEMENT

---

### 10. Get Documents

**GET** `/admin/universities/:id/documents`

---

### 11. Delete Document

**DELETE** `/admin/universities/documents/:documentId`

---

### 12. Add Course

**POST** `/admin/universities/:id/courses`

Request Body:
```json
{
  "name": "MBBS",
  "duration": 5,
  "fees": 500000,
  "currency": "INR",
  "eligibility": "NEET qualified",
  "seats": 150
}
```

---

### 13. Update Course

**PUT** `/admin/universities/courses/:courseId`

---

### 14. Delete Course

**DELETE** `/admin/universities/courses/:courseId`

---

## Public Endpoints

### 1. Get All Active Universities

**GET** `/universities`

Query Parameters: Same as admin (automatically filters to ACTIVE status only)

---

### 2. Get Countries

**GET** `/universities/countries`

---

### 3. Get Single University

**GET** `/universities/:identifier`

Can use ID or slug. Only returns ACTIVE universities.

---

## Authentication

Admin endpoints require JWT token:
```
Authorization: Bearer <token>
```

Public endpoints are accessible without authentication.

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [...]
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "University not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "University with similar name already exists"
}
```

---

## Validation Rules

1. **Seat Distribution**: governmentSeats + managementSeats + nriSeats must equal totalSeats
2. **Slug**: Auto-generated from name, must be unique
3. **Email**: Must be valid email format
4. **Phone**: Must include country code
5. **URLs**: Must be valid HTTPS URLs
6. **Established Year**: Between 1800 and current year
7. **Placement Rate**: Between 0 and 100
8. **Commission**: Between 0 and 100

---

## Status Workflow

1. **DRAFT** → University created, incomplete data
2. **UNDER_REVIEW** → Submitted for admin review
3. **ACTIVE** → Approved and visible to students
4. **INACTIVE** → Soft deleted
5. **SUSPENDED** → Temporarily disabled

---

## Example Usage

### Create University (cURL)

```bash
curl -X POST https://api.example.com/admin/universities \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d @university.json
```

### Get Active Universities (JavaScript)

```javascript
const response = await fetch('https://api.example.com/universities?country=India&page=1&limit=20');
const data = await response.json();
console.log(data.data); // Array of universities
```

---

## Notes

- All timestamps are in ISO 8601 format
- All monetary values are in the specified currency
- Arrays can be empty but not null
- File uploads should be handled separately (S3/CDN) and URLs provided
- Slug is auto-generated and cannot be manually set
- Admin endpoints require ADMIN or SUPER_ADMIN role
