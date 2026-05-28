# Implementation Plan: Student Application Integration

## Overview

Frontend-only implementation that adds the already-applied check, applications on profile, and enhanced application detail page. All backend endpoints already exist.

## Tasks

- [x] 1. Add checkApplication API and types
  - [x] 1.1 Add `ApplicationCheckResult` type to `apps/web/domains/student/student.types.ts`
    - Add interface with `applied: boolean` and optional `application` object
    - _Requirements: 1.1_
  - [x] 1.2 Add `checkApplication` function to `apps/web/domains/student/student.api.ts`
    - Call `GET /student/applications/check/${universityId}`
    - Import `ApplicationCheckResult` type
    - _Requirements: 1.1_
  - [x] 1.3 Add `useCheckApplication` query hook to `apps/web/domains/student/student.queries.ts`
    - Use queryKey `[...queryKeys.student.applications(), "check", universityId]`
    - Enabled only when universityId is truthy
    - _Requirements: 1.1_
  - [x] 1.4 Export new types and hook from `apps/web/domains/student/index.ts`
    - Export `ApplicationCheckResult` type and `useCheckApplication` hook
    - _Requirements: 1.1_

- [x] 2. Update University Detail Page with already-applied check
  - [x] 2.1 Modify the `ApplicationForm` component in `apps/web/app/(students)/student/university/[slug]/page.tsx`
    - Call `useCheckApplication(uniId)` when authenticated student
    - If `applied: true`, render an "Already Applied" status card with link to `/student/applications/:id`
    - If `applied: false` or not authenticated, show the form as before
    - Handle loading state (show spinner while checking)
    - If API fails, fall back to showing the apply form
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [x] 3. Add Applications section to Profile Page
  - [x] 3.1 Update `apps/web/app/(students)/student/profile/page.tsx`
    - Add a "My Applications" card section after the action cards and before Recent Activity
    - Display each application with university name, program, status badge, and submission date
    - Sort applications by `submittedAt` descending (most recent first)
    - Each item is clickable and navigates to `/student/applications/:id`
    - Show empty state with "Browse Universities" CTA if no applications
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4. Enhance Application Detail Page
  - [x] 4.1 Update `apps/web/app/(students)/student/applications/[id]/page.tsx` with full form data display
    - Show personal info section (name, DOB, citizenship, gender, marital status)
    - Show address section (permanent address fields)
    - Show language abilities section
    - Show program selection
    - _Requirements: 3.1_
  - [x] 4.2 Add timeline section to application detail page
    - Import and use `useApplicationTimeline(id)` from `@/domains/timeline`
    - Display events in chronological order with stage indicators
    - Handle timeline API failure gracefully (hide section, don't block page)
    - _Requirements: 3.2, 3.5_
  - [x] 4.3 Add stage-specific action buttons to application detail page
    - Map current stage to action (stage 2→payments, stage 3→exams, stage 4→letters, stage 5→visa)
    - Display action card with label, description, and navigation button
    - Only show when application is approved and stage has an action
    - _Requirements: 3.3, 4.3_
  - [x] 4.4 Enhance university info display on application detail page
    - Show university name, location (city, country), contact info
    - Add link to university detail page via slug
    - _Requirements: 3.4_
  - [x] 4.5 Add enhanced status display with stage indicator
    - Add `in_review` status to statusConfig (blue color)
    - Show color-coded status badge (pending=yellow, in_review=blue, approved=green, rejected=red)
    - Show current stage number and name alongside status
    - _Requirements: 4.1, 4.2_

- [x] 5. Checkpoint - Verify all pages render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Property-based tests
  - [x] 6.1 Write property test for status badge color mapping
    - **Property 5: Status badge color mapping**
    - **Validates: Requirements 4.1**
  - [x] 6.2 Write property test for stage-to-action mapping
    - **Property 4: Stage-to-action mapping is correct**
    - **Validates: Requirements 3.3, 4.3**
  - [x] 6.3 Write property test for application sort order
    - **Property 2: Applications on profile are sorted by date descending**
    - **Validates: Requirements 2.4**

- [x] 7. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All backend endpoints already exist — this is frontend-only work
- The existing `useMyApplications` hook is reused on the profile page (already imported)
- The existing `useApplicationTimeline` hook from `@/domains/timeline` is reused on the detail page
- `ApplicationCheckResult` type already exists in student.types.ts (task 1.1 complete)
- The profile page already imports `useMyApplications` and has the data available as `applications`
