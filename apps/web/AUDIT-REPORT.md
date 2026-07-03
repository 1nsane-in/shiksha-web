# Next.js Frontend Architecture Audit Report
## Medical Admission Management Platform

**Date:** June 22, 2026  
**Auditor:** AI Architecture Review  
**Scope:** Next.js 16 + React 19 + TypeScript + TailwindCSS 4  
**File Location:** `C:\Tushar\tussxar-projects\sh-web\apps\web`

---

## Executive Summary

| Category | Score | Status |
|----------|-------|--------|
| App Router Architecture | 65/100 | ⚠️ NEEDS IMPROVEMENT |
| Performance (Core Web Vitals) | 55/100 | ⚠️ NEEDS IMPROVEMENT |
| State Management | 70/100 | ⚠️ NEEDS IMPROVEMENT |
| Component Architecture | 60/100 | ⚠️ NEEDS IMPROVEMENT |
| Styling/UI | 75/100 | ✅ ACCEPTABLE |
| Forms | 70/100 | ⚠️ NEEDS IMPROVEMENT |
| Security | 45/100 | ❌ CRITICAL |
| Testing | 30/100 | ❌ CRITICAL |
| Build/Deployment | 70/100 | ⚠️ NEEDS IMPROVEMENT |
| **Overall** | **60/100** | **⚠️ NEEDS IMPROVEMENT** |

---

## P0 - CRITICAL Issues (Immediate Action Required)

### 🔴 SEC-001: Client-Side Authentication Bypass Risk
**File:** `stores/auth-store.ts` (Lines 8-15, 40-77)

**Issue:** The authentication store uses `zustand/middleware` with `persist` that stores tokens in localStorage, which is vulnerable to XSS attacks. The token is also stored in cookies without `HttpOnly`, `Secure`, or `SameSite=Strict` flags.

**Current Code:**
```typescript
function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}
```

**Risk:** HIGH - Token theft via XSS enables session hijacking

**Fix:**
```typescript
// Remove localStorage persistence for tokens
// Use httpOnly cookies set by server only
// In stores/auth-store.ts:
export const useAuthStore = create<AuthState>()(
  // Remove persist middleware for security
  (set) => ({
    user: null,
    access_token: null,
    loading: true,
    // ... rest
  })
);
```

---

### 🔴 PERF-001: All Pages Marked as Client Components
**Files:** 50+ pages across `app/`

**Issue:** Virtually every page uses `"use client"` directive, defeating Next.js App Router's server-side rendering capabilities and significantly impacting:
- Time to First Byte (TTFB)
- Largest Contentful Paint (LCP)
- SEO indexing
- Initial bundle size

**Examples:**
- `app/(students)/student/dashboard/page.tsx` - Line 1
- `app/(admin)/admin/dashboard/page.tsx` - Missing (no dashboard file found)
- `app/(shared)/login/page.tsx` - Line 1

**Risk:** CRITICAL - Entire app is CSR, negating Next.js benefits

**Fix:** Refactor to Server Components pattern:
```typescript
// app/(students)/student/dashboard/page.tsx
// Server Component - NO "use client"
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  // Fetch data server-side
  const initialData = await fetchDashboardData();
  
  return <DashboardClient initialData={initialData} />;
}
```

---

### 🔴 PERF-002: HeroCarousel Uses `unoptimized` Images
**File:** `components/landing/HeroCarousel.tsx` (Line 102)

**Issue:** Images are loaded with `unoptimized` attribute, bypassing Next.js image optimization.

```typescript
<Image
  src={slides[current].image}
  alt=""
  fill
  priority
  unoptimized  // ❌ Bypasses optimization
  className="object-cover"
  sizes="100vw"
/>
```

**Risk:** Large unoptimized images hurt LCP and bandwidth

**Fix:** Remove `unoptimized` and add remotePatterns:
```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
}
```

---

### 🔴 TEST-001: Minimal Test Coverage
**Files:** Only 1 test file found

**Issue:** Only `domains/applications/application-mappings.test.ts` exists for a codebase with 122+ TypeScript files.

**Current:** 1 test file, 186 lines
**Expected:** Minimum 20% coverage for MNC standards

**Risk:** No regression protection, fragile codebase

**Fix:** Add test files for:
- All domain API functions
- All form validations
- All hooks (`hooks/*.ts`)
- Critical UI components

---

### 🔴 ARCH-001: Missing Root Error Boundaries
**Files:** No root `error.tsx` or `global-error.tsx`

**Issue:** Only route-specific error boundaries exist. Root-level errors will crash the app.

**Files Present:**
- `app/(students)/student/error.tsx` ✅
- `app/(admin)/admin/error.tsx` ✅

**Missing:**
- `app/error.tsx` (root error boundary)
- `app/global-error.tsx` (global error for production)

**Fix:**
```typescript
// app/error.tsx
"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

---

### 🔴 SEC-002: No Middleware for Route Protection
**File:** Missing `middleware.ts`

**Issue:** No Next.js middleware exists to protect routes. Authentication is handled client-side in components.

**Risk:** Routes are accessible without authentication; SSR pages can't check auth

**Fix:** Create `middleware.ts`:
```typescript
// middleware.ts (in root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith('/admin') && !isAdmin(token)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Protect student routes
  if (pathname.startsWith('/student') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

---

## P1 - HIGH Priority Issues

### 🟠 ARCH-002: Duplicate Form Implementations
**Files:** 
- `app/(shared)/login/page.tsx` (Lines 28-60)
- `components/auth/login-form.tsx` (Lines 17-104)

**Issue:** Two different login form implementations exist with different patterns:
- Page uses React Hook Form + Zod
- Component uses uncontrolled form with useState

**Fix:** Consolidate to single, reusable form component.

---

### 🟠 ARCH-003: Group Routes Lack Layout Boundaries
**Files:** Route groups like `(students)`, `(admin)`, `(shared)`

**Issue:** Route groups don't properly leverage layout composition. No shared loading states or error boundaries at group level.

**Fix:** Add group-level layout files with proper Suspense boundaries.

---

### 🟠 STATE-001: Zustand Store Access in Axios Interceptors
**File:** `shared/api/axios.ts` (Lines 43, 85, 93)

**Issue:** Direct Zustand store access in axios interceptors can cause hydration mismatches.

```typescript
const token = useAuthStore.getState().access_token; // Line 43
```

**Fix:** Pass token via context or use cookie-based auth.

---

### 🟠 PERF-003: No Bundle Analysis Configuration
**File:** `next.config.ts`

**Issue:** Bundle analyzer is conditionally enabled but no CI/CD integration or budget enforcement.

**Fix:** Add bundle size budgets:
```typescript
// next.config.ts
experimental: {
  bundleSizeReporting: true,
},
```

---

### 🟠 PERF-004: Missing Dynamic Imports for Heavy Components
**Files:** Components like charts, rich editors

**Issue:** Heavy components (recharts, etc.) are eagerly loaded.

**Fix:** Use dynamic imports:
```typescript
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('recharts').then(m => m.LineChart), {
  ssr: false,
  loading: () => <Skeleton height={300} />,
});
```

---

### 🟠 FORM-001: Mixed Form Patterns
**Issue:** Some forms use React Hook Form + Zod, others use manual state management.

**Files with manual state:**
- `components/auth/login-form.tsx`
- `app/(shared)/forgot-password/page.tsx`

**Files with RHF:**
- `app/(shared)/login/page.tsx`

**Fix:** Standardize on React Hook Form + Zod for all forms.

---

### 🟠 SEC-003: No Content Security Policy
**File:** Missing CSP headers

**Issue:** No CSP configuration in next.config.ts or headers.

**Risk:** XSS vulnerability

**Fix:** Add CSP:
```typescript
// next.config.ts
async headers() {
  return [{
    source: '/:path*',
    headers: [{
      key: 'Content-Security-Policy',
      value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self'; connect-src 'self' https://api.example.com;"
    }]
  }];
}
```

---

### 🟠 TEST-002: Vitest Configuration Incomplete
**File:** `vitest.config.ts`

**Issue:** Minimal configuration, no test environment, coverage, or reporter setup.

**Current:**
```typescript
export default defineConfig({
  test: {
    globals: true,
  },
});
```

**Fix:**
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
```

---

## P2 - MEDIUM Priority Issues

### 🟡 ARCH-004: No generateMetadata on Dynamic Pages
**Files:** Multiple dynamic routes

**Issue:** No `generateMetadata` functions found in dynamic pages like:
- `app/(students)/student/applications/[id]/page.tsx`
- `app/(students)/student/university/[slug]/page.tsx`

**Impact:** Poor SEO for dynamic content

**Fix:** Add metadata generation:
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const application = await fetchApplication(id);
  return {
    title: `Application ${application.universityName} | Student`,
    description: `View your application status for ${application.universityName}`,
  };
}
```

---

### 🟡 STYLE-001: Mixed CSS Pattern Usage
**File:** `app/globals.css`

**Issue:** Mixing Tailwind CSS v4 `@import "tailwindcss"` with manual CSS custom properties.

**Current:** Valid Tailwind v4 approach, but has potential conflicts between `@theme` and `:root` variables.

**Recommendation:** Audit and consolidate CSS variable usage.

---

### 🟡 PERF-005: No React 19 Features Utilized
**Issue:** Not leveraging React 19 features:
- No `use()` hook for data fetching
- No Server Actions with `useActionState`
- No `useOptimistic` for mutations

---

### 🟡 ARCH-005: Route Handler Conflicts
**Files:**
- `app/(shared)/payments/success/route.ts`
- `app/(shared)/payments/failure/route.ts`

**Issue:** Route handlers in route groups may conflict with page files.

**Check:** Ensure no `page.tsx` exists at same path.

---

### 🟡 STATE-002: Query Client Configuration
**File:** `shared/api/queryClient.ts`

**Issue:** Global query client created at module level, shared across requests.

**Fix:** Create per-request in RSC, or use singleton pattern properly:
```typescript
// lib/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { /* ... */ }
  }));
  
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

---

### 🟡 SEC-004: Missing Input Sanitization
**Issue:** No centralized input sanitization before API calls.

**Recommendation:** Add sanitization layer in API client.

---

## P3 - LOW Priority Issues

### 🟢 STYLE-002: Inline Styles in Components
**Files:** `components/landing/HeroCarousel.tsx`

**Issue:** Heavy use of inline styles instead of Tailwind classes.

**Impact:** Maintenance, caching

---

### 🟢 ARCH-006: Unused Imports
**Files:** `app/page.tsx`

**Issue:** Multiple imported components not used:
```typescript
import { UniversityProcess } from "@/components/landing/UniversityProcess";
import { UniversityCareer } from "@/components/landing/UniversityCareer";
// ... and others not rendered
```

---

### 🟢 PERF-006: Missing Priority Loading Strategy
**File:** `app/layout.tsx`

**Issue:** No `loading.tsx` at root level for initial suspense boundary.

---

### 🟢 SEC-005: Environment Variables Not Validated
**File:** `shared/api/constants.ts`

**Issue:** No validation that required env vars exist:
```typescript
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

**Fix:** Validate at build time:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('NEXT_PUBLIC_API_URL is required');
}
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

---

## Build & Deployment Analysis

### Dockerfile ✅ GOOD
**File:** `Dockerfile`

**Strengths:**
- Multi-stage build
- Non-root user (nextjs:nodejs)
- Healthcheck configured
- Standalone output
- Security updates with `apk add`

**Weaknesses:**
- No `.dockerignore` check (could bloat image)
- Missing `output: 'standalone'` in next.config.ts

---

### ESLint Configuration ⚠️ NEEDS IMPROVEMENT
**File:** `eslint.config.mjs`

**Issue:** Using basic Next.js config only. Missing:
- Security rules (eslint-plugin-security)
- Accessibility rules (eslint-plugin-jsx-a11y)
- Import order rules
- Custom project rules

**Fix:**
```javascript
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      "no-console": ["warn", { allow: ["error", "warn"] }],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]);
```

---

## Recommended Action Plan

### Phase 1: Security & Critical (Week 1)
1. [ ] Implement proper auth middleware
2. [ ] Remove localStorage token persistence
3. [ ] Add root error boundaries
4. [ ] Add CSP headers

### Phase 2: Performance & Architecture (Week 2-3)
1. [ ] Refactor pages to Server Components
2. [ ] Fix image optimization
3. [ ] Add dynamic imports for heavy components
4. [ ] Implement Suspense boundaries

### Phase 3: Testing & Quality (Week 4)
1. [ ] Add comprehensive test suite
2. [ ] Add ESLint rules
3. [ ] Add pre-commit hooks
4. [ ] Add bundle analysis CI

### Phase 4: Polish (Week 5)
1. [ ] Add metadata generation
2. [ ] Standardize form patterns
3. [ ] Code cleanup (unused imports, etc.)

---

## Key Files to Review

| File | Priority | Issue |
|------|----------|-------|
| `stores/auth-store.ts` | P0 | Security vulnerability |
| `shared/api/axios.ts` | P0 | Store access in interceptors |
| `app/**/page.tsx` | P0 | All client components |
| `components/landing/HeroCarousel.tsx` | P0 | Unoptimized images |
| `vitest.config.ts` | P0 | Minimal testing setup |
| `app/layout.tsx` | P1 | Missing root error boundary |
| `next.config.ts` | P1 | Missing security headers |
| `app/globals.css` | P2 | CSS pattern consolidation |

---

## Compliance Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| OWASP Top 10 Prevention | ❌ FAIL | No CSP, XSS vulnerable auth |
| GDPR Data Protection | ⚠️ PARTIAL | Cookie consent not implemented |
| Accessibility (WCAG 2.1) | ⚠️ PARTIAL | Missing a11y linting |
| Performance Budget | ❌ FAIL | No bundle budgets |
| Test Coverage > 20% | ❌ FAIL | <1% coverage |
| TypeScript Strict Mode | ✅ PASS | Enabled in tsconfig |
| Server-Side Rendering | ❌ FAIL | All pages client-side |
| CI/CD Security Scan | ❌ FAIL | Not configured |

---

## Conclusion

This codebase requires significant architectural improvements to meet MNC production standards. The most critical issues are:

1. **Security vulnerabilities** in authentication handling
2. **Complete absence of Server Components** despite Next.js 16 upgrade
3. **Minimal test coverage** providing no safety net
4. **Missing critical infrastructure** like middleware and error boundaries

Immediate action on P0 items is strongly recommended before production deployment.

---

*Report generated by AI Architecture Review System*
*For questions or clarifications, review with engineering leadership*
