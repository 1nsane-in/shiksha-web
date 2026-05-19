# Auth API — Mobile Integration Guide

Base URL: `https://medical-admission-platform-web.onrender.com/api`  
All endpoints: append `?mobile=true` to return `refreshToken` in response body  
Auth header: `Authorization: Bearer <accessToken>`  
Swagger UI: `GET /api/docs`

---

## 1. Registration Flow (OTP-based)

Roles: `STUDENT`, `PARENT`

```
Step 1          Step 2          Step 3           Done
Send OTP  ───▶  Verify OTP ───▶ Set Password ───▶ Logged In
```

### Step 1 — Send OTP

`POST /auth/send-otp`

```json
{
  "email": "john@example.com",
  "name": "John Doe"
}
```

**200:**
```json
{
  "message": "OTP sent to your email",
  "devOtp": "123456"
}
```
> `devOtp` returned only in development mode.

**Errors:**
| Status | Scenario |
|---|---|
| 400 | Email already registered |
| 400 | Invalid email format |
| 400 | Failed to send OTP email |

---

### Step 2 — Verify OTP

`POST /auth/verify-otp`

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**200:**
```json
{
  "message": "OTP verified successfully",
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```
> Save this `token` — required in Step 3.

**Errors:**
| Status | Scenario |
|---|---|
| 400 | Invalid or expired OTP |

---

### Step 3 — Complete Registration

`POST /auth/complete-registration?mobile=true`

```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "password": "securePass123",
  "confirmPassword": "securePass123",
  "role": "STUDENT"
}
```

| Field | Values |
|---|---|
| `role` | `"STUDENT"` or `"PARENT"` |
| `confirmPassword` | Must match `password` |

**200:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "STUDENT",
    "isActive": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "uuid-refresh-token"
}
```

**Errors:**
| Status | Scenario |
|---|---|
| 400 | Invalid or expired registration token |
| 400 | Email already registered |

---

## 2. Login

### Email/Password

`POST /auth/login?mobile=true`

```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```

**200:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "STUDENT",
    "isActive": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "uuid-refresh-token"
}
```

**Errors:**
| Status | Scenario |
|---|---|
| 401 | Invalid credentials |
| 401 | Account deactivated |

---

### Google OAuth Login

`POST /auth/google-login?mobile=true`

```json
{
  "accessToken": "google-id-token-or-access-token"
}
```

Endpoint handles: ID token (JWT), access token, or authorization code.  
Auto-registers user with `STUDENT` role if they don't exist.

**200:** Same shape as email login.

**Errors:**
| Status | Scenario |
|---|---|
| 401 | Invalid Google token |

---

### Google OAuth Register (Explicit)

`POST /auth/google-register?mobile=true`

```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "googleId": "google-sub-id",
  "accessToken": "google-id-token"
}
```

> User must NOT already exist.

**Errors:**
| Status | Scenario |
|---|---|
| 400 | User already registered with this email |

---

## 3. Token Refresh

Call when API returns 401.

`POST /auth/refresh?mobile=true`

```json
{
  "refreshToken": "uuid-refresh-token"
}
```

**200:**
```json
{
  "message": "Tokens refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "new-uuid-refresh-token"
}
```

> Old refresh token is **rotated** — always replace both stored tokens.

**Errors:**
| Status | Scenario |
|---|---|
| 401 | No refresh token provided |
| 401 | Invalid or expired refresh token |
| 401 | Account deactivated |

---

## 4. Logout

`POST /auth/logout?mobile=true`

```json
{
  "refreshToken": "uuid-refresh-token"
}
```

**200:**
```json
{
  "message": "Logged out successfully"
}
```

> Deletes session from server. Discard stored tokens on the device after success.

---

## 5. Forgot Password

```
Step 1          Step 2          Step 3           Done
Enter Email ───▶ Verify OTP ───▶ New Password ───▶ Login
```

### Step 1 — Request Reset

`POST /auth/forgot-password`

```json
{
  "email": "john@example.com"
}
```

**200:**
```json
{
  "message": "Password reset OTP sent to your email",
  "devOtp": "123456"
}
```

**Errors:**
| Status | Scenario |
|---|---|
| 400 | No account found with this email |
| 400 | Failed to send OTP email |

---

### Step 2 — Verify OTP

Same endpoint as registration.

`POST /auth/verify-otp`

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**200:**
```json
{
  "message": "OTP verified successfully",
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

> Save this `token` for Step 3.

**Errors:**
| Status | Scenario |
|---|---|
| 400 | Invalid or expired OTP |

---

### Step 3 — Reset Password

`POST /auth/reset-password`

```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "password": "newSecurePass123"
}
```

**200:**
```json
{
  "message": "Password reset successful"
}
```

**Errors:**
| Status | Scenario |
|---|---|
| 400 | Invalid or expired reset token |

---

## 6. Get Current User

`GET /auth/me`

**Header:** `Authorization: Bearer <accessToken>`

**200:**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "STUDENT",
  "isActive": true
}
```

**Errors:**
| Status | Scenario |
|---|---|
| 401 | Missing or invalid JWT |
| 404 | User not found |

---



## 7. Token & Storage Reference

| Token | Type | Expiry | Mobile Storage |
|---|---|---|---|
| `accessToken` | JWT | Configurable | Secure device storage (Keychain/Keystore) |
| `refreshToken` | UUID (random) | 7 days | Secure device storage |

### Endpoints requiring `?mobile=true`

| Endpoint | Why |
|---|---|
| `complete-registration` | Returns `refreshToken` in body |
| `login` | Returns `refreshToken` in body |
| `google-login` | Returns `refreshToken` in body |
| `google-register` | Returns `refreshToken` in body |
| `refresh` | Reads + returns `refreshToken` in body |
| `logout` | Reads `refreshToken` from body |

### Auth header pattern for all authenticated requests

```
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Token refresh flow

```
401 on any API call
       │
       ▼
POST /auth/refresh?mobile=true
{ "refreshToken": "..." }
       │
       ├── 200 → Replace stored accessToken + refreshToken → Retry original request
       └── 401 → Clear stored tokens → Show login screen
```
