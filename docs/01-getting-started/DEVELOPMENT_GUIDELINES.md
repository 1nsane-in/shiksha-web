# LMS Platform Development Guidelines

## 1. Overview

This document provides comprehensive development guidelines for the Medical Admission Management Platform to ensure consistent code quality, maintainability, and adherence to the project's architecture and standards.

## 2. Code Structure and Organization

### 2.1 Project Structure

```
/apps
  /api                 # NestJS main backend
    /src
      /modules         # Feature modules
        /auth
        /users
        /students
        /applications
        /documents
        /payments
        /universities
        /letters
        /visa-support
        /ai
        /admin
      /common          # Shared components
      /prisma          # Database schema and migrations
      /config          # Configuration files
  /web                 # Next.js frontend
    /src
      /app             # Application pages and routes
      /components      # Reusable UI components
      /hooks           # Custom React hooks
      /lib             # Utility functions
      /services        # API service layer
      /types           # TypeScript types
      /styles          # CSS and styling files

/packages
  /shared-types        # Shared TypeScript types
  /ui                  # Shared UI components
  /config              # Shared configuration files

/docs                 # Documentation files
```

### 2.2 Module Organization

Each NestJS module follows a consistent structure:

```
/modules/users/
  /controllers/
    users.controller.ts
    admin.users.controller.ts
  /services/
    users.service.ts
  /dtos/
    create-user.dto.ts
    update-user.dto.ts
  /entities/
    user.entity.ts
  /guards/
    roles.guard.ts
  /interfaces/
    user.interface.ts
  /module.ts
```

### 2.3 Frontend Component Structure

```
/components/ui/
  /button/
    button.tsx
    button.stories.tsx
    button.test.tsx
  /input/
    input.tsx
    input.test.tsx
  /card/
    card.tsx
    card.test.tsx
```

## 3. Coding Standards

### 3.1 TypeScript Standards

#### General Guidelines
- Use strict TypeScript mode
- Avoid `any` type unless absolutely necessary
- Use interfaces for object shapes
- Prefer type inference over explicit typing where possible
- Use meaningful variable and function names

#### Example Code
```typescript
// Good: Type-safe and readable
interface CreateUserDto {
  email: string;
  password: string;
  role: 'student' | 'admin' | 'university';
  firstName: string;
  lastName: string;
}

async function createUser(userData: CreateUserDto): Promise<User> {
  // Implementation
  return user;
}

// Bad: Not type-safe
async function createUser(userData): Promise<any> {
  // Implementation
  return user;
}
```

### 3.2 NestJS Best Practices

#### Controller Guidelines
- Controllers should only handle HTTP requests and responses
- Validation should be done through DTOs
- Business logic should be delegated to services
- Error handling should be centralized

#### Service Guidelines
- Services should contain all business logic
- Use dependency injection for services
- Implement proper error handling
- Use transactions where necessary

#### Example Controller
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return await this.usersService.update(id, updateUserDto);
  }
}
```

#### Example Service
```typescript
@Service()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async findOne(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true }
    });
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: userData
      });
      
      return user;
    } catch (error) {
      throw new BadRequestException('Failed to update user');
    }
  }
}
```

### 3.3 Frontend Development Standards

#### React Component Guidelines
- Use functional components with hooks
- Implement proper prop validation
- Use TypeScript interfaces for props
- Follow component composition patterns
- Implement proper error boundaries

#### Example React Component
```tsx
import React, { useState, useEffect } from 'react';
import { User } from '@/types/user';

interface UserProfileProps {
  userId: string;
  onProfileUpdated?: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onProfileUpdated }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const userData = await apiClient.get<User>(`/users/${userId}`);
      setUser(userData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Handle error
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h2>{user?.firstName} {user?.lastName}</h2>
      <p>{user?.email}</p>
    </div>
  );
};

export default UserProfile;
```

## 4. API Design Guidelines

### 4.1 RESTful Principles

#### Resource Naming
- Use plural nouns for resource names
- Use hyphens for multi-word resource names
- Keep URLs clean and intuitive

```http
GET /api/users
GET /api/users/123
POST /api/users
PUT /api/users/123
DELETE /api/users/123
```

#### HTTP Status Codes
- 200: Successful GET, PUT, PATCH, DELETE
- 201: Successful POST
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Unprocessable Entity
- 429: Too Many Requests
- 500: Internal Server Error

### 4.2 Error Handling

#### Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The email field is required.",
    "details": [
      {
        "field": "email",
        "message": "The email field is required."
      }
    ]
  }
}
```

#### Error Handling Strategy
```typescript
// Global exception filter
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message
    });
  }
}
```

## 5. Database Guidelines

### 5.1 Prisma ORM Usage

#### Model Definition
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password_hash String
  role          String
  first_name    String?
  last_name     String?
  is_active     Boolean   @default(true)
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt
}
```

#### Query Patterns
```typescript
// Find one user
const user = await prisma.user.findUnique({
  where: { id: userId }
});

// Find many users with pagination
const users = await prisma.user.findMany({
  where: { role: 'student' },
  take: 20,
  skip: 0,
  orderBy: { created_at: 'desc' }
});

// Update user
await prisma.user.update({
  where: { id: userId },
  data: { last_login: new Date() }
});
```

### 5.2 Database Migration Strategy

#### Migration Best Practices
- Always create backups before migrations
- Test migrations in staging environment
- Use transactions for complex operations
- Keep migrations atomic and reversible

```bash
# Generate new migration
npx prisma migrate dev --name init

# Apply migration to production
npx prisma migrate deploy
```

## 6. Security Guidelines

### 6.1 Authentication Implementation

#### JWT Token Management
```typescript
// JWT configuration
const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_ACCESS_SECRET,
  signOptions: {
    expiresIn: '15m'
  }
};

// Refresh token configuration
const refreshTokenConfig: JwtModuleOptions = {
  secret: process.env.JWT_REFRESH_SECRET,
  signOptions: {
    expiresIn: '7d'
  }
};
```

### 6.2 Input Validation

#### DTO Validation
```typescript
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
```

## 7. Testing Guidelines

### 7.1 Unit Test Structure

#### Test File Naming
```
users.service.spec.ts
users.controller.spec.ts
user.entity.spec.ts
```

#### Test Organization
```typescript
describe('UsersService', () => {
  let service: UsersService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findOne', () => {
    it('should return a user when user exists', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### 7.2 E2E Test Structure

#### Test Organization
```typescript
describe('User Management (E2E)', () => {
  let app: INestApplication;
  let agent: SuperAgentTest;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    agent = supertest(app.getHttpServer());
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        role: 'student',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await agent
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('email', userData.email);
      expect(response.body).toHaveProperty('role', userData.role);
    });
  });
});
```

## 8. Performance Guidelines

### 8.1 Query Optimization

#### Efficient Database Queries
```typescript
// Good: Efficient query with proper includes
const userWithApplications = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    applications: {
      include: {
        university: true,
        course: true
      }
    }
  }
});

// Bad: N+1 query problem
const user = await prisma.user.findUnique({ where: { id: userId } });
const applications = await prisma.application.findMany({
  where: { studentId: user.id }
});
```

### 8.2 Caching Strategy

#### Redis Caching Implementation
```typescript
// Cache decorator for service methods
export function Cacheable(ttl: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }
      
      const result = await originalMethod.apply(this, args);
      await redis.setex(cacheKey, ttl, JSON.stringify(result));
      
      return result;
    };
  };
}
```

## 9. Documentation Standards

### 9.1 Code Documentation

#### JSDoc Comments
```typescript
/**
 * Creates a new user account
 * @param userData - The user data to create
 * @returns The created user object
 * @throws BadRequestException if user already exists
 */
async createUser(userData: CreateUserDto): Promise<User> {
  // Implementation
}
```

#### API Documentation
```typescript
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
```

## 10. Environment and Deployment

### 10.1 Environment Configuration

#### Environment Files
```bash
# .env.development
DATABASE_URL=postgresql://user:pass@localhost:5432/dev_db
JWT_ACCESS_SECRET=dev_secret
JWT_REFRESH_SECRET=dev_refresh_secret

# .env.production
DATABASE_URL=${DATABASE_URL}
JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
```

### 10.2 Build Process

#### Build Scripts
```json
{
  "scripts": {
    "build": "npm run build:api && npm run build:web",
    "build:api": "nest build api",
    "build:web": "cd apps/web && npm run build",
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:web\"",
    "dev:api": "nest start api --watch",
    "dev:web": "cd apps/web && npm run dev"
  }
}
```

## 11. Code Review Guidelines

### 11.1 Review Checklist

- [ ] Code follows project standards and conventions
- [ ] All tests pass
- [ ] Security best practices implemented
- [ ] Performance considerations addressed
- [ ] Documentation is adequate
- [ ] Error handling is comprehensive
- [ ] Code is maintainable and readable

### 11.2 Pull Request Requirements

- [ ] All tests pass
- [ ] Code coverage maintained or improved
- [ ] Documentation updated
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Peer review completed

This comprehensive development guidelines document ensures consistent, high-quality code development throughout the Medical Admission Management Platform project.