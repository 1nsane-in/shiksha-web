# V1 — Pending Work

Last updated: 2026-06-04

## ✅ Completed

| Module | Backend | Frontend Pages | Domain Module |
|--------|---------|---------------|---------------|
| Auth (OTP, JWT, Google OAuth) | ✅ | ✅ | ✅ |
| User / Student Profile | ✅ | ✅ | ✅ |
| Student Management (Admin) | ✅ | ✅ | ✅ |
| Application Stages (1-5 unlock) | ✅ | ✅ | ✅ |
| Document Upload & Verification | ✅ | ✅ | ✅ |
| Payments (PayU) | ✅ | ✅ | ✅ |
| Admission Letters | ✅ | ✅ | ✅ |
| Invitation Letters | ✅ | ✅ | ✅ |
| Entrance Exams | ✅ | ✅ | ✅ |
| Visa Support | ✅ | ✅ | ✅ |
| University Management | ✅ | ✅ | ✅ |
| Support Tickets | ✅ | ✅ | ✅ |
| Timeline / Activity Log | ✅ | ✅ | ✅ |

## ❌ Agent & Commission (REMOVED from V1 scope)

The Agent role, Agent model, Commission model, and all related backend/frontend have been removed from V1 scope entirely. No implementation needed.

## 🔴 Not Started

### 1. Reports Dashboard
- **What:** Admin reports page showing student counts, revenue, stage funnel, etc.
- **Backend:** `AnalyticsService` and `MetricsService` already exist in CommonModule
- **Frontend page:** Missing
- **Frontend domain:** Missing (`domains/reports/`)

### 2. AI Module (NestJS)
- **What:** AI assistant for admins using Vercel AI SDK + OpenRouter (Amazon Nova Lite)
- **Database:** Models exist (`AIJob`, `AIConversation`, `AIExtractedField`, `AIFlag`, etc.)
- **Backend service/controller:** Missing
- **Frontend:** Not needed in V1 (admin-only tool)

### 3. Notifications UI
- **What:** Frontend page for notification history and preferences
- **Backend:** `NotificationService` + `DeviceTokenModule` exist (FCM push)
- **Frontend page:** Missing
- **Frontend domain:** Missing (`domains/notifications/`)

### 4. Settings Page
- **What:** Admin page to manage system-wide settings
- **Database:** `SystemSetting` model exists
- **Backend module:** Missing
- **Frontend page:** Missing

### 5. Parent Dashboard
- **What:** Dashboard for parent users to track their child's admission
- **Backend:** `Parent` model exists
- **Frontend:** Only stub pages (layout, loading, not-found)

## Build Status
- **Backend:** `npx nest build` — ✅ Passes
- **Frontend:** `npx next build` — ✅ Passes (29 routes)
- **Runtime:** `pnpm start:prod` — ✅ Runs (fixed missing `multer` dependency)
