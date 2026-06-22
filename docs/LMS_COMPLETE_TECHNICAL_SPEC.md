# Medical Admission LMS Platform - Complete Technical Documentation

## 1. Executive Summary

This document provides a complete technical specification for implementing a comprehensive Learning Management System (LMS) that integrates with the existing Medical Admission Management Platform. The system mirrors Udemy/Coursera capabilities while maintaining alignment with medical education requirements.

## 2. System Architecture

### 2.1 Overall Architecture

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
│  Courses Module  │  Sections Module  │  Video Streaming Module  │
│  Live Classes Module  │  Reviews Module  │  Enrollment Module  │
└─────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Layer (PostgreSQL)               │
│  Users & Auth Tables  │  Admission Workflow Tables  │
│  Payments Tables  │  Universities & Courses  │
│  Letters & Visa Tables  │  System Tables  │
│  AI Tables  │  Audit Logs  │  LMS Tables  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

- **Backend**: NestJS (TypeScript) with Prisma ORM
- **Frontend**: Next.js (React) with Tailwind CSS and shadcn/ui
- **Database**: PostgreSQL (Neon) with Prisma
- **Authentication**: JWT-based with role-based access control
- **File Storage**: Private object storage (Cloudflare R2)
- **Payments**: Razorpay with webhook verification
- **Video Hosting**: Vimeo API
- **Live Streaming**: Agora API
- **AI**: Vercel AI SDK with OpenRouter integration
- **Deployment**: Dockerized with CI/CD

## 3. Module Structure

### 3.1 Courses Module
**Purpose**: Manage course lifecycle (create, update, publish)
**Entities**: Course, Section, Lecture
**Features**: 
- Course metadata (title, description, thumbnail)
- Section/lecture organization
- Video upload integration
- Text content support
- Publishing workflow

### 3.2 Video Streaming Module
**Purpose**: Handle video content delivery
**Integration**: Vimeo API
**Features**:
- Video upload and storage
- Adaptive bitrate streaming
- Video analytics
- Secure access tokens

### 3.3 Sections Module
**Purpose**: Organize course content
**Entities**: Section, Lecture
**Features**:
- Section creation (title, description)
- Lecture management (video, text, quizzes)
- Ordering and preview settings
- Content hierarchy

### 3.4 Student Enrollment Module
**Purpose**: Manage student access and progress
**Entities**: Enrollment, Progress
**Features**:
- Course enrollment
- Payment processing
- Progress tracking
- Certificate generation

### 3.5 Reviews Module
**Purpose**: Community feedback system
**Entities**: Review, Rating
**Features**:
- 5-star rating system
- Text reviews
- Helpful votes
- Moderation

### 3.6 Live Classes Module
**Purpose**: Real-time interactive learning
**Integration**: Agora API
**Features**:
- Class scheduling
- Live streaming
- Recording
- Interactive features

## 4. API Endpoints Specification

### 4.1 Courses Module APIs

#### Course Management
```
POST   /courses                    - Create new course
GET    /courses                    - List courses (with filters)
GET    /courses/:id                - Get course details
PATCH  /courses/:id                - Update course
DELETE /courses/:id                - Delete course
PATCH  /courses/:id/publish        - Publish/unpublish course
```

#### Course Sections
```
POST   /courses/:courseId/sections - Create section
GET    /courses/:courseId/sections - List sections
GET    /sections/:id               - Get section details
PATCH  /sections/:id               - Update section
DELETE /sections/:id               - Delete section
```

#### Course Lectures
```
POST   /sections/:sectionId/lectures - Create lecture
GET    /sections/:sectionId/lectures - List lectures
GET    /lectures/:id               - Get lecture details
PATCH  /lectures/:id               - Update lecture
DELETE /lectures/:id               - Delete lecture
```

### 4.2 Student Enrollment APIs

#### Enrollment Management
```
POST   /courses/:id/enroll         - Enroll in course
GET    /courses/:id/progress       - Get student progress
GET    /enrollments                - List student enrollments
GET    /enrollments/:id            - Get enrollment details
PATCH  /enrollments/:id            - Update enrollment
```

#### Payment Processing
```
POST   /courses/:id/payment        - Initiate payment
GET    /payments/:id               - Get payment status
POST   /payments/:id/callback      - Handle payment callback
```

### 4.3 Video Streaming APIs

#### Video Management
```
POST   /lectures/:id/video         - Upload video
GET    /lectures/:id/video         - Get video URL
PATCH  /lectures/:id/video         - Update video metadata
```

#### Video Analytics
```
POST   /lectures/:id/watch         - Mark lecture as watched
GET    /lectures/:id/analytics     - Get watching stats
```

### 4.4 Assessment & Quizzes

#### Quiz Management
```
POST   /lectures/:lectureId/quiz   - Create quiz
GET    /lectures/:lectureId/quiz   - Get quiz
PATCH  /lectures/:lectureId/quiz   - Update quiz
DELETE /lectures/:lectureId/quiz   - Delete quiz
```

#### Quiz Attempts
```
POST   /quizzes/:quizId/attempt    - Start quiz attempt
POST   /quizzes/:quizId/submit     - Submit quiz answers
GET    /quizzes/:quizId/results    - Get quiz results
```

### 4.5 Review & Rating APIs

#### Reviews
```
POST   /courses/:id/reviews        - Create review
GET    /courses/:id/reviews        - List course reviews
GET    /reviews/:id                - Get review details
PATCH  /reviews/:id                - Update review
DELETE /reviews/:id                - Delete review
```

#### Review Voting
```
POST   /reviews/:id/helpful        - Mark helpful
POST   /reviews/:id/report         - Report review
```

### 4.6 Live Classes APIs

#### Class Management
```
POST   /live-classes               - Schedule live class
GET    /live-classes               - List live classes
GET    /live-classes/:id           - Get class details
PATCH  /live-classes/:id           - Update class
DELETE /live-classes/:id           - Cancel class
```

#### Class Participation
```
POST   /live-classes/:id/join      - Join live class
POST   /live-classes/:id/leave     - Leave live class
GET    /live-classes/:id/status    - Get class status
```

#### Class Recording
```
GET    /live-classes/:id/recording - Get recording URL
POST   /live-classes/:id/record    - Start recording
```

### 4.7 Instructor Dashboard APIs

#### Course Analytics
```
GET    /instructor/courses/analytics - Get course performance
GET    /instructor/courses/:id/stats - Get course stats
GET    /instructor/students/:id/stats - Get student progress
```

#### Content Management
```
GET    /instructor/courses         - List instructor courses
GET    /instructor/courses/:id     - Get course for instructor
POST   /instructor/courses/:id     - Update course (instructor only)
```

### 4.8 Student Learning APIs

#### Learning Progress
```
GET    /student/courses            - List enrolled courses
GET    /student/courses/:id        - Get course progress
GET    /student/lectures/:id       - Get lecture status
PATCH  /student/lectures/:id       - Mark lecture complete
```

#### Course Materials
```
GET    /student/courses/:id/notes  - Get study notes
GET    /student/courses/:id/resources - Get resources
GET    /student/lectures/:id/content - Get lecture content
```

### 4.9 System APIs

#### Authentication
```
POST   /auth/login                 - User login
POST   /auth/register              - User registration
POST   /auth/refresh               - Refresh token
```

#### User Profile
```
GET    /profile                    - Get user profile
PATCH  /profile                    - Update profile
GET    /profile/courses            - Get enrolled courses
```

## 5. Data Models

### 5.1 Course
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "thumbnail": "string",
  "instructorId": "uuid",
  "category": "string",
  "subcategory": "string",
  "difficulty": "BEGINNER|INTERMEDIATE|ADVANCED",
  "pricingType": "FREE|PAID",
  "amount": "number",
  "currency": "string",
  "isPublished": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 5.2 Section
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "order": "number",
  "isPreview": "boolean",
  "courseId": "uuid",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 5.3 Lecture
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "type": "VIDEO|TEXT|QUIZ",
  "order": "number",
  "isPreview": "boolean",
  "sectionId": "uuid",
  "videoUrl": "string",
  "videoDuration": "number",
  "textContent": "string",
  "quizId": "uuid",
  "resourceUrl": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 5.4 Enrollment
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "courseId": "uuid",
  "status": "ACTIVE|COMPLETED|FAILED",
  "progress": "number",
  "completedLectures": ["uuid"],
  "totalWatchTime": "number",
  "createdAt": "datetime",
  "completedAt": "datetime"
}
```

### 5.5 Review
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "courseId": "uuid",
  "rating": "number",
  "comment": "string",
  "isHelpful": "number",
  "isReported": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 6. Integration Points

### 6.1 External Systems
- **Razorpay**: Payment gateway for tuition fees
- **Cloudflare R2**: Object storage for documents and videos
- **Vimeo**: Video hosting and streaming
- **Agora**: Live streaming for interactive classes
- **OpenRouter**: LLM services for AI features
- **Twilio**: SMS notifications
- **Zeptomail**: Email notifications

### 6.2 Internal Services
- **Prisma**: Database abstraction layer
- **JWT**: Authentication and session management
- **Rate Limiting**: Protection against abuse
- **Audit Logs**: Tracking of sensitive actions

## 7. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Database schema and migrations
- Core module structure (Courses, Sections)
- Basic CRUD operations
- Third-party service integration (Vimeo, Agora)

### Phase 2: Core Features (Weeks 3-4)
- Video upload and streaming functionality
- Live class scheduling and management
- Enrollment and payment system
- Progress tracking and certificates

### Phase 3: Frontend Integration (Weeks 5-6)
- Instructor dashboard UI
- Student learning interface
- Mobile app development
- User experience optimization

### Phase 4: Testing & Optimization (Weeks 7-8)
- Comprehensive testing
- Performance optimization
- Security auditing
- Production deployment

## 8. Security Considerations

### 8.1 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (student, instructor, admin)
- Password hashing with bcrypt
- Session management with secure cookies

### 8.2 Data Protection
- All sensitive data encrypted at rest
- Secure file storage with signed URLs
- No exposure of private file URLs
- Data validation and sanitization
- Input validation for all endpoints

### 8.3 API Security
- Rate limiting for all endpoints
- CSRF protection
- XSS protection
- CORS configuration
- HTTP security headers

### 8.4 Payment Security
- Razorpay webhook signature verification
- Payment status updates only via webhooks
- No hardcoded payment amounts in frontend
- Secure storage of payment credentials

## 9. Performance Guidelines

### 9.1 Database Optimization
- Proper indexing on frequently queried fields
- Database connection pooling
- Query optimization for large datasets
- Caching strategies for static data

### 9.2 API Performance
- Pagination for collections
- Efficient data fetching with joins
- Response caching for static content
- Asynchronous processing for heavy operations

### 9.3 File Handling
- Chunked uploads for large files
- File size validation
- Secure file storage with signed URLs
- Async processing for document validation

### 9.4 Caching Strategy
- Redis for session and cache data
- CDN for static assets
- API response caching for frequently accessed data
- Browser caching for UI elements

## 10. Monitoring & Logging

### 10.1 Application Monitoring
- Health checks for all services
- Performance metrics collection
- Error tracking and reporting
- Database query performance monitoring

### 10.2 Audit Logging
- All sensitive admin actions logged
- User activity tracking
- Document verification logs
- Payment transaction logs

## 11. Deployment Architecture

### 11.1 Containerization
- Docker containers for all services
- Multi-stage builds for optimized images
- Environment-specific configurations

### 11.2 CI/CD Pipeline
- Automated testing and validation
- Deployment to staging and production
- Rollback mechanisms
- Zero-downtime deployments

### 11.3 Infrastructure
- PostgreSQL with Neon for database
- Cloudflare R2 for file storage
- Load balancer for traffic distribution
- SSL termination at the edge

## 12. Testing Strategy

### 12.1 Unit Testing
- Service layer testing
- Controller testing
- Database interaction testing

### 12.2 Integration Testing
- API endpoint testing
- Database migration testing
- External service integration testing

### 12.3 End-to-End Testing
- Student application flow testing
- Admin verification workflows
- Payment processing scenarios

### 12.4 Security Testing
- Authentication testing
- Authorization testing
- Vulnerability scanning
- Penetration testing

## 13. User Roles and Permissions

### 13.1 Student Role
- Browse and enroll in courses
- Access course content (videos, lectures, quizzes)
- Attend live classes
- Track learning progress
- Submit reviews and ratings
- Download certificates

### 13.2 Instructor Role
- Create and manage courses
- Upload and organize course content
- Schedule and conduct live classes
- Monitor student progress
- Manage course analytics
- Receive payments for course sales

### 13.3 Admin Role
- Moderate course content and reviews
- Approve course publishing
- Manage user accounts and permissions
- Monitor system performance and usage
- Handle disputes and support tickets
- Configure system settings

## 14. Mobile Application Support

### 14.1 Mobile Features
- Course browsing and enrollment
- Video streaming with offline support
- Live class participation
- Progress tracking and notifications
- Certificate access
- Mobile-optimized user interface

### 14.2 Technical Implementation
- React Native for cross-platform support
- Offline caching for course materials
- Push notifications for class reminders
- Performance optimization for mobile networks

## 15. Success Metrics

### 15.1 Platform Metrics
- Course creation volume (100+ courses in first month)
- Student enrollment numbers (1000+ students)
- Course completion rate (>60%)
- Live class attendance rate (>70%)
- Video streaming quality (<2% buffering)

### 15.2 Business Metrics
- Revenue generation ($10K+ in first month)
- Instructor retention (80%+ active instructors)
- Student satisfaction (4.5+ star rating)
- Support ticket volume (<5% of users)

### 15.3 Technical Metrics
- System uptime (99.9%)
- API response time (<200ms p95)
- Error rate (<1%)
- Test coverage (80%+)

This comprehensive specification provides a complete technical blueprint for implementing the LMS platform, covering all aspects from architecture to implementation details.