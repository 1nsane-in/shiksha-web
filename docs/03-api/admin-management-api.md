# Admin Management API Documentation

## Overview

Complete CRUD API for managing admin users. Only SUPER_ADMIN can manage other admins.

---

## Authentication

All endpoints require JWT token:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get All Admins

**GET** `/admin/admins`

**Access:** SUPER_ADMIN only

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (ADMIN, SUPER_ADMIN)
- `isActive` (optional): Filter by status (true, false)
- `search` (optional): Search by name or email

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "admin@example.com",
      "name": "Admin Name",
      "phone": "+1234567890",
      "role": "ADMIN",
      "isActive": true,
      "emailVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 2. Get Statistics

**GET** `/admin/admins/statistics`

**Access:** SUPER_ADMIN only

**Response:**
```json
{
  "total": 10,
  "active": 8,
  "inactive": 2,
  "admins": 7,
  "superAdmins": 3,
  "recentlyAdded": 2
}
```

---

### 3. Get Single Admin

**GET** `/admin/admins/:id`

**Access:** SUPER_ADMIN only

**Response:**
```json
{
  "id": "uuid",
  "email": "admin@example.com",
  "name": "Admin Name",
  "phone": "+1234567890",
  "role": "ADMIN",
  "isActive": true,
  "emailVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "lastLoginAt": "2024-01-01T00:00:00.000Z",
  "lastLoginIp": "192.168.1.1"
}
```

---

### 4. Create Admin

**POST** `/admin/admins`

**Access:** SUPER_ADMIN only

**Request Body:**
```json
{
  "email": "newadmin@example.com",
  "password": "SecurePassword123!",
  "name": "New Admin",
  "phone": "+1234567890",
  "role": "ADMIN"
}
```

**Validation:**
- `email`: Valid email format, unique
- `password`: Minimum 8 characters
- `name`: Required
- `phone`: Optional
- `role`: ADMIN or SUPER_ADMIN

**Response:**
```json
{
  "message": "Admin created successfully",
  "admin": {
    "id": "uuid",
    "email": "newadmin@example.com",
    "name": "New Admin",
    "phone": "+1234567890",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Update Admin

**PUT** `/admin/admins/:id`

**Access:** SUPER_ADMIN only

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+9876543210",
  "role": "SUPER_ADMIN",
  "isActive": true
}
```

All fields are optional.

**Response:**
```json
{
  "message": "Admin updated successfully",
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Updated Name",
    "phone": "+9876543210",
    "role": "SUPER_ADMIN",
    "isActive": true,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6. Delete Admin

**DELETE** `/admin/admins/:id`

**Access:** SUPER_ADMIN only

**Note:** Cannot delete your own account. Performs soft delete (sets isActive to false).

**Response:**
```json
{
  "message": "Admin deleted successfully",
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin Name",
    "isActive": false
  }
}
```

---

### 7. Toggle Admin Status

**PATCH** `/admin/admins/:id/toggle-status`

**Access:** SUPER_ADMIN only

**Note:** Cannot change your own status.

**Response:**
```json
{
  "message": "Admin activated successfully",
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin Name",
    "isActive": true
  }
}
```

---

### 8. Change Own Password

**POST** `/admin/admins/change-password`

**Access:** ADMIN or SUPER_ADMIN

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Validation:**
- Both passwords minimum 8 characters
- Current password must be correct

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

---

### 9. Reset Admin Password

**POST** `/admin/admins/:id/reset-password`

**Access:** SUPER_ADMIN only

**Request Body:**
```json
{
  "newPassword": "NewPassword123!"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

---

### 10. Get Activity Logs

**GET** `/admin/admins/:id/activity-logs`

**Access:** SUPER_ADMIN only

**Query Parameters:**
- `limit` (optional): Number of logs (default: 20)

**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "action": "LOGIN",
    "entityType": "USER",
    "entityId": "uuid",
    "metadata": {},
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Login Endpoint

**POST** `/auth/login`

**Public endpoint** (no authentication required)

**Request Body:**
```json
{
  "email": "admin@shiksha.com",
  "password": "Admin@123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "admin@shiksha.com",
    "name": "Super Admin",
    "role": "SUPER_ADMIN",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/admin/admins"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/admin/admins"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/admin/admins"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Admin not found",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/admin/admins/uuid"
}
```

---

## Default Super Admin

After running the seed script, a default super admin is created:

**Email:** `admin@shiksha.com`  
**Password:** `Admin@123456`

⚠️ **IMPORTANT:** Change this password immediately after first login!

---

## Setup Instructions

### 1. Create Super Admin

```bash
cd apps/api
npm run seed:admin
```

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shiksha.com",
    "password": "Admin@123456"
  }'
```

### 3. Use Token

Copy the token from login response and use it in subsequent requests:

```bash
curl -X GET http://localhost:3000/admin/admins \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Security Notes

1. **Password Requirements:**
   - Minimum 8 characters
   - Hashed with bcrypt (10 rounds)

2. **Role Hierarchy:**
   - SUPER_ADMIN: Full access to all admin operations
   - ADMIN: Can access admin panel but cannot manage other admins

3. **Self-Protection:**
   - Cannot delete own account
   - Cannot change own status
   - Must use change-password endpoint for own password

4. **Soft Delete:**
   - Admins are deactivated, not deleted
   - Can be reactivated by toggling status

---

## Example Workflow

### Create New Admin

```bash
# 1. Login as super admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shiksha.com",
    "password": "Admin@123456"
  }'

# 2. Create new admin
curl -X POST http://localhost:3000/admin/admins \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "password": "SecurePass123!",
    "name": "New Admin",
    "role": "ADMIN"
  }'

# 3. New admin can now login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "password": "SecurePass123!"
  }'
```

---

## Environment Variables

Optional customization for super admin creation:

```env
SUPER_ADMIN_EMAIL=admin@shiksha.com
SUPER_ADMIN_PASSWORD=Admin@123456
SUPER_ADMIN_NAME=Super Admin
```

---

## Testing

### Get All Admins
```bash
curl http://localhost:3000/admin/admins?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search Admins
```bash
curl "http://localhost:3000/admin/admins?search=john" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Filter by Role
```bash
curl "http://localhost:3000/admin/admins?role=ADMIN" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Statistics
```bash
curl http://localhost:3000/admin/admins/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Last Updated:** 2024  
**Version:** 1.0.0
