# Authentication Implementation

This module implements the authentication system for the Medical Admission Platform API, including both traditional email/password authentication and Google OAuth support.

## Modules

### Auth Module (`/src/auth`)
Contains all authentication-related functionality:
- User registration and login
- OTP-based authentication
- Password reset functionality
- Google OAuth integration
- Role-based access control
- Session management

## Features

### 1. Traditional Authentication
- Email/password login
- OTP-based authentication
- Password reset flow
- User registration

### 2. Google OAuth Integration
- Google login endpoint (`/auth/google-login`)
- Google registration endpoint (`/auth/google-register`)
- Token verification with Google API
- Seamless integration with existing user accounts

### 3. Security Features
- JWT-based session management
- Role-based access control
- Password hashing
- Secure token handling
- Input validation

## Environment Variables

Required environment variables in `.env`:
```
SUPABASE_URL="your-supabase-url"
SUPABASE_SERVICE_KEY="your-supabase-service-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FRONTEND_URL="http://localhost:3000"
```

## API Endpoints

### Authentication
- `POST /auth/send-otp` - Send OTP to email
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `POST /auth/google-login` - Login with Google
- `POST /auth/google-register` - Register with Google
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password
- `POST /auth/create-admin` - Create admin user (super admin only)

## Implementation Details

The authentication system leverages:
- **Supabase Auth** for session management and authentication
- **Prisma ORM** for database operations
- **Class Validator** for input validation
- **JWT** for secure session handling
- **Role-based access control** for different user types

## Google OAuth Setup

To enable Google OAuth:
1. Create a Google Cloud Project
2. Enable the Google+ API
3. Create OAuth 2.0 credentials
4. Add client ID and secret to environment variables
5. Configure authorized redirect URIs in Google Console

## Future Enhancements

- Support for additional OAuth providers (Facebook, LinkedIn)
- Two-factor authentication
- Social login with custom user metadata
- Enhanced session management with refresh tokens
- Account linking between authentication methods