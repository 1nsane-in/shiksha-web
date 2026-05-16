# Google OAuth Integration

This document explains how to implement and use Google OAuth for user authentication in the Medical Admission Platform API.

## Endpoints

### 1. Google Login
```
POST /auth/google-login
```

**Request Body:**
```json
{
  "accessToken": "string"
}
```

**Response:**
```json
{
  "message": "Google login successful",
  "session": {
    "access_token": "string",
    "refresh_token": "string",
    "expires_in": number,
    "token_type": "string"
  },
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "STUDENT|ADMIN|AGENT",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

### 2. Google Registration
```
POST /auth/google-register
```

**Request Body:**
```json
{
  "email": "string",
  "name": "string",
  "phone": "string",
  "googleId": "string"
}
```

**Response:**
```json
{
  "message": "Google registration successful",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "STUDENT",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  },
  "session": {
    "access_token": "string",
    "refresh_token": "string",
    "expires_in": number,
    "token_type": "string"
  }
}
```

## Implementation Details

### How It Works

1. **Frontend Flow:**
   - User clicks "Sign in with Google" button
   - Frontend redirects to Google OAuth consent screen
   - User grants permissions and receives an authorization code
   - Frontend exchanges authorization code for access token
   - Frontend sends access token to `/auth/google-login` or `/auth/google-register`

2. **Backend Flow:**
   - API validates the Google access token with Google's API
   - If user exists: signs them in and returns session
   - If user doesn't exist: returns error indicating need for registration

### Configuration Requirements

Add these environment variables to your `.env` file:
```
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Security Notes

- The Google access token is validated with Google's API in production
- All tokens are properly handled and secured
- Sessions are managed through Supabase authentication
- User data is sanitized and validated before processing

## Database Schema Consideration

For full Google OAuth support, the User model should include a `googleId` field:

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String?
  name          String
  phone         String?
  role          Role     @default(STUDENT)
  avatarUrl     String?
  isActive      Boolean  @default(true)
  emailVerified Boolean  @default(false)
  googleId      String?  @unique  // Added for Google OAuth
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  lastLoginAt   DateTime?
  lastLoginIp   String?

  student       Student?
  sessions      UserSession[]
  activityLogs  UserActivityLog[]
  notifications Notification[]
  orgMemberships OrganizationMember[]
  aiConversations AIConversation[]
  
  @@index([email])
  @@index([role])
}
```

Then run: `npx prisma migrate dev --name add_google_id_to_user`