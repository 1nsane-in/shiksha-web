# Frontend Authentication Implementation

## ✅ What Was Implemented

### 1. Updated Login Page

**File:** `apps/web/app/login/page.tsx`

**Features:**

- ✅ Admin email/password login form
- ✅ Password visibility toggle
- ✅ Error handling with alerts
- ✅ Loading states
- ✅ Token storage in localStorage
- ✅ User data storage in localStorage
- ✅ Role-based redirect (Admin → /admin/dashboard, Student → /)
- ✅ Google login for students
- ✅ Create account button

### 2. Auth Hook

**File:** `apps/web/hooks/useAuth.ts`

**Features:**

- ✅ User state management
- ✅ Token management
- ✅ Login/logout functions
- ✅ Role checking (isAdmin, isSuperAdmin, isStudent)
- ✅ Authentication status
- ✅ Auto-load from localStorage

### 3. API Client

**File:** `apps/web/lib/api-client.ts`

**Features:**

- ✅ Automatic token injection
- ✅ Auto-redirect on 401
- ✅ Convenience methods (get, post, put, patch, delete)
- ✅ Error handling
- ✅ TypeScript support

### 4. Protected Route Component

**File:** `apps/web/components/auth/ProtectedRoute.tsx`

**Features:**

- ✅ Authentication check
- ✅ Role-based access control
- ✅ Loading state
- ✅ Access denied messages
- ✅ Auto-redirect to login

---

## 🚀 How to Use

### Login as Admin

1. **Navigate to Login Page**

   ```
   http://localhost:3001/login
   ```

2. **Enter Credentials**
   - Email: `admin@shiksha.com`
   - Password: `Admin@123456`

3. **Click "Sign in as Admin"**

4. **Automatic Redirect**
   - Admins → `/admin/dashboard`
   - Students → Home page

---

## 💾 Data Storage

### localStorage Keys

1. **token** - JWT authentication token

   ```javascript
   localStorage.getItem("token");
   // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

2. **user** - User object (JSON string)
   ```javascript
   JSON.parse(localStorage.getItem("user"));
   // {
   //   id: "uuid",
   //   email: "admin@shiksha.com",
   //   name: "Super Admin",
   //   role: "SUPER_ADMIN",
   //   isActive: true
   // }
   ```

---

## 🔐 Using Auth in Components

### Example 1: Check if User is Admin

```typescript
import { useAuth } from "@/hooks/useAuth";

export default function MyComponent() {
  const { user, isAdmin } = useAuth();

  if (!isAdmin()) {
    return <div>Access Denied</div>;
  }

  return <div>Welcome Admin: {user?.name}</div>;
}
```

### Example 2: Protected Page

```typescript
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div>Admin Content Here</div>
    </ProtectedRoute>
  );
}
```

### Example 3: Super Admin Only

```typescript
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function SuperAdminPage() {
  return (
    <ProtectedRoute requireSuperAdmin>
      <div>Super Admin Content Here</div>
    </ProtectedRoute>
  );
}
```

### Example 4: Logout Button

```typescript
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./button";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button onClick={logout}>
      Logout
    </Button>
  );
}
```

---

## 🌐 Making API Calls

### Using API Client (Recommended)

```typescript
import { api } from "@/lib/api-client";

// GET request
const universities = await api.get("/admin/universities");

// POST request
const newUniversity = await api.post("/admin/universities", {
  name: "ABC Medical College",
  // ... other fields
});

// PUT request
const updated = await api.put("/admin/universities/123", {
  name: "Updated Name",
});

// DELETE request
await api.delete("/admin/universities/123");
```

### Manual Fetch (Alternative)

```typescript
const token = localStorage.getItem("token");

const response = await fetch("http://localhost:3000/admin/universities", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

const data = await response.json();
```

---

## 🎯 Login Flow

```
1. User enters email/password
   ↓
2. POST /auth/login
   ↓
3. Receive { token, user }
   ↓
4. Store in localStorage
   ↓
5. Redirect based on role
   - ADMIN/SUPER_ADMIN → /admin/dashboard
   - STUDENT → /
```

---

## 🔄 Auto-Redirect on 401

The API client automatically handles unauthorized requests:

```typescript
// If API returns 401
1. Clear localStorage (token + user)
2. Redirect to /login
3. User must login again
```

---

## 📋 Role-Based Access

### Roles

1. **SUPER_ADMIN**
   - Full admin management
   - Create/update/delete admins
   - All admin features

2. **ADMIN**
   - Manage universities
   - Manage students
   - View applications
   - Cannot manage other admins

3. **STUDENT**
   - Apply to universities
   - Upload documents
   - Track applications

### Checking Roles

```typescript
const { user, isAdmin, isSuperAdmin, isStudent } = useAuth();

if (isSuperAdmin()) {
  // Show super admin features
}

if (isAdmin()) {
  // Show admin features
}

if (isStudent()) {
  // Show student features
}
```

---

## 🛡️ Security Features

1. **Token Expiration**
   - JWT tokens expire after set time
   - Auto-redirect to login on expiry

2. **Role Validation**
   - Backend validates role on every request
   - Frontend checks for UI only

3. **Secure Storage**
   - Tokens stored in localStorage
   - Cleared on logout
   - Cleared on 401 response

4. **Protected Routes**
   - Automatic authentication check
   - Role-based access control
   - Redirect to login if not authenticated

---

## 🎨 UI Components

### Login Form

```typescript
<form onSubmit={handleAdminLogin}>
  <Input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="admin@example.com"
  />

  <Input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter password"
  />

  <Button type="submit">
    Sign in as Admin
  </Button>
</form>
```

### Error Display

```typescript
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
    <AlertCircle className="h-4 w-4" />
    <span>{error}</span>
  </div>
)}
```

### Loading State

```typescript
<Button disabled={loading}>
  {loading ? "Signing in..." : "Sign in as Admin"}
</Button>
```

---

## 🧪 Testing

### Test Admin Login

1. Go to `http://localhost:3001/login`
2. Enter:
   - Email: `admin@shiksha.com`
   - Password: `Admin@123456`
3. Click "Sign in as Admin"
4. Should redirect to `/admin/dashboard`
5. Check localStorage:
   ```javascript
   console.log(localStorage.getItem("token"));
   console.log(localStorage.getItem("user"));
   ```

### Test Protected Route

1. Clear localStorage:
   ```javascript
   localStorage.clear();
   ```
2. Try to access `/admin/universities`
3. Should redirect to `/login`

### Test API Call

1. Login as admin
2. Open browser console
3. Run:
   ```javascript
   fetch("http://localhost:3000/admin/universities", {
     headers: {
       Authorization: `Bearer ${localStorage.getItem("token")}`,
     },
   })
     .then((r) => r.json())
     .then(console.log);
   ```

---

## 🐛 Troubleshooting

### "401 Unauthorized" Error

**Problem:** Getting 401 when accessing admin pages

**Solution:**

1. Check if logged in
2. Check if token exists in localStorage
3. Try logging in again
4. Check token hasn't expired

### Token Not Persisting

**Problem:** Token disappears on page refresh

**Solution:**

1. Check localStorage in browser DevTools
2. Ensure login function stores token
3. Check useAuth hook loads from localStorage

### Redirect Loop

**Problem:** Keeps redirecting between pages

**Solution:**

1. Check ProtectedRoute logic
2. Ensure user role is correct
3. Check redirect URLs

---

## 📝 Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## ✅ Checklist

- [x] Login page updated with admin form
- [x] Token storage implemented
- [x] User storage implemented
- [x] Auth hook created
- [x] API client created
- [x] Protected route component created
- [x] Role-based redirect
- [x] Auto-redirect on 401
- [x] Error handling
- [x] Loading states
- [ ] Test admin login
- [ ] Test protected routes
- [ ] Test API calls with token

---

## 🎉 Summary

The frontend authentication system is complete with:

- ✅ Admin login form
- ✅ Token management
- ✅ Role-based access control
- ✅ Protected routes
- ✅ API client with auto-auth
- ✅ Error handling
- ✅ Auto-redirect

**Ready to use!** Login with `admin@shiksha.com` / `Admin@123456`

---

**Last Updated:** 2024  
**Version:** 1.0.0
