# LMS Platform Technical Specification

## 1. System Architecture Overview

The LMS platform follows a modular monolithic architecture built with NestJS as the primary backend framework, Next.js for the frontend, and PostgreSQL with Prisma ORM. The system is designed for medical admission management with distinct roles for students and administrators.

### 1.1 Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│  Student Dashboard  │  Admin Dashboard  │  Auth Screens  │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                    API Layer (NestJS)                   │
│  Auth Module  │  Users Module  │  Applications Module  │
│  Students Module  │  Documents Module  │  Payments Module  │
│  Universities Module  │  Letters Module  │  Visa Support Module  │
│  AI Module  │  Notifications Module  │  Admin Module  │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Layer (PostgreSQL)               │
│  Users & Auth Tables  │  Admission Workflow Tables  │
│  Payments Tables  │  Universities & Courses  │
│  Letters & Visa Tables  │  System Tables  │
│  AI Tables  │  Audit Logs  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

- **Backend**: NestJS (TypeScript) with Prisma ORM
- **Frontend**: Next.js (React) with Tailwind CSS and shadcn/ui
- **Database**: PostgreSQL (Neon) with Prisma
- **Authentication**: JWT-based with role-based access control
- **File Storage**: Private object storage (Cloudflare R2)
- **Payments**: Razorpay with webhook verification
- **AI**: Vercel AI SDK with OpenRouter integration
- **Deployment**: Dockerized with CI/CD

## 2. API Specification

### 2.1 REST Endpoints

#### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

#### Users
```
GET /api/users/profile
PUT /api/users/profile
GET /api/users/:id
```

#### Students
```
GET /api/students/profile
PUT /api/students/profile
GET /api/students/application
POST /api/students/application
GET /api/students/stage/:stageId
PUT /api/students/stage/:stageId
```

#### Applications
```
GET /api/applications/:id
PUT /api/applications/:id
GET /api/applications/student/:studentId
GET /api/applications/stage/:stageId
```

#### Documents
```
POST /api/documents/upload
GET /api/documents/student/:studentId
GET /api/documents/:id
PUT /api/documents/:id
DELETE /api/documents/:id
GET /api/documents/verification-status
```

#### Payments
```
POST /api/payments/create
GET /api/payments/:id
GET /api/payments/student/:studentId
POST /api/payments/webhook
GET /api/payments/stage/:stageId
```

#### Universities
```
GET /api/universities
GET /api/universities/:id
GET /api/universities/:id/courses
GET /api/universities/student/:studentId
```

#### Letters
```
GET /api/letters/student/:studentId
GET /api/letters/:id
GET /api/letters/download/:id
```

#### Visa Support
```
GET /api/visa-support/student/:studentId
POST /api/visa-support/request
GET /api/visa-support/:id
```

#### Admin
```
GET /api/admin/dashboard/stats
GET /api/admin/applications/pending
GET /api/admin/documents/pending
GET /api/admin/payments/pending
PUT /api/admin/applications/:id/status
PUT /api/admin/documents/:id/verification
PUT /api/admin/payments/:id/status
```

### 2.2 Data Models

#### User
```typescript
{
  id: string,
  email: string,
  password: string,
  role: 'student' | 'admin' | 'university',
  firstName: string,
  lastName: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### Student
```typescript
{
  id: string,
  userId: string,
  applicationId: string,
  personalDetails: {
    fullName: string,
    dob: Date,
    gender: string,
    nationality: string,
    phone: string,
    address: string
  },
  emergencyContact: {
    name: string,
    relationship: string,
    phone: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Application
```typescript
{
  id: string,
  studentId: string,
  universityId: string,
  courseId: string,
  currentStage: number,
  status: 'draft' | 'submitted' | 'approved' | 'rejected',
  createdAt: Date,
  updatedAt: Date
}
```

#### Document
```typescript
{
  id: string,
  studentId: string,
  applicationId: string,
  documentTypeId: string,
  fileName: string,
  fileUrl: string,
  fileType: string,
  fileSize: number,
  status: 'pending' | 'approved' | 'rejected',
  remarks: string,
  verifiedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Payment
```typescript
{
  id: string,
  studentId: string,
  applicationId: string,
  amount: number,
  currency: string,
  paymentMethod: 'razorpay' | 'bank_transfer',
  status: 'pending' | 'success' | 'failed' | 'refunded' | 'manually_approved',
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### University
```typescript
{
  id: string,
  name: string,
  country: string,
  city: string,
  address: string,
  contactEmail: string,
  contactPhone: string,
  logoUrl: string,
  description: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### Letter
```typescript
{
  id: string,
  studentId: string,
  applicationId: string,
  letterType: 'admission' | 'invitation' | 'exam',
  fileName: string,
  fileUrl: string,
  status: 'generated' | 'sent',
  issuedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 3. Module Descriptions

### 3.1 Authentication Module
Handles user authentication with JWT tokens, password hashing, and role-based access control.

### 3.2 Users Module
Manages user profiles, roles, and basic user information.

### 3.3 Students Module
Handles student-specific information, profiles, and application tracking.

### 3.4 Applications Module
Manages the multi-stage admission application process with status tracking.

### 3.5 Documents Module
Handles document upload, storage, verification, and approval workflows.

### 3.6 Payments Module
Processes payments through Razorpay with webhook verification and status tracking.

### 3.7 Universities Module
Manages university information and course offerings.

### 3.8 Letters Module
Handles generation and distribution of admission and invitation letters.

### 3.9 Visa Support Module
Manages visa application support and documentation.

### 3.10 Admin Module
Provides administrative interfaces for managing applications, documents, and payments.

### 3.11 AI Module
Provides AI-assisted document validation and admin assistance features.

## 4. Integration Points

### 4.1 External Systems
- **Razorpay**: Payment gateway for tuition fees
- **Cloudflare R2**: Object storage for documents
- **OpenRouter**: LLM services for AI features
- **Twilio**: SMS notifications
- **Zeptomail**: Email notifications

### 4.2 Internal Services
- **Prisma**: Database abstraction layer
- **JWT**: Authentication and session management
- **Rate Limiting**: Protection against abuse
- **Audit Logs**: Tracking of sensitive actions

## 5. Implementation Roadmap

### Phase 1: Foundation (Auth & Users)
- User registration and authentication
- Role-based access control
- Basic user profiles
- Password reset functionality

### Phase 2: Student Application
- Application form creation
- Stage-wise application process
- Student dashboard
- Document upload capability

### Phase 3: Document Management
- Document verification workflows
- Approval/rejection system
- Document status tracking

### Phase 4: Payments Integration
- Payment processing with Razorpay
- Webhook handling
- Payment status tracking

### Phase 5: Letters and Visa Support
- Letter generation and distribution
- Visa support documentation
- Invitation letter process

### Phase 6: Admin Features
- Admin dashboard
- Document verification interface
- Payment approval workflows
- Reporting features

### Phase 7: AI Integration
- AI document validation
- Admin assistance features
- Chatbot and support tools

## 6. Security Considerations

### 6.1 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (student, admin, university)
- Password hashing with bcrypt
- Session management with secure cookies

### 6.2 Data Protection
- All sensitive data encrypted at rest
- Secure file storage with signed URLs
- No exposure of private file URLs
- Data validation and sanitization
- Input validation for all endpoints

### 6.3 API Security
- Rate limiting for all endpoints
- CSRF protection
- XSS protection
- CORS configuration
- HTTP security headers

### 6.4 Payment Security
- Razorpay webhook signature verification
- Payment status updates only via webhooks
- No hardcoded payment amounts in frontend
- Secure storage of payment credentials

## 7. Performance Guidelines

### 7.1 Database Optimization
- Proper indexing on frequently queried fields
- Database connection pooling
- Query optimization for large datasets
- Caching strategies for static data

### 7.2 API Performance
- Pagination for collections
- Efficient data fetching with joins
- Response caching for static content
- Asynchronous processing for heavy operations

### 7.3 File Handling
- Chunked uploads for large files
- File size validation
- Secure file storage with signed URLs
- Async processing for document validation

### 7.4 Caching Strategy
- Redis for session and cache data
- CDN for static assets
- API response caching for frequently accessed data
- Browser caching for UI elements

## 8. Monitoring & Logging

### 8.1 Application Monitoring
- Health checks for all services
- Performance metrics collection
- Error tracking and reporting
- Database query performance monitoring

### 8.2 Audit Logging
- All sensitive admin actions logged
- User activity tracking
- Document verification logs
- Payment transaction logs

## 9. Deployment Architecture

### 9.1 Containerization
- Docker containers for all services
- Multi-stage builds for optimized images
- Environment-specific configurations

### 9.2 CI/CD Pipeline
- Automated testing and validation
- Deployment to staging and production
- Rollback mechanisms
- Zero-downtime deployments

### 9.3 Infrastructure
- PostgreSQL with Neon for database
- Cloudflare R2 for file storage
- Load balancer for traffic distribution
- SSL termination at the edge

## 10. Testing Strategy

### 10.1 Unit Testing
- Service layer testing
- Controller testing
- Database interaction testing

### 10.2 Integration Testing
- API endpoint testing
- Database migration testing
- External service integration testing

### 10.3 End-to-End Testing
- Student application flow testing
- Admin verification workflows
- Payment processing scenarios

### 10.4 Security Testing
- Authentication testing
- Authorization testing
- Vulnerability scanning
- Penetration testing

This specification provides a comprehensive technical blueprint for the LMS platform, covering all key aspects from architecture to implementation details.