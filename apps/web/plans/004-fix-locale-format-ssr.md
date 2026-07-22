# 004 — Fix locale/timezone formatting in render causing hydration mismatches

- **Status**: TODO
- **Commit**: 2f53f19
- **Severity**: HIGH
- **Category**: Bugs & correctness
- **Rule**: react-doctor/no-locale-format-in-render
- **Estimated scope**: 6 files

## Problem

`toLocaleDateString()` called during render in client components. Server uses the server's locale/timezone, browser uses the user's — causes hydration mismatch. Affected files:

1. `app/(admin)/admin/consultations/page.tsx:372`
2. `app/(admin)/admin/documents/page.tsx:116`
3. `app/(admin)/admin/exams/[id]/page.tsx:182` (2 occurrences)
4. `app/(admin)/admin/exams/page.tsx:211,219` (2 occurrences)
5. `app/(admin)/admin/parent-links/page.tsx:368`
6. `app/(admin)/admin/payments/page.tsx:101`
7. `app/(admin)/admin/visa-support/page.tsx:219`

## Target

Two approaches, use Approach A where the format string is simple:

**Approach A — Extract to a constant (preferred for simple formats):**
```tsx
// Before (in render path of a client component)
{new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}

// After — pass explicit locale and timeZone so server and browser agree
{new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" })}
```

**Approach B — Format in useEffect for truly local-dependent values:**
For formats that MUST use the user's actual locale (not just "en-IN"):
```tsx
const [formatted, setFormatted] = useState("");
useEffect(() => {
  setFormatted(new Date(date).toLocaleDateString(undefined, options));
}, [date]);
// render formatted
```

## Repo conventions to follow

- The repo has `lib/utils.ts` with `formatDate()` and `formatDateTime()` helpers — these use `toLocaleDateString(undefined, options)`. The simplest fix is to update these to accept an explicit locale parameter, OR pass `timeZone: "UTC"` in each call site.
- `formatDate()` at `lib/utils.ts:26-33` is used across many files — modifying it to accept an explicit locale/timeZone would fix all call sites at once.

## Steps

### Option A: Fix at the utility function (preferred)

1. Update `lib/utils.ts` `formatDate()` to accept optional `locale` and `timeZone` params:
   ```ts
   export function formatDate(
     date: string | Date | null | undefined,
     options?: Intl.DateTimeFormatOptions,
     locale?: string,
   ): string {
     if (!date) return "N/A";
     const d = typeof date === "string" ? new Date(date) : date;
     return d.toLocaleDateString(locale ?? "en-IN", { timeZone: "UTC", ...options });
   }
   ```
2. Update `formatDateTime()` similarly.
3. For direct `toLocaleDateString()` calls in the 6 files above, replace with `formatDate()` call or add explicit `timeZone: "UTC"`.

### Option B: Fix each file individually

1. `documents/page.tsx:116` — change `new Date(doc.createdAt).toLocaleDateString("en-IN", {...})` → add `timeZone: "UTC"`
2. Repeat for each file identified above.

## Boundaries

- Values that represent past dates (createdAt, submittedAt, occurredAt) are safe to format with `timeZone: "UTC"` — they're not relative.
- The `undefined` locale (user's locale) is only safe in a `useEffect` — use explicit `"en-IN"` locale everywhere in render.
- Do NOT change backend data or API responses.

## Verification

- **Mechanical**: `npx react-doctor@latest --scope changed` clears all `no-locale-format-in-render` occurrences.
- **Behavior check**: Hard refresh each affected page. Dates should display identically on first render (server) and after hydration (client). No visible flash or mismatch.
- **Done when**: Zero `no-locale-format-in-render` warnings.
