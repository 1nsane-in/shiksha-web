# Medical Admission Platform - Implementation TODO

**Last Updated:** 2026-05-14
**Status:** In Progress

---

## Project Overview

Medical Admission Management Platform with 3 user roles: Super Admin, Admin, Student

### Tech Stack
- **Frontend:** Next.js 16 + Tailwind + shadcn/ui
- **Backend:** NestJS + Prisma
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase (Email OTP + Google OAuth)
- **Payments:** Razorpay
- **Storage:** Supabase Storage

---

## Current Progress

### Phase 1: Foundation ✅ COMPLETE

#### Backend Modules Created
| Module | Status | Files |
|--------|--------|-------|
| Prisma Setup | ✅ Done | `schema.prisma`, `prisma.service.ts` |
| Auth Module | ✅ Done | Supabase integration, OTP, guards, decorators |
| Users Module | ✅ Done | Profile CRUD, admin user management |
| Students Module | ✅ Done | Stage tracking, university assignment, stats |
| Universities Module | ✅ Done | CRUD + courses management |
| Documents Module | ✅ Done | Upload, verification, document types |

#### API Endpoints Implemented
- `POST /auth/send-otp` - Send OTP to email
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/login` - Email + Password login
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `POST /auth/create-admin` - Create admin (Super Admin only)
- `GET/PUT /users/profile` - User profile
- `GET/PUT/DELETE /admin/users/*` - Admin user management
- `GET/POST/PUT/DELETE /admin/universities/*` - University management
- `GET/POST /student/documents` - Student document upload
- `GET/PUT /admin/documents/*` - Document verification
- `GET /admin/students/*` - Student management

---

## TODO: Remaining Work

### Phase 2: Payments Module
- [ ] Create Payments module structure
- [ ] Razorpay checkout integration
- [ ] Payment webhook handler
- [ ] Payment history endpoints
- [ ] Manual payment approval (admin)
- [ ] Stage unlock logic based on payment

### Phase 3: Letters Module
- [ ] Create Letters module
- [ ] Admission letter upload/view
- [ ] Invitation letter upload/view
- [ ] Download access control
- [ ] Watermarked preview generation
- [ ] Access logging

### Phase 4: Exam & Visa Module
- [ ] Exam dates management
- [ ] Exam dashboard for students
- [ ] Visa centers CRUD
- [ ] Visa checklist management
- [ ] Country-wise visa instructions

### Phase 5: Notifications & Reports
- [ ] Email notifications (payment, document status)
- [ ] In-app notifications
- [ ] Student reports
- [ ] Payment reports
- [ ] University reports
- [ ] Export to CSV/PDF

### Phase 6: Frontend Development
- [ ] Setup Next.js app structure
- [ ] Auth pages (login, register, forgot-password)
- [ ] Student dashboard
- [ ] Admin dashboard
- [ ] University management UI
- [ ] Document verification UI
- [ ] Payment integration UI

### Phase 7: Testing & Deployment
- [ ] Unit tests for services
- [ ] Integration tests for APIs
- [ ] E2E tests for critical flows
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Production deployment

---

## Database Schema Status

### Tables Created (Prisma Schema)
| Table | Status | Notes |
|-------|--------|-------|
| User | ✅ Done | email, name, role, isActive |
| Student | ✅ Done | profile, stage, status |
| University | ✅ Done | name, country, courses |
| UniversityCourse | ✅ Done | fees, duration, seats |
| UniversityApplication | ✅ Done | student-course mapping |
| DocumentType | ✅ Done | code, name, requiredForStage |
| StudentDocument | ✅ Done | upload, verification |
| Payment | ✅ Done | stage, amount, razorpay IDs |
| AdmissionLetter | ✅ Done | file, student mapping |
| InvitationLetter | ✅ Done | file, download control |
| VisaCenter | ✅ Done | visa support centers |
| VisaChecklist | ✅ Done | country-wise docs |
| AuditLog | ✅ Done | tracking changes |

### Pending Migrations
- [ ] Run `npx prisma migrate dev` after Supabase setup
- [ ] Seed default document types
- [ ] Seed default admin user

---

## Environment Setup Required

### Backend (.env)
```
DATABASE_URL=           # Supabase PostgreSQL connection string
SUPABASE_URL=           # https://xxx.supabase.co
SUPABASE_ANON_KEY=      # Public anon key
SUPABASE_SERVICE_KEY=   # Service role key (backend only)
RAZORPAY_KEY_ID=        # Razorpay credentials
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

---

## Quick Start Commands

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Run API only
pnpm --filter @repo/api dev

# Run Web only
pnpm --filter @repo/web dev

# Prisma commands
cd apps/api
npx prisma migrate dev --name init
npx prisma studio
npx prisma db seed

# Generate Prisma client
npx prisma generate
```

---

## Known Issues / Blockers

1. **Supabase not configured** - Need to create Supabase project and add credentials
2. **No Prisma migrations run** - Database tables not created yet
3. **Frontend incomplete** - Only basic Next.js setup exists
4. **No payments integration** - Razorpay not implemented

---

## Notes for Next Session

- Start with Supabase project setup
- Run Prisma migrations after DB is ready
- Add seed data for document types
- Create Payments module next
- Focus on one module at a time

---

## Commit History

| Date | Commit | Description |
|------|--------|-------------|
| 2026-05-14 | dc7e5d2 | Backend modules: auth, users, students, universities, documents |
| 2026-05-14 | Initial | Monorepo setup with pnpm + Turborepo |
