# LMS Integration — Open Questions

Created: 2026-05-25  
Reference video: [Build A Course Platform LMS With Next.js 15, React 19, Stripe, Drizzle, Shadcn, Postgres](https://www.youtube.com/watch?v=xqoYkX4hfwg) (Web Dev Simplified)

## Context

User wants to integrate a **Learning Management System (LMS)** into the existing medical admission platform (NestJS + Next.js + Neon PostgreSQL + PayU).

The reference video uses: Next.js 15, Arcjet, Better-Auth/Clerk, Stripe, Drizzle ORM.  
Our stack: NestJS (backend), Next.js (frontend), Neon PostgreSQL (Prisma), PayU (payments).

## Pending Questions

### 1. Type of LMS Content

What kind of courses will the LMS serve?

- **A) Entrance Exam Prep Courses** — Video lessons, study materials, quizzes for NEET/MBBS entrance exams. Students pay to access.
- **B) University Orientation / Onboarding** — Required courses for admitted students (visa guidance, university rules, travel prep). Free or stage-gated.
- **C) Both** — Paid prep courses for prospects + free orientation for admitted students.

### 2. Payment Model

- **Paid courses** — Use existing PayU integration for one-time course purchases?
- **Free / stage-gated** — Unlocked when student reaches a certain application stage?
- **Subscription** — Monthly/yearly access to all course content?

### 3. Course Features Needed

- Video lessons with progress tracking?
- Quizzes / assessments?
- Downloadable study materials (PDFs)?
- Certificate of completion?
- Course categories / search / filtering?

### 4. User Roles

- **Students** — Browse and take courses
- **Admins** — Create and manage courses, upload lessons
- **Teachers / Content Creators** — Separate role for instructors?

### 5. Content Delivery

- Self-hosted video (upload MP4 to R2/S3)?
- YouTube/Vimeo embedded?
- External video provider (Vimeo, Mux, etc.)?

## Next Steps

1. Answer the above questions to define scope
2. Design architecture (NestJS backend modules + Prisma models)
3. Implement backend (courses, lessons, enrollments, progress)
4. Implement frontend pages (course catalog, lesson player, admin course manager)

## Build Status (Current Project)

- **Backend:** `npx nest build` ✅
- **Frontend:** `npx next build` ✅ (29 routes)
- **Runtime:** `pnpm start:prod` ✅
