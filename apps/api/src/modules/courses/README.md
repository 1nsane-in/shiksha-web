# Courses Module

This module implements the Courses functionality for the LMS platform, providing CRUD operations for course management along with publishing capabilities.

## Features

- Create, read, update, and delete courses
- Publish/unpublish courses
- Validation using class-validator
- Integration with Prisma ORM
- Comprehensive unit tests
- Swagger documentation

## Endpoints

### POST /courses
Create a new course

### GET /courses
Get all published courses

### GET /courses/:id
Get a specific course by ID

### PUT /courses/:id
Update a course by ID

### DELETE /courses/:id
Delete a course by ID

### POST /courses/:id/publish
Publish a course by ID

## Entities

### Course
```typescript
interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  credits: number;
  startDate: Date;
  endDate: Date;
  prerequisites: string[];
  department: string;
  instructor: string;
  maxStudents: number;
  deliveryMethod: string;
  courseTypes: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## DTOs

### CreateCourseDto
Used for creating new courses with validation.

### UpdateCourseDto
Used for updating existing courses with validation.

## Validation

- All inputs are validated using class-validator decorators
- Titles must be unique
- Required fields are enforced
- Date formats are validated
- Numeric fields are validated appropriately

## Testing

The module includes comprehensive unit tests covering:
- All CRUD operations
- Error handling scenarios
- Validation logic
- Business rules enforcement