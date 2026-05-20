# Universities & Applications API Documentation

## Student Flow

```
┌─────────────────────┐
│  GET /universities  │  Browse universities (public, no auth)
└─────────┬───────────┘
          │ select one
          ▼
┌─────────────────────────────┐
│ GET /universities/:id       │  View university details (public, no auth)
│                             │  → Shows "Apply Now" button on detail page
└─────────────┬───────────────┘
              │ click "Apply Now"
              │ (requires STUDENT auth)
              ▼
┌───────────────────────────────────────┐
│ GET /student/applications/check/:id   │  Check if already applied
└─────────────┬─────────────────────────┘
              │
       ┌──────┴──────┐
       │ applied=true │ applied=false
       ▼              ▼
┌──────────────┐  ┌──────────────────────────┐
│ Show current │  │ POST /student/apply     │  Submit admission form
│ application  │  │ (all form fields)       │  (requires STUDENT auth)
│ status      │  └─────────┬────────────────┘
└──────────────┘            │ success
                            ▼
                  ┌─────────────────────────┐
                  │ GET /student/applications│  View all my applications
                  └─────────────────────────┘
```

---

## Part 1: Universities (Public)

All university endpoints are **public** — no authentication required.

---

### GET /universities

Get all **active** universities with pagination and filters.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | string | No | Page number (default: 1) |
| `limit` | string | No | Items per page (default: 10) |
| `country` | string | No | Filter by country |
| `type` | string | No | Filter by university type |
| `search` | string | No | Search by name or short name |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Osh State University",
      "shortName": "OSU",
      "slug": "osu",
      "establishedYear": 1992,
      "type": "PUBLIC",
      "status": "ACTIVE",
      "logo": "https://storage.example.com/universities/osu-logo.png",
      "bannerImage": "https://storage.example.com/universities/osu-banner.jpg",
      "location": {
        "country": "Kyrgyzstan",
        "city": "Osh",
        "state": "Batken Region",
        "address": "321 Lenin Street, Osh, Kyrgyzstan"
      },
      "contact": {
        "email": "info@oshsu.kg",
        "phone": "+996 3222 12345"
      },
      "academic": {
        "medium": "English"
      },
      "content": {
        "gallery": []
      }
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### GET /universities/countries

Get list of countries that have active universities.

**Response:**
```json
{
  "countries": ["Kyrgyzstan", "Kazakhstan", "Uzbekistan"]
}
```

---

### GET /universities/:identifier

Get detailed information about a specific university by **ID** or **slug**.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `identifier` | string | Yes | University ID or slug |

**Response:**
```json
{
  "id": "uuid",
  "name": "Osh State University",
  "shortName": "OSU",
  "slug": "osu",
  "establishedYear": 1992,
  "type": "PUBLIC",
  "status": "ACTIVE",
  "logo": "https://storage.example.com/universities/osu-logo.png",
  "bannerImage": "https://storage.example.com/universities/osu-banner.jpg",
  "location": {
    "country": "Kyrgyzstan",
    "state": "Batken Region",
    "city": "Osh",
    "address": "321 Lenin Street, Osh, Kyrgyzstan",
    "latitude": 40.5285,
    "longitude": 72.7985
  },
  "contact": {
    "email": "info@oshsu.kg",
    "phone": "+996 3222 12345",
    "admissionOfficeHours": "9:00 AM - 5:00 PM"
  },
  "academic": {
    "programs": ["MBBS"],
    "duration": "6 Years",
    "medium": "English",
    "specializations": ["General Medicine"],
    "intakeMonths": ["September", "March"],
    "totalSeats": 180,
    "governmentSeats": 100,
    "managementSeats": 50,
    "nriSeats": 30
  },
  "infrastructure": {
    "hospitalBeds": 1000,
    "departments": 25,
    "hostelBoys": 500,
    "hostelGirls": 400,
    "laboratories": 25,
    "campusArea": 50000,
    "facilities": ["Library", "Sports Complex", "Cafeteria"],
    "cafeteria": true,
    "wifiCampus": true,
    "transportation": true
  },
  "admission": {
    "entranceExams": ["NEET"],
    "minimumMarks": "50% in PCB",
    "ageCriteria": "17+ years",
    "eligibility": "12th with PCB",
    "requiredDocuments": ["Passport", "10th Certificate", "12th Certificate", "NEET Score Card"],
    "applicationDeadline": "2026-10-31T23:59:59Z",
    "applicationFee": 100,
    "selectionProcess": "Merit-based + NEET score"
  },
  "support": {
    "placementRate": 85,
    "averagePackage": 50000,
    "visaAssistance": true,
    "languageSupport": ["English", "Russian"],
    "counselingServices": true,
    "careerGuidance": true
  },
  "content": {
    "gallery": [
      "https://storage.example.com/universities/osu/campus-1.jpg",
      "https://storage.example.com/universities/osu/campus-2.jpg",
      "https://storage.example.com/universities/osu/library.jpg"
    ]
  },
  "courses": [
    {
      "id": "uuid",
      "name": "MBBS",
      "duration": 6,
      "fees": 4000,
      "seats": 50,
      "isActive": true
    }
  ]
}
```

**Error Responses:**
- `404 Not Found` - University not found or not active

---

## Part 2: Applications (Student Auth Required)

All application endpoints require:
- JWT Bearer token in `Authorization` header
- User must have `STUDENT` role

---

### GET /student/applications/check/:universityId

Check if the logged-in student has already applied to a specific university. Call this when the student opens the university detail page — to show "Already Applied" or "Apply Now" button.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `universityId` | string | Yes | University ID |

**Response (already applied):**
```json
{
  "applied": true,
  "application": {
    "id": "uuid",
    "selectedProgram": "general-medicine",
    "status": "pending",
    "submittedAt": "2026-05-20T10:00:00.000Z"
  }
}
```

**Response (not applied):**
```json
{
  "applied": false
}
```

---

### POST /student/apply

Submit an admission application to a university. Called when student fills and submits the application form.

**Request Body:**
```json
{
  "universityId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "middleName": "Michael",
  "dateOfBirth": "2000-01-15",
  "placeOfBirth": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India"
  },
  "citizenship": "Indian",
  "maritalStatus": "single",
  "gender": "male",
  "permanentAddress": "123 Main Street",
  "permanentCity": "Mumbai",
  "permanentState": "Maharashtra",
  "permanentZip": "400001",
  "permanentCountry": "India",
  "email": "john@example.com",
  "embassyLocation": "Mumbai",
  "language1": {
    "name": "English",
    "speaking": "high",
    "reading": "high",
    "writing": "high"
  },
  "language2": {
    "name": "Hindi",
    "speaking": "moderate",
    "reading": "moderate",
    "writing": "low"
  },
  "otherLanguages": "Marathi (basic)",
  "selectedProgram": "general-medicine",
  "postGraduateDetail": null,
  "signature": "John Michael Doe",
  "signatureDate": "2026-05-20"
}
```

**Program Options:**

| Value | Description |
|-------|-------------|
| `pre-medical` | Pre-medical course — 10 months |
| `general-medicine` | General Medicine (MD, MBBS equivalent) — 6 years |
| `dentistry` | Dentistry (MD, MBBS equivalent) — 5 years |
| `post-graduate` | Post-graduate course (requires `postGraduateDetail`) |

**Language Ability Levels:** `high`, `moderate`, `low`

**Response (201 Created):**
```json
{
  "message": "Application submitted successfully",
  "applicationId": "uuid"
}
```

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Applicant must be at least 16 years old | Age validation failed |
| 400 | Signature date cannot be in the future | Invalid signature date |
| 400 | Validation error | Missing or invalid fields |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | User is not a student |
| 404 | University not found | Invalid universityId |
| 409 | University not accepting applications | University status is not ACTIVE |
| 409 | Already applied to this university | Duplicate application |

---

### GET /student/applications

Get all applications submitted by the logged-in student.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | string | No | Page number (default: 1) |
| `limit` | string | No | Items per page (default: 10) |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "selectedProgram": "general-medicine",
      "status": "pending",
      "submittedAt": "2026-05-20T10:00:00.000Z",
      "university": {
        "id": "uuid",
        "name": "Osh State University",
        "shortName": "OSU",
        "slug": "osu"
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### GET /student/applications/:id

Get details of a specific application by ID.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Application ID |

**Response:**
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "selectedProgram": "general-medicine",
  "status": "pending",
  "submittedAt": "2026-05-20T10:00:00.000Z",
  "formData": {
    "dateOfBirth": "2000-01-15",
    "placeOfBirth": { "city": "Mumbai", "state": "Maharashtra", "country": "India" },
    "citizenship": "Indian",
    "maritalStatus": "single",
    "gender": "male",
    "permanentAddress": "123 Main Street",
    "permanentCity": "Mumbai",
    "permanentState": "Maharashtra",
    "permanentZip": "400001",
    "permanentCountry": "India",
    "embassyLocation": "Mumbai",
    "language1": { "name": "English", "speaking": "high", "reading": "high", "writing": "high" },
    "language2": { "name": "Hindi", "speaking": "moderate", "reading": "moderate", "writing": "low" },
    "otherLanguages": "Marathi (basic)",
    "postGraduateDetail": null
  },
  "university": {
    "id": "uuid",
    "name": "Osh State University",
    "shortName": "OSU",
    "slug": "osu",
    "type": "PUBLIC",
    "status": "ACTIVE",
    "location": {
      "country": "Kyrgyzstan",
      "city": "Osh"
    },
    "contact": {
      "email": "info@oshsu.kg",
      "phone": "+996 3222 12345"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User is not a student
- `404 Not Found` - Application not found or does not belong to user

---

## Application Status Flow

```
pending → in_review → approved
                      ↓
                  rejected
```

| Status | Description |
|--------|-------------|
| `pending` | Application submitted, awaiting review |
| `in_review` | Application is being reviewed by admin |
| `approved` | Application approved by admin |
| `rejected` | Application rejected |

---

## Form Data Storage

| Column | Type | Description |
|--------|------|-------------|
| `firstName` | String | First name (separate column for table display) |
| `lastName` | String | Last name (separate column for table display) |
| `email` | String | Email (separate column for table display) |
| `selectedProgram` | String | Program choice (separate column for filtering) |
| `formData` | JSON | All other form fields in JSON object |
| `submittedAt` | DateTime | When the application was submitted |
| `status` | String | Application status |
| `universityId` | String | Which university applied to |
| `studentId` | String | Which student submitted |

---

## Enums

### UniversityStatus
- `ACTIVE` - University is visible and accepting applications
- `INACTIVE` - University is not visible publicly
- `PENDING` - University is pending approval
- `SUSPENDED` - University is temporarily suspended

### UniversityType
- `PUBLIC` - Government/public university
- `PRIVATE` - Private university
- `DEEMED` - Deemed university

### ECFMGStatus
- `VERIFIED` - ECFMG verified
- `PENDING` - Verification pending
- `NOT_VERIFIED` - Not verified