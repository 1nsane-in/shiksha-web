# LMS API Endpoints Specification

## Courses Module APIs

### Course Management
```
POST   /courses                    - Create new course
GET    /courses                    - List courses (with filters)
GET    /courses/:id                - Get course details
PATCH  /courses/:id                - Update course
DELETE /courses/:id                - Delete course
PATCH  /courses/:id/publish        - Publish/unpublish course
```

### Course Sections
```
POST   /courses/:courseId/sections - Create section
GET    /courses/:courseId/sections - List sections
GET    /sections/:id               - Get section details
PATCH  /sections/:id               - Update section
DELETE /sections/:id               - Delete section
```

### Course Lectures
```
POST   /sections/:sectionId/lectures - Create lecture
GET    /sections/:sectionId/lectures - List lectures
GET    /lectures/:id               - Get lecture details
PATCH  /lectures/:id               - Update lecture
DELETE /lectures/:id               - Delete lecture
```

## Student Enrollment APIs

### Enrollment Management
```
POST   /courses/:id/enroll         - Enroll in course
GET    /courses/:id/progress       - Get student progress
GET    /enrollments                - List student enrollments
GET    /enrollments/:id            - Get enrollment details
PATCH  /enrollments/:id            - Update enrollment
```

### Payment Processing
```
POST   /courses/:id/payment        - Initiate payment
GET    /payments/:id               - Get payment status
POST   /payments/:id/callback      - Handle payment callback
```

## Video Streaming APIs

### Video Management
```
POST   /lectures/:id/video         - Upload video
GET    /lectures/:id/video         - Get video URL
PATCH  /lectures/:id/video         - Update video metadata
```

### Video Analytics
```
POST   /lectures/:id/watch         - Mark lecture as watched
GET    /lectures/:id/analytics     - Get watching stats
```

## Assessment & Quizzes

### Quiz Management
```
POST   /lectures/:lectureId/quiz   - Create quiz
GET    /lectures/:lectureId/quiz   - Get quiz
PATCH  /lectures/:lectureId/quiz   - Update quiz
DELETE /lectures/:lectureId/quiz   - Delete quiz
```

### Quiz Attempts
```
POST   /quizzes/:quizId/attempt    - Start quiz attempt
POST   /quizzes/:quizId/submit     - Submit quiz answers
GET    /quizzes/:quizId/results    - Get quiz results
```

## Review & Rating APIs

### Reviews
```
POST   /courses/:id/reviews        - Create review
GET    /courses/:id/reviews        - List course reviews
GET    /reviews/:id                - Get review details
PATCH  /reviews/:id                - Update review
DELETE /reviews/:id                - Delete review
```

### Review Voting
```
POST   /reviews/:id/helpful        - Mark helpful
POST   /reviews/:id/report         - Report review
```

## Live Classes APIs

### Class Management
```
POST   /live-classes               - Schedule live class
GET    /live-classes               - List live classes
GET    /live-classes/:id           - Get class details
PATCH  /live-classes/:id           - Update class
DELETE /live-classes/:id           - Cancel class
```

### Class Participation
```
POST   /live-classes/:id/join      - Join live class
POST   /live-classes/:id/leave     - Leave live class
GET    /live-classes/:id/status    - Get class status
```

### Class Recording
```
GET    /live-classes/:id/recording - Get recording URL
POST   /live-classes/:id/record    - Start recording
```

## Instructor Dashboard APIs

### Course Analytics
```
GET    /instructor/courses/analytics - Get course performance
GET    /instructor/courses/:id/stats - Get course stats
GET    /instructor/students/:id/stats - Get student progress
```

### Content Management
```
GET    /instructor/courses         - List instructor courses
GET    /instructor/courses/:id     - Get course for instructor
POST   /instructor/courses/:id     - Update course (instructor only)
```

## Student Learning APIs

### Learning Progress
```
GET    /student/courses            - List enrolled courses
GET    /student/courses/:id        - Get course progress
GET    /student/lectures/:id       - Get lecture status
PATCH  /student/lectures/:id       - Mark lecture complete
```

### Course Materials
```
GET    /student/courses/:id/notes  - Get study notes
GET    /student/courses/:id/resources - Get resources
GET    /student/lectures/:id/content - Get lecture content
```

## System APIs

### Authentication
```
POST   /auth/login                 - User login
POST   /auth/register              - User registration
POST   /auth/refresh               - Refresh token
```

### User Profile
```
GET    /profile                    - Get user profile
PATCH  /profile                    - Update profile
GET    /profile/courses            - Get enrolled courses
```

## Data Models

### Course
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

### Section
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

### Lecture
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

### Enrollment
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

### Review
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