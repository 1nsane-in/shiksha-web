# 001 — Split giant admin page components

- **Status**: TODO
- **Commit**: 2f53f19
- **Severity**: HIGH
- **Category**: Maintainability & architecture
- **Rule**: react-doctor/no-giant-component
- **Estimated scope**: 6 files, large

## Problem

Six admin page components exceed 300 lines, making them hard to read, test, and change. The worst:
- `app/(admin)/admin/universities/new/page.tsx` — **3394 lines / 176KB** (9-step wizard form)
- `app/(admin)/admin/universities/[id]/edit/page.tsx` — ~900+ lines
- `app/(admin)/admin/consultations/page.tsx` — ~400+ lines
- `app/(admin)/admin/parent-links/page.tsx` — ~400+ lines
- `app/(admin)/admin/universities/[id]/page.tsx` — ~400+ lines
- `app/(admin)/admin/universities/page.tsx` — ~900+ lines

Each bundles multiple concerns (state, rendering, event handlers, sub-lists, form sections) into a single exported function. This makes parallel work impossible, creates merge conflicts, and hides bugs.

## Target

Each page extracted into:
- Page component (~30-50 lines: data fetching, layout, delegation to sub-components)
- Sub-components in `components/admin/<area>/` for each distinct section
- Shared types stay in the existing domain type files

Exemplar: `app/(admin)/admin/dashboard/page.tsx` (28 lines, delegates to SectionCards + ChartAreaInteractive + DataTable).

## Repo conventions to follow

- The repo already has `components/admin/` with sub-directories per domain (`students/`, `universities/`, `applications/`, `shared/`). Use them.
- Existing pattern: `components/shared/data-table.tsx`, `components/admin/section-cards.tsx`
- Each sub-component gets its own file, named after its function.
- Props are typed inline or with a local interface.

## Steps

### universities/new/page.tsx (highest priority, 3394 lines)

1. Create `components/admin/universities/university-basic-info.tsx` — extract Basic Info step fields (name, shortName, type, establishedYear, website)
2. Create `components/admin/universities/university-location.tsx` — extract Location & Contact step (Country/State/City selectors, address, email, phone)
3. Create `components/admin/universities/university-academic-details.tsx` — extract Academic Details (programs list, durations, fees, seats)
4. Create `components/admin/universities/university-fees.tsx` — extract Fees step
5. Create `components/admin/universities/university-recognition.tsx` — extract Recognition step
6. Create `components/admin/universities/university-infrastructure.tsx` — extract Infrastructure step
7. Create `components/admin/universities/university-admission.tsx` — extract Admission step
8. Create `components/admin/universities/university-bank-details.tsx` — extract Bank Details step
9. Create `components/admin/universities/university-step-nav.tsx` — extract step navigation (prev/next/save)
10. The page itself becomes: `const [step, setStep] = useState(0); render step component based on step index; render <UniversityStepNav />`

### universities/[id]/edit/page.tsx

11. Create `components/admin/universities/university-edit-form.tsx` — extract the form body (it mirrors new/page structure but with initial data)

### consultations/page.tsx

12. Create `components/admin/consultations/consultation-list.tsx` — extract the list/table section
13. Create `components/admin/consultations/consultation-form.tsx` — extract any form sections

### parent-links/page.tsx

14. Create `components/admin/shared/parent-link-list.tsx` — extract the table/content section

### universities/[id]/page.tsx

15. Create `components/admin/universities/university-detail-info.tsx` — extract detail view sections

### universities/page.tsx

16. Create `components/admin/universities/university-list-table.tsx` — extract the filter/search/table section
17. Create `components/admin/universities/university-list-filters.tsx` — extract filter controls

## Boundaries

- Do NOT change public component APIs or page routes.
- Do NOT change the behavior of any form or list.
- Keep existing state management patterns (useState, form state) — just move them closer to where they're used.
- Do NOT add new dependencies.
- Do NOT refactor the data fetching logic (queries, mutations) — only split the rendering.

## Verification

- **Mechanical**: `npx react-doctor@latest --scope changed` clears `no-giant-component` for all 6 files. `pnpm lint` passes. `pnpm build` succeeds.
- **Behavior check**: Navigate to each admin page and confirm the UI renders identically. For universities/new, step through all 9 wizard steps and verify form state persists across steps.
- **Done when**: No page component in `app/(admin)/` exceeds 200 lines, and every extracted component renders correctly.
