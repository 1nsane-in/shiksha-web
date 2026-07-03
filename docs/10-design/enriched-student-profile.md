# Mega Plan: Enriched MBBS Student Profile Page

> **Design Doc** — Medical Admission Management Platform
> **Date**: 2026-05-28
> **Status**: Draft

---

## 1. Goal

Transform the current student dashboard (which is purely an admission progress tracker) into a **rich, consolidated MBBS student profile page** that shows a student everything relevant to their medical admission journey in one place:

- Personal & academic information
- Application & university details
- Document upload & verification status
- Payment history & status
- Admission & invitation letter availability
- Stage progression & action items
- Recent activity timeline

No page reloads or navigations needed to see basic profile data — it's all on one screen.

---

## 2. Success Criteria

| Criteria | How we measure |
|---|---|
| All student data visible without leaving profile page | 7 new sections render below existing timeline + actions |
| "MBBS-relevant" data shown first | Academics (NEET, 12th%) and docs appear above generic fields |
| No API errors for empty/missing data | Every nullable field has graceful null fallback (—, "Not provided", hidden section) |
| Zero layout shift during loading | Skeleton placeholders for every new section card |
| Backend response time < 200ms | Only one new include added to existing query |
| No breaking changes | StudentProfile type adds only optional fields; existing consumers unchanged |

---

## 3. Assumptions

- `GET /student/profile` is the single source of truth for student data (user, student, documents, payments, applications)
- Timeline events still come from `GET /timeline/my`
- Stage info still comes from `GET /student/stage` (auto-refetch every 30s for live status)
- Admin profile view is out of scope (already handled via `GET /admin/students/:id` + `GET /admin/applications/:id`)
- No new Prisma migrations needed — all required fields already exist in the Student model
- The existing color palette (#2D2154 deep purple, #F0A030 gold, gray neutrals) is kept

---

## 4. Current State

### 4.1 Files & Modules

```
APPS/API (NestJS)
  src/students/
    students.controller.ts    — GET /student/profile, GET /student/stage, etc.
    students.service.ts       — getProfile() includes user + documents + payments + applications
    students.dto.ts           — UpdateStudentProfileDto, UpdateAcademicDto
  prisma/schema.prisma        — Student model (51 models total)

APPS/WEB (Next.js)
  app/(students)/student/profile/page.tsx   — Main dashboard (timeline + action cards + recent activity)
  domains/student/
    student.types.ts           — StudentProfile, StageInfo, etc.
    student.api.ts             — getStudentProfile(), getStageInfo(), etc.
    student.queries.ts         — useStudentProfile(), useStageInfo(), etc.
  domains/timeline/            — useStudentTimeline()
  shared/api/queryKeys.ts      — TanStack Query keys
```

### 4.2 Current Behavior

**The profile page today shows:**
1. Welcome header — user name + application status badge + university name
2. Vertical timeline — 5 stage circles (Application → Admission & Payment → Entrance Exam → Invitation Letter → Visa & Travel)
3. Action cards — conditional on `currentStage`: apply docs, pay fees, view exams, download letters, visa support
4. Recent activity — last 5 timeline events

**What the page does NOT show (but data exists for):**

| Data | Where it lives | Why it's missing |
|---|---|---|
| Personal info (father, mother, DOB, gender, address) | Student model — included in `GET /student/profile` response | Frontend `StudentProfile` type omits these fields; page never calls `useStudentProfile()` |
| Academic info (NEET score, NEET rank, 12th %, 10th %) | Student model — same response | Same as above |
| Application details (program, status, submitted date) | UniversityApplication — included in same response | Page uses `useMyApplications()` separately but only reads `latestApp.university.name` |
| Documents & verification status | StudentDocument — included in same response | Only `useStageInfo()` fetches documents, but page doesn't render them |
| Payment history | Payment — included in same response | Same as above |
| Admission letter | AdmissionLetter — NOT included in `getProfile()` | Missing `include` |
| Invitation letter | InvitationLetter — NOT included in `getProfile()` | Missing `include` |
| Exam records | ExamRecord — NOT included in `getProfile()` | Missing `include` |

### 4.3 Student Model (relevant fields)

```
Student {
  fatherName, motherName       — String?
  dob, gender                  — DateTime?, String?
  address, city, state,        — String?
    country, pincode
  neetScore, neetRank          — Int?
  twelfthPercentage,           — Float?
    tenthPercentage
  currentStage                 — Int @default(1)
  applicationStatus            — ApplicationStatus @default(NOT_STARTED)
  // relations:
  documents: StudentDocument[]
  payments: Payment[]
  applications: UniversityApplication[]
  admissionLetter: AdmissionLetter?
  invitationLetter: InvitationLetter?
  examRecords: ExamRecord[]
  stageHistories: StageHistory[]
  timelineEvents: ApplicationTimeline[]
}
```

### 4.4 Data Flow Today

```
Profile Page
  ├─ useAuth()                    → user.name, user.role
  ├─ useStageInfo()  (poll 30s)   → currentStage, appStatus, reqs, docs, payments
  ├─ useMyApplications()          → applications list (only uses latestApp.name)
  └─ useStudentTimeline()         → timeline events (shows last 5)
```

### 4.5 Constraints

- Must keep the existing stage timeline + action cards + recent activity sections
- Must gracefully handle missing/null data (no empty states after the one we removed)
- No new database schema changes
- Backend performance: `getProfile()` hits 4+ related tables, adding 3 more joins (AdmissionLetter, InvitationLetter, ExamRecord) will add ~3 LEFT JOINs — acceptable for a single-student profile query

---

## 5. Proposed Approach (Recommended)

### 5.1 Strategy

**Phase 1 — Backend**: Augment `GET /student/profile` to include the 3 missing relations. No new endpoint needed.

**Phase 2 — Frontend types**: Expand `StudentProfile` type with all personal + academic + letter + exam fields.

**Phase 3 — Frontend UI**: Add 4–5 new info cards to the profile page below the existing sections.

### 5.2 Interfaces & Data Flow

#### Augmented `GET /student/profile` response

```
GET /student/profile
  ├─ user: { id, email, name, phone, avatarUrl }
  ├─ fatherName, motherName, dob, gender
  ├─ address, city, state, country, pincode
  ├─ neetScore, neetRank, twelfthPercentage, tenthPercentage
  ├─ currentStage, applicationStatus
  ├─ applications[]            (already included)
  ├─ documents[]               (already included)
  ├─ payments[]                (already included)
  ├─ admissionLetter?          ← NEW
  ├─ invitationLetter?         ← NEW
  └─ examRecords[]             ← NEW
```

The profile page will now call **both** `useStudentProfile()` (for rich data) AND keep `useStageInfo()` (for live polling) + `useStudentTimeline()` + `useMyApplications()`.

But to avoid duplicate fetches — `useStudentProfile()` already returns applications, documents, payments — we can simplify. The profile page should use `useStudentProfile()` as the single source for most data, and only use `useStageInfo()` for live status polling + `useStudentTimeline()` for activity.

### 5.3 UI Layout (new sections)

Below the existing "Recent Activity" card, add:

```
┌─────────────────────────────────────────┐
│  Personal Information                    │
│  ┌──────────┬──────────┬──────────┐     │
│  │ Father   │ Mother   │ DOB      │     │
│  │ Mother   │ Gender   │          │     │
│  │ Email    │ Phone    │          │     │
│  │ Address: City, State, Country        │
│  └──────────┴──────────┴──────────┘     │
├─────────────────────────────────────────┤
│  Academic Information (MBBS)            │
│  ┌──────────┬──────────┬──────────┐     │
│  │ NEET     │ NEET     │ 12th %   │     │
│  │ Score    │ Rank     │          │     │
│  │ 10th %   │          │          │     │
│  └──────────┴──────────┴──────────┘     │
├─────────────────────────────────────────┤
│  Application & University               │
│  ┌─────────────────────────────┐        │
│  │ University Name             │        │
│  │ Program: MBBS / BDS / ...  │        │
│  │ Status: Pending / Approved │        │
│  │ Submitted: 12 Mar 2026     │        │
│  └─────────────────────────────┘        │
├─────────────────────────────────────────┤
│  Documents                              │
│  ┌─────────────┬────────┬───────┐       │
│  │ Passport    │ ✓ Verified       │       │
│  │ 10th Marks  │ ⏳ Pending       │       │
│  │ 12th Marks  │ ⏳ Pending       │       │
│  │ NEET Score  │ ✗ Rejected       │       │
│  │ Photo       │ ✓ Uploaded       │       │
│  └─────────────┴────────┴───────┘       │
├─────────────────────────────────────────┤
│  Payments                               │
│  ┌──────────┬────────┬──────────┐       │
│  │ Stage    │ Amount  │ Status   │       │
│  │ Stage 1  │ ₹5,000  │ PAID     │       │
│  │ Stage 2  │ ₹10,000 │ PENDING  │       │
│  └──────────┴────────┴──────────┘       │
├─────────────────────────────────────────┤
│  Letters                                │
│  ┌─────────────────────────────┐        │
│  │ Admission Letter: Available │        │
│  │ Invitation Letter: Pending │        │
│  └─────────────────────────────┘        │
└─────────────────────────────────────────┘
```

### 5.4 Error Handling

- Every nullable field (`fatherName?`, `neetScore?`, etc.) displays `—` or `Not provided`
- Documents with `status: REJECTED` show the `remarks` text in red
- Sections with zero data are **hidden entirely** (e.g., if no exam records exist, hide the exam records detail; if no documents exist, show a single "No documents uploaded" row)
- If the entire profile API fails, the existing `stageError` fallback already handles it (retry button)

### 5.5 Backwards Compatibility

- `StudentProfile` type adds only **optional** fields — existing consumers (none currently use `useStudentProfile()`) are unaffected
- `GET /student/profile` response grows but doesn't change existing field shapes
- All existing `useStageInfo()`, `useMyApplications()`, `useStudentTimeline()` calls remain unchanged

---

## 6. Alternatives (with tradeoffs)

### Alternative A: New dedicated `/student/dashboard` endpoint

Create a new endpoint that returns exactly the enriched shape.

| Pro | Con |
|---|---|
| Clean separation from legacy profile | More code to maintain |
| Can shape response exactly for UI | Two endpoints doing almost the same thing |
| No risk of breaking existing consumers | Risk of divergence — profile vs dashboard get out of sync |

**Verdict**: Over-engineered for V1. There are no existing consumers of the profile data in the frontend. Augmenting in place is simpler.

### Alternative B: Client-side composition (fetch 3+ endpoints on the page)

Call separate endpoints for each section: `/student/profile`, `/student/{id}/letters`, `/student/{id}/exams`.

| Pro | Con |
|---|---|
| Backend stays unchanged | 3+ round trips instead of 1 |
| Easy to add/remove sections | Slower page load, more loading states to coordinate |
| Fine-grained cache invalidation | Higher total latency, waterfall requests |

**Verdict**: Worse UX. The whole point is "see everything at a glance."

### Alternative C: Keep profile page as pure "admission dashboard"

Don't add profile info at all — direct users to a separate `/student/settings` or `/student/profile/details` page.

| Pro | Con |
|---|---|
| Zero work | User has to navigate away to see basic info |
| Clean separation of concerns | Every other admissions portal shows profile + status together |

**Verdict**: Rejected. The primary value is consolidated visibility.

---

## 7. Step Plan (< 30 min each)

### Phase 1: Backend — Augment `GET /student/profile`

| Step | Files | Change | Verification |
|---|---|---|---|
| **1.1** Add includes for `admissionLetter`, `invitationLetter`, `examRecords` | `students.service.ts` line 26–48 | Add `admissionLetter: true`, `invitationLetter: true`, `examRecords: true` to the `include` in `getProfile()` | `GET /student/profile` returns the 3 new relation arrays |
| **1.2** Verify backend compiles | terminal | `cd apps/api && npx nest build` | No TypeScript errors |

### Phase 2: Frontend Types

| Step | Files | Change | Verification |
|---|---|---|---|
| **2.1** Expand `StudentProfile` type | `student.types.ts` | Add: `fatherName?`, `motherName?`, `dob?`, `gender?`, `address?`, `city?`, `state?`, `country?`, `pincode?`, `neetScore?`, `neetRank?`, `twelfthPercentage?`, `tenthPercentage?`, `createdAt?`, `admissionLetter?`, `invitationLetter?`, `examRecords?` | TypeScript compiles |
| **2.2** Add `AdmissionLetter`, `InvitationLetter`, `ExamRecord` sub-types | `student.types.ts` | Define interfaces matching Prisma shapes | TypeScript compiles |
| **2.3** Add `useStudentProfile()` call to profile page | `profile/page.tsx` | Import and call `useStudentProfile()`, store result | Console log shows profile data |

### Phase 3: Profile Sections

| Step | Files | Change | Verification |
|---|---|---|---|
| **3.1** Add **Personal Information** card | `profile/page.tsx` | New `<ProfileCard title="Personal Information">` section with 3-col grid of father, mother, DOB, gender, email, phone, address | Renders with data or `—` fallbacks |
| **3.2** Add **Academic Information** card | `profile/page.tsx` | New card with NEET score, NEET rank, 12th %, 10th % | Renders academic data |
| **3.3** Add **Application & University** card | `profile/page.tsx` | Use `latestApp` from existing `appsData` — show university name, program, status, submitted date | Renders application details |
| **3.4** Add **Documents** summary card | `profile/page.tsx` | Table/list of documents from `profileData.documents` with name, status icon/color, remarks if rejected | Shows all uploaded docs with status |
| **3.5** Add **Payments** summary card | `profile/page.tsx` | Table of stage-wise payments from `profileData.payments` with amount, status, date | Shows payment history |
| **3.6** Add **Letters** card | `profile/page.tsx` | Show admission letter + invitation letter availability, download links if `fileUrl` exists | Shows letter status |

### Phase 4: Polish & Edge Cases

| Step | Files | Change | Verification |
|---|---|---|---|
| **4.1** Add skeleton loading states for new sections | `profile/page.tsx` | Each new card gets a `Skeleton` placeholder variant | Layout doesn't jump on load |
| **4.2** Add null/empty fallbacks throughout | `profile/page.tsx` | Ensure all optional fields show `—` when null, sections hide when empty | No "undefined" or broken layout in UI |
| **4.3** Extract reusable `InfoCard`, `InfoRow`, `InfoGrid` components if patterns repeat | `profile/page.tsx` or new `_components/info-card.tsx` | DRY up the card + label-value patterns | Cleaner component tree |

---

## 8. Testing Plan

### 8.1 Manual Verification Checklist

| Test | Procedure |
|---|---|
| All sections render | Open profile page with a student who has full data (NEET, docs, payments, letters) |
| Null fallbacks work | Open profile page with a fresh student who has zero data in all optional fields |
| Documents with REJECTED status | Verify red text + remarks shown |
| Missing sections hidden | Student with no exam records → Academics card still shows, but no exam sub-section |
| Stage timeline still works | Stage circles, connectors, and "In Progress" / "Completed" labels unchanged |
| Action cards still work | Stage 1 student sees "Complete Your Application"; Stage 5 student sees all action cards |
| Recent activity still renders | Timeline events display as before |
| Mobile responsive | All new cards collapse to single column on small screens |
| Loading state | All new sections show skeleton placeholders while `useStudentProfile()` is loading |

### 8.2 Edge Cases

- `dob` is null → show `—` instead of crashing on `toLocaleDateString`
- `neetScore` is null but `twelfthPercentage` exists → show NEET as `—`, 12th% as value
- `admissionLetter` has `fileUrl` → show download link
- `invitationLetter` is null → show "Not available yet"
- `gender` is stored as `"male"` → display as `"Male"` (capitalized)
- Student has 0 payments → Payments section shows "No payments yet" with `Banknote` icon

### 8.3 Regression Tests

- Verify `GET /student/profile` still returns same existing fields (user, id, currentStage, applicationStatus)
- Verify admin application detail page still loads (uses its own `GET /admin/applications/:id` endpoint, unaffected)
- Verify `useStageInfo()` auto-refetch still works (unrelated to profile changes)
- Verify `useLogout` is gone from Header (already verified, but confirm no regression in this branch)

---

## 9. Rollout & Rollback Plan

### 9.1 Rollout Strategy

| Step | What | When |
|---|---|---|
| 1 | Merge backend change (1.1) alone as a PR | Day 1 |
| 2 | Deploy backend to staging, verify response shape | Day 1 |
| 3 | Merge types change (2.1–2.2) + profile sections (3.1–3.6) as a PR | Day 2 |
| 4 | Deploy frontend to staging, verify all sections render | Day 2 |
| 5 | Polish (4.1–4.3) as final PR | Day 3 |
| 6 | Deploy to production | Day 3 |

**Feature flag**: Not needed. The backend response grows (new optional fields), and the frontend changes are purely additive — the old sections remain intact.

### 9.2 Rollback Plan

| Scenario | Action |
|---|---|
| Backend `GET /student/profile` breaks | Revert the `include` additions in `students.service.ts` |
| Frontend profile page crashes | Revert `page.tsx` changes — the old page (timeline + actions + activity) stays intact |
| Data shows for wrong student | Verify `req.user.id` is correctly passed in `getProfile()` — no change to the where clause |

### 9.3 Monitoring

- Track `GET /student/profile` latency in NestJS logs — should stay under 200ms
- Track frontend page load with `performance.mark()` for the new sections
- No new error states to monitor (all nullable fields have fallbacks)

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `GET /student/profile` response becomes too large (>10KB) | Low | Slower page load | Response is already JSON-serialized; adding 3 small relations adds ~2–4KB. Still fast. |
| `admissionLetter` or `invitationLetter` query adds N+1 | None | — | These are direct `include` relations on a single `findUnique`, not a loop. No N+1. |
| Student has no Student record (throws 404) | Low | Profile page breaks | Existing `NotFoundException` would be caught by the `stageError` fallback (we already handle API errors) |
| Null/undefined crash in JSX rendering | Medium | White screen | Every new field uses `?? "—"` pattern; component tests would catch this |
| Conflicting imports in profile page | Low | Build fails | Only new imports are `useStudentProfile` + Lucide icons for new cards |

### What Could Go Wrong (Explicit List)

1. **Accidentally removing existing sections** — Use git diff before committing to verify no deletions to existing `<Card>` blocks
2. **Duplicate API calls** — Page already calls `useStageInfo()` (fetches documents + payments) AND `useStudentProfile()` (fetches same + more). This is fine — the stage endpoint is needed for live polling (30s refetch), and profile is fetched once.
3. **Skeleton layout mismatch** — Each new card needs its own skeleton of matching dimensions. We'll add them per-card.
4. **Color inconsistency** — New cards must use the same `#2D2154` / `#F0A030` / gray palette as existing sections.

---

## 11. Open Questions

| Question | Decision needed by |
|---|---|
| Should the enriched profile be a **separate page** (`/student/profile/details`) or stay on the **dashboard** (`/student/profile`)? | **Recommended**: Same page. The dashboard is the first thing a student sees — it should be comprehensive. |
| Should the page be server-rendered (RSC) or stay client-side? | **Recommended**: Stay client-side. The page uses `useAuth()`, `useStageInfo()` poll, and TanStack Query — all client-side patterns. RSC conversion can be a follow-up optimization. |
| Should we show exam results in the profile or keep that on `/student/exams`? | **Recommended**: Show a **summary** ("Exam: Passed / Pending / Scheduled") in the profile, link to `/student/exams` for full details. |
| Should we add an "Edit" button on personal/academic sections? | **Recommended**: Yes, but as a follow-up. The edit flows need DTOs and forms. For now, read-only is sufficient. |

---

## Implementation Order Summary

```
Backend ──────────────────────────────────────
  1.1  Augment getProfile() with 3 new includes

Frontend Types ───────────────────────────────
  2.1  Expand StudentProfile type
  2.2  Add sub-types for AdmissionLetter, InvitationLetter, ExamRecord

Frontend UI (profile/page.tsx) ───────────────
  2.3  Add useStudentProfile() call
  3.1  Personal Information card
  3.2  Academic Information card
  3.3  Application & University card
  3.4  Documents summary card
  3.5  Payments summary card
  3.6  Letters card

Polish ───────────────────────────────────────
  4.1  Skeleton loading for all new cards
  4.2  Null/empty fallbacks everywhere
  4.3  Extract reusable InfoCard patterns
```

**Total estimated effort**: ~3–4 hours split across 2–3 PRs.
