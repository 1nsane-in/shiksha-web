# Student Profile & Dashboard API

**Base URL:** `http://localhost:8000`  
**Auth:** All endpoints require `Authorization: Bearer <access_token>` header.  
**Role:** All endpoints below require the `STUDENT` role unless noted otherwise.

---

## Table of Contents

1. [Get Profile](#1-get-profile)
2. [Update Profile](#2-update-profile)
3. [Update Academic Info](#3-update-academic-info)
4. [Get Stage Info](#4-get-stage-info)
5. [Dashboard Overview](#5-dashboard-overview)
6. [Dashboard Activity](#6-dashboard-activity)
7. [Dashboard Next Steps](#7-dashboard-next-steps)
8. [Get My Applications](#8-get-my-applications)
9. [Get Application by ID](#9-get-application-by-id)
10. [Check Application Status](#10-check-application-status)
11. [Submit University Application](#11-submit-university-application)

---

## 1. Get Profile

Returns the full student profile including personal info, documents, payments, and applications.

```
GET /student/profile
```

### Headers

| Key | Value |
|-----|-------|
| Authorization | Bearer `<token>` |

### Response `200`

```json
{
  "id": "uuid",
  "userId": "uuid",
  "fatherName": "Ramesh Sahu",
  "motherName": "Sunita Sahu",
  "dob": "2000-05-15T00:00:00.000Z",
  "gender": "male",
  "address": "123 Main Street",
  "city": "Raipur",
  "state": "Chhattisgarh",
  "country": "India",
  "pincode": "492001",
  "passportNumber": "A1234567",
  "passportExpiry": "2030-01-01T00:00:00.000Z",
  "passportIssueDate": "2020-01-01T00:00:00.000Z",
  "passportIssueCountry": "India",
  "neetScore": 620,
  "neetRank": 15000,
  "twelfthPercentage": 88.5,
  "tenthPercentage": 92.0,
  "currentStage": 2,
  "applicationStatus": "STAGE_1_APPROVED",
  "createdAt": "2026-05-01T00:00:00.000Z",
  "updatedAt": "2026-05-28T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "name": "Tushar Sahu",
    "phone": "+919876543210",
    "avatarUrl": null
  },
  "documents": [
    {
      "id": "uuid",
      "documentTypeId": "uuid",
      "fileUrl": "https://storage.example.com/doc.pdf",
      "fileName": "passport.pdf",
      "fileSize": 204800,
      "status": "APPROVED",
      "remarks": null,
      "verifiedAt": "2026-05-20T00:00:00.000Z",
      "createdAt": "2026-05-10T00:00:00.000Z",
      "documentType": {
        "id": "uuid",
        "name": "Passport",
        "code": "PASSPORT",
        "requiredForStage": 1
      }
    }
  ],
  "payments": [
    {
      "id": "uuid",
      "stage": 2,
      "amount": 5000,
      "currency": "INR",
      "status": "SUCCESS",
      "paymentMethod": "UPI",
      "paidAt": "2026-05-22T00:00:00.000Z",
      "createdAt": "2026-05-22T00:00:00.000Z"
    }
  ],
  "applications": [
    {
      "id": "uuid",
      "status": "approved",
      "selectedProgram": "general-medicine",
      "submittedAt": "2026-05-15T00:00:00.000Z",
      "university": {
        "id": "uuid",
        "name": "Osh State Medical University",
        "shortName": "OSMU",
        "slug": "osmu"
      }
    }
  ]
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| `401` | Unauthorized — missing or invalid token |
| `404` | Student profile not found |

---

## 2. Update Profile

Updates personal and travel/passport information. All fields are optional — only send what needs to change.

```
PUT /student/profile
```

### Headers

| Key | Value |
|-----|-------|
| Authorization | Bearer `<token>` |
| Content-Type | application/json |

### Request Body

```json
{
  "fatherName": "Ramesh Sahu",
  "motherName": "Sunita Sahu",
  "dob": "2000-05-15",
  "gender": "male",
  "address": "123 Main Street",
  "city": "Raipur",
  "state": "Chhattisgarh",
  "country": "India",
  "pincode": "492001",
  "passportNumber": "A1234567",
  "passportExpiry": "2030-01-01",
  "passportIssueDate": "2020-01-01",
  "passportIssueCountry": "India"
}
```

### Field Reference

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `fatherName` | string | No | |
| `motherName` | string | No | |
| `dob` | string (ISO date) | No | Format: `YYYY-MM-DD` |
| `gender` | string | No | e.g. `male`, `female`, `other` |
| `address` | string | No | |
| `city` | string | No | |
| `state` | string | No | |
| `country` | string | No | |
| `pincode` | string | No | |
| `passportNumber` | string | No | |
| `passportExpiry` | string (ISO date) | No | Format: `YYYY-MM-DD` |
| `passportIssueDate` | string (ISO date) | No | Format: `YYYY-MM-DD` |
| `passportIssueCountry` | string | No | |

### Response `200`

Returns the updated student record (same shape as the `Student` model without relations).

```json
{
  "id": "uuid",
  "userId": "uuid",
  "fatherName": "Ramesh Sahu",
  "motherName": "Sunita Sahu",
  "dob": "2000-05-15T00:00:00.000Z",
  "gender": "male",
  "address": "123 Main Street",
  "city": "Raipur",
  "state": "Chhattisgarh",
  "country": "India",
  "pincode": "492001",
  "passportNumber": "A1234567",
  "passportExpiry": "2030-01-01T00:00:00.000Z",
  "passportIssueDate": "2020-01-01T00:00:00.000Z",
  "passportIssueCountry": "India",
  "neetScore": 620,
  "neetRank": 15000,
  "twelfthPercentage": 88.5,
  "tenthPercentage": 92.0,
  "currentStage": 2,
  "applicationStatus": "STAGE_1_APPROVED",
  "updatedAt": "2026-05-29T00:00:00.000Z"
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| `400` | Validation error — invalid date format or field type |
| `401` | Unauthorized |
| `404` | Student not found |

---

## 3. Update Academic Info

Updates NEET score, rank, and percentage scores.

```
PUT /student/profile/academic
```

### Headers

| Key | Value |
|-----|-------|
| Authorization | Bearer `<token>` |
| Content-Type | application/json |

### Request Body

```json
{
  "neetScore": 620,
  "neetRank": 15000,
  "twelfthPercentage": 88.5
}
```

### Field Reference

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `neetScore` | number | No | Raw NEET score |
| `neetRank` | number | No | All India rank |
| `twelfthPercentage` | number | No | Percentage (0–100) |

### Response `200`

Same shape as [Update Profile](#2-update-profile) response.

### Error Responses

| Status | Description |
|--------|-------------|
| `400` | Validation error |
| `401` | Unauthorized |
| `404` | Student not found |

---

## 4. Get Stage Info

Returns the student's current stage, application status, stage requirements, documents, and payments.

```
GET /student/stage
```

### Headers

| Key | Value |
|-----|-------|
| Authorization | Bearer `<token>` |

### Response `200`

```json
{
  "currentStage": 2,
  "applicationStatus": "STAGE_1_APPROVED",
  "requirements": [
    {
      "id": "uuid",
      "stage": 2,
      "description": "Pay admission fee and upload required documents",
      "documentTypeIds": ["uuid1", "uuid2"],
      "paymentAmount": 5000,
      "isActive": true
    }
  ],
  "documents": [
    {
      "id": "uuid",
      "documentTypeId": "uuid",
      "fileUrl": "https://storage.example.com/doc.pdf",
      "fileName": "passport.pdf",
      "status": "APPROVED",
      "documentType": {
        "id": "uuid",
        "name": "Passport",
        "code": "PASSPORT",
        "requiredForStage": 1
      }
    }
  ],
  "payments": [
    {
      "id": "uuid",
      "stage": 2,
      "amount": 5000,
      "status": "SUCCESS",
      "paidAt": "2026-05-22T00:00:00.000Z"
    }
  ]
}
```

### Application Status Values

| Value | Meaning |
|-------|---------|
| `NOT_STARTED` | No action taken |
| `STAGE_1_PENDING` | Stage 1 documents submitted, awaiting review |
| `STAGE_1_IN_REVIEW` | Admin reviewing Stage 1 |
| `STAGE_1_APPROVED` | Stage 1 approved, Stage 2 unlocked |
| `STAGE_2_PENDING` | Admission fee pending |
| `STAGE_2_IN_REVIEW` | Admission fee under review |
| `STAGE_2_APPROVED` | Stage 2 approved |
| `STAGE_3_ACTIVE` | Exam stage active |
| `STAGE_4_PENDING` | Invitation letter pending |
| `STAGE_4_APPROVED` | Invitation letter approved |
| `STAGE_5_UNLOCKED` | Visa support unlocked |
| `COMPLETED` | Admission complete |
| `REJECTED` | Application rejected |

---

## 5. Dashboard Overview

Returns a comprehensive overview for the student dashboard: profile, stage, document stats, payment stats, applications, exam summary, and letter availability.

```
GET /student/dashboard/overview
```

### Headers

| Key | Value |
|-----|-------|
| Authorization | Bearer `<token>` |

### Response `200`

```json
{
  "profile": {
    "studentId": "uuid",
    "id": "uuid",
    "email": "student@example.com",
    "name": "Tushar Sahu",
    "phone": "+919876543210",
    "avatarUrl": null,
    "fatherName": "Ramesh Sahu",
    "motherName": "Sunita Sahu",
    "dob": "2000-05-15T00:00:00.000Z",
    "gender": "male",
    "address": "123 Main Street",
    "city": "Raipur",
    "state": "Chhattisgarh",
    "country": "India",
    "pincode": "492001",
    "passportNumber": "A1234567",
    "passportExpiry": "2030-01-01T00:00:00.000Z",
    "passportIssueDate": "2020-01-01T00:00:00.000Z",
    "passportIssueCountry": "India",
    "neetScore": 620,
    "neetRank": 15000,
    "twelfthPercentage": 88.5,
    "tenthPercentage": 92.0
  },
  "stage": {
    "currentStage": 2,
    "applicationStatus": "STAGE_1_APPROVED"
  },
  "documentStats": {
    "total": 5,
    "approved": 3,
    "pending": 1,
    "rejected": 1
  },
  "paymentStats": {
    "totalPaid": 5000,
    "pendingAmount": 0,
    "totalPayments": 1
  },
  "applicationSummary": {
    "total": 1,
    "applications": [
      {
        "id": "uuid",
        "status": "approved",
        "selectedProgram": "general-medicine",
        "submittedAt": "2026-05-15T00:00:00.000Z",
        "university": {
          "id": "uuid",
          "name": "Osh State Medical University",
          "shortName": "OSMU"
        }
      }
    ]
  },
  "examSummary": {
    "id": "uuid",
    "examDate": "2026-06-15T09:00:00.000Z",
    "result": "AWAITED"
  },
  "lettersAvailability": {
    "admissionLetter": true,
    "invitationLetter": false
  }
}
```

### Notes

- `documentStats.pending` includes statuses: `UPLOADED`, `IN_REVIEW`, `PROCESSING`, `REUPLOAD_REQUIRED`
- `paymentStats.totalPaid` includes `SUCCESS` and `MANUALLY_APPROVED` payments
- `examSummary` is `null` if no exam record exists
- `applicationSummary.applications` returns the latest 5 applications

---

## 6. Dashboard Activity

Returns recent timeline events, unread notification count, and upcoming deadlines (exams, visa appointments).

```
GET /student/dashboard/activity
```

### Headers

| Key | Value |
|-----|-------|
| Authorization | Bearer `<token>` |

### Response `200`

```json
{
  "recentEvents": [
    {
      "id": "uuid",
      "stage": 1,
      "event": "APPLICATION_APPROVED",
      "title": "Application Approved",
      "description": "Your university application has been approved.",
      "occurredAt": "2026-05-28T21:13:15.307Z"
    }
  ],
  "unreadNotifications": 3,
  "upcomingDeadlines": [
    {
      "type": "exam",
      "date": "2026-06-15T09:00:00.000Z",
      "title": "Exam: Entrance",
      "detail": "Raipur Exam Center"
    },
    {
      "type": "visa",
      "date": "2026-07-10T10:00:00.000Z",
      "title": "Visa Appointment",
      "detail": "Tourist Visa"
    }
  ]
}
```

### Notes

- `recentEvents` returns the latest 10 events, ordered by `occurredAt` descending
- `upcomingDeadlines` only includes future dates, sorted ascending
- Auto-refreshes every 60 seconds on the frontend

---

## 7. Dashboard Next Steps

Returns context-aware action items based on the student's current stage and completion status.

```
GET /student/dashboard/next-steps
```

### Headers

| Key | Value |
|-----|-------|
| Authorization | Bearer `<token>` |

### Response `200`

```json
{
  "nextActions": [
    {
      "type": "profile",
      "title": "Complete your profile",
      "description": "Fill in personal details, address, and academic info",
      "actionUrl": "/student/profile",
      "priority": "high",
      "completed": true
    },
    {
      "type": "passport",
      "title": "Add passport details",
      "description": "Required for international admission process",
      "actionUrl": "/student/profile",
      "priority": "medium",
      "completed": false
    },
    {
      "type": "documents",
      "title": "Upload required documents",
      "description": "3/5 documents approved",
      "actionUrl": "/student/documents",
      "priority": "high",
      "completed": false
    },
    {
      "type": "payment",
      "title": "Complete Stage 2 payment",
      "description": "Payment required to proceed",
      "actionUrl": "/student/payments",
      "priority": "high",
      "completed": false
    },
    {
      "type": "application",
      "title": "Submit university application",
      "description": "Application submitted",
      "actionUrl": "/student/applications",
      "priority": "medium",
      "completed": true
    }
  ],
  "completionPercentage": 40,
  "pendingItems": [
    "Add passport details",
    "Upload required documents",
    "Complete Stage 2 payment"
  ]
}
```

### Action Types by Stage

| Stage | Action Types Returned |
|-------|-----------------------|
| 1+ | `profile`, `passport`, `documents`, `payment`, `application` |
| 2+ | + `exam` |
| 3+ | + `admission_letter` |
| 4+ | + `invitation_letter` |
| 5+ | + `visa` |

### Priority Values

| Value | Meaning |
|-------|---------|
| `high` | Blocking — must complete to progress |
| `medium` | Important but not immediately blocking |
| `low` | Optional or informational |

---

## 8. Get My Applications

Returns a paginated list of the student's university applications.

```
GET /student/applications
```

### Headers

| Key | Value |
|-----|-------|
| Authorization | Bearer `<token>` |

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page |

### Response `200`

```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "Tushar",
      "lastName": "Sahu",
      "email": "student@example.com",
      "selectedProgram": "general-medicine",
      "status": "approved",
      "submittedAt": "2026-05-15T00:00:00.000Z",
      "university": {
        "id": "uuid",
        "name": "Osh State Medical University",
        "shortName": "OSMU",
        "slug": "osmu"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Application Status Values

| Value | Meaning |
|-------|---------|
| `pending` | Submitted, awaiting admin review |
| `in_review` | Admin is reviewing |
| `approved` | Application approved |
| `rejected` | Application rejected |

---

## 9. Get Application by ID

Returns full details of a specific application including university info.

```
GET /student/applications/:id
```

### Headers

| Key | Value |
|-----|-------|
| Authorization | Bearer `<token>` |

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID | Application ID |

### Response `200`

```json
{
  "id": "uuid",
  "firstName": "Tushar",
  "lastName": "Sahu",
  "email": "student@example.com",
  "selectedProgram": "general-medicine",
  "status": "approved",
  "submittedAt": "2026-05-15T00:00:00.000Z",
  "formData": {
    "gender": "male",
    "dateOfBirth": "2000-05-15",
    "citizenship": "Indian",
    "maritalStatus": "single",
    "placeOfBirth": {
      "city": "Raipur",
      "state": "Chhattisgarh",
      "country": "India"
    },
    "permanentAddress": "123 Main Street",
    "permanentCity": "Raipur",
    "permanentState": "Chhattisgarh",
    "permanentZip": "492001",
    "permanentCountry": "India",
    "embassyLocation": "New Delhi",
    "language1": {
      "name": "Hindi",
      "speaking": "high",
      "reading": "high",
      "writing": "high"
    }
  },
  "university": {
    "id": "uuid",
    "name": "Osh State Medical University",
    "shortName": "OSMU",
    "slug": "osmu",
    "type": "GOVERNMENT",
    "status": "ACTIVE",
    "location": {
      "country": "Kyrgyzstan",
      "city": "Osh"
    },
    "contact": {
      "email": "admissions@osmu.edu.kg",
      "phone": "+996312000000"
    }
  }
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| `401` | Unauthorized |
| `404` | Application not found or does not belong to this student |

---
