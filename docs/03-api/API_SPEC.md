# LMS Platform API Specification

## 1. Overview

This document specifies the REST API endpoints for the Medical Admission Management Platform. The API follows REST principles with JSON payloads and follows standard HTTP status codes.

## 2. Base URL
```
https://api.example.com/v1
```

## 3. Authentication

All API requests require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### 3.1 Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "student|admin|university",
    "firstName": "string",
    "lastName": "string"
  }
}
```

### 3.2 Register
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "role": "student|admin|university",
  "firstName": "string",
  "lastName": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "role": "student|admin|university",
  "firstName": "string",
  "lastName": "string"
}
```

### 3.3 Refresh Token
```
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "accessToken": "string"
}
```

## 4. Users

### 4.1 Get User Profile
```
GET /api/users/profile
```

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "role": "student|admin|university",
  "firstName": "string",
  "lastName": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 4.2 Update User Profile
```
PUT /api/users/profile
```

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "role": "student|admin|university",
  "firstName": "string",
  "lastName": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 5. Students

### 5.1 Get Student Profile
```
GET /api/students/profile
```

**Response:**
```json
{
  "id": "string",
  "userId": "string",
  "applicationId": "string",
  "personalDetails": {
    "fullName": "string",
    "dob": "date",
    "gender": "string",
    "nationality": "string",
    "phone": "string",
    "address": "string"
  },
  "emergencyContact": {
    "name": "string",
    "relationship": "string",
    "phone": "string"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 5.2 Update Student Profile
```
PUT /api/students/profile
```

**Request Body:**
```json
{
  "personalDetails": {
    "fullName": "string",
    "dob": "date",
    "gender": "string",
    "nationality": "string",
    "phone": "string",
    "address": "string"
  },
  "emergencyContact": {
    "name": "string",
    "relationship": "string",
    "phone": "string"
  }
}
```

**Response:**
```json
{
  "id": "string",
  "userId": "string",
  "applicationId": "string",
  "personalDetails": {
    "fullName": "string",
    "dob": "date",
    "gender": "string",
    "nationality": "string",
    "phone": "string",
    "address": "string"
  },
  "emergencyContact": {
    "name": "string",
    "relationship": "string",
    "phone": "string"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 6. Applications

### 6.1 Get Student Application
```
GET /api/students/application
```

**Response:**
```json
{
  "id": "string",
  "studentId": "string",
  "universityId": "string",
  "courseId": "string",
  "currentStage": "number",
  "status": "draft|submitted|approved|rejected",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 6.2 Create Application
```
POST /api/students/application
```

**Request Body:**
```json
{
  "universityId": "string",
  "courseId": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "studentId": "string",
  "universityId": "string",
  "courseId": "string",
  "currentStage": 1,
  "status": "draft",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 6.3 Update Application Stage
```
PUT /api/students/stage/:stageId
```

**Request Body:**
```json
{
  "status": "pending|approved|rejected"
}
```

**Response:**
```json
{
  "id": "string",
  "studentId": "string",
  "universityId": "string",
  "courseId": "string",
  "currentStage": "number",
  "status": "draft|submitted|approved|rejected",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 7. Documents

### 7.1 Upload Document
```
POST /api/documents/upload
```

**Request Body (multipart/form-data):**
```json
{
  "documentTypeId": "string",
  "file": "file"
}
```

**Response:**
```json
{
  "id": "string",
  "studentId": "string",
  "applicationId": "string",
  "documentTypeId": "string",
  "fileName": "string",
  "fileUrl": "string",
  "fileType": "string",
  "fileSize": "number",
  "status": "pending",
  "remarks": "string",
  "verifiedAt": "datetime",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 7.2 Get Student Documents
```
GET /api/documents/student/:studentId
```

**Response:**
```json
[
  {
    "id": "string",
    "studentId": "string",
    "applicationId": "string",
    "documentTypeId": "string",
    "fileName": "string",
    "fileUrl": "string",
    "fileType": "string",
    "fileSize": "number",
    "status": "pending|approved|rejected",
    "remarks": "string",
    "verifiedAt": "datetime",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

### 7.3 Update Document Status
```
PUT /api/documents/:id
```

**Request Body:**
```json
{
  "status": "pending|approved|rejected",
  "remarks": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "studentId": "string",
  "applicationId": "string",
  "documentTypeId": "string",
  "fileName": "string",
  "fileUrl": "string",
  "fileType": "string",
  "fileSize": "number",
  "status": "pending|approved|rejected",
  "remarks": "string",
  "verifiedAt": "datetime",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 8. Payments

### 8.1 Create Payment
```
POST /api/payments/create
```

**Request Body:**
```json
{
  "amount": "number",
  "currency": "string",
  "paymentMethod": "razorpay|bank_transfer"
}
```

**Response:**
```json
{
  "id": "string",
  "studentId": "string",
  "applicationId": "string",
  "amount": "number",
  "currency": "string",
  "paymentMethod": "razorpay|bank_transfer",
  "status": "pending",
  "razorpayOrderId": "string",
  "razorpayPaymentId": "string",
  "razorpaySignature": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 8.2 Get Payment
```
GET /api/payments/:id
```

**Response:**
```json
{
  "id": "string",
  "studentId": "string",
  "applicationId": "string",
  "amount": "number",
  "currency": "string",
  "paymentMethod": "razorpay|bank_transfer",
  "status": "pending|success|failed|refunded|manually_approved",
  "razorpayOrderId": "string",
  "razorpayPaymentId": "string",
  "razorpaySignature": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 8.3 Payment Webhook
```
POST /api/payments/webhook
```

**Request Body (from Razorpay):**
```json
{
  "razorpay_payment_id": "string",
  "razorpay_order_id": "string",
  "razorpay_signature": "string",
  "payment_status": "paid|failed|refunded"
}
```

## 9. Universities

### 9.1 Get Universities
```
GET /api/universities
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "country": "string",
      "city": "string",
      "address": "string",
      "contactEmail": "string",
      "contactPhone": "string",
      "logoUrl": "string",
      "description": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

### 9.2 Get University
```
GET /api/universities/:id
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "country": "string",
  "city": "string",
  "address": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "logoUrl": "string",
  "description": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 9.3 Get University Courses
```
GET /api/universities/:id/courses
```

**Response:**
```json
[
  {
    "id": "string",
    "universityId": "string",
    "name": "string",
    "description": "string",
    "duration": "string",
    "fee": "number",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

## 10. Letters

### 10.1 Get Student Letters
```
GET /api/letters/student/:studentId
```

**Response:**
```json
[
  {
    "id": "string",
    "studentId": "string",
    "applicationId": "string",
    "letterType": "admission|invitation|exam",
    "fileName": "string",
    "fileUrl": "string",
    "status": "generated|sent",
    "issuedAt": "datetime",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

### 10.2 Download Letter
```
GET /api/letters/download/:id
```

**Response:**
- Binary file content with appropriate Content-Type header

## 11. Visa Support

### 11.1 Get Student Visa Support
```
GET /api/visa-support/student/:studentId
```

**Response:**
```json
[
  {
    "id": "string",
    "studentId": "string",
    "applicationId": "string",
    "visaCenterId": "string",
    "status": "pending|processing|approved|rejected",
    "documentsRequired": ["string"],
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

### 11.2 Request Visa Support
```
POST /api/visa-support/request
```

**Request Body:**
```json
{
  "applicationId": "string",
  "visaCenterId": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "studentId": "string",
  "applicationId": "string",
  "visaCenterId": "string",
  "status": "pending",
  "documentsRequired": ["string"],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 12. Admin Endpoints

### 12.1 Admin Dashboard Statistics
```
GET /api/admin/dashboard/stats
```

**Response:**
```json
{
  "totalStudents": "number",
  "pendingApplications": "number",
  "pendingDocuments": "number",
  "pendingPayments": "number",
  "recentActivity": [
    {
      "action": "string",
      "user": "string",
      "timestamp": "datetime"
    }
  ]
}
```

### 12.2 Get Pending Applications
```
GET /api/admin/applications/pending
```

**Response:**
```json
[
  {
    "id": "string",
    "studentId": "string",
    "universityId": "string",
    "courseId": "string",
    "currentStage": "number",
    "status": "draft|submitted|approved|rejected",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

### 12.3 Approve/Reject Application
```
PUT /api/admin/applications/:id/status
```

**Request Body:**
```json
{
  "status": "approved|rejected",
  "remarks": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "studentId": "string",
  "universityId": "string",
  "courseId": "string",
  "currentStage": "number",
  "status": "approved|rejected",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 12.4 Get Pending Documents
```
GET /api/admin/documents/pending
```

**Response:**
```json
[
  {
    "id": "string",
    "studentId": "string",
    "applicationId": "string",
    "documentTypeId": "string",
    "fileName": "string",
    "fileUrl": "string",
    "fileType": "string",
    "fileSize": "number",
    "status": "pending",
    "remarks": "string",
    "verifiedAt": "datetime",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

### 12.5 Verify Document
```
PUT /api/admin/documents/:id/verification
```

**Request Body:**
```json
{
  "status": "approved|rejected",
  "remarks": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "studentId": "string",
  "applicationId": "string",
  "documentTypeId": "string",
  "fileName": "string",
  "fileUrl": "string",
  "fileType": "string",
  "fileSize": "number",
  "status": "approved|rejected",
  "remarks": "string",
  "verifiedAt": "datetime",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 13. Error Responses

All error responses follow the RFC 7807 format:

```json
{
  "type": "string",
  "title": "string",
  "status": "number",
  "detail": "string",
  "instance": "string"
}
```

## 14. HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Successful GET, PUT, PATCH, DELETE |
| 201 | Successful POST |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## 15. Rate Limiting

All endpoints are subject to rate limiting:
- 100 requests per minute for authenticated endpoints
- 1000 requests per minute for unauthenticated endpoints
- Exceeded limits return 429 status code with Retry-After header