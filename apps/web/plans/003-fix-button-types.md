# 003 — Fix buttons missing explicit type

- **Status**: TODO
- **Commit**: 2f53f19
- **Severity**: HIGH
- **Category**: Bugs & correctness
- **Rule**: react-doctor/button-has-type
- **Estimated scope**: 5 files, ~7 occurrences

## Problem

`<button>` without `type` defaults to `type="submit"` inside any form. Clicking these buttons accidentally submits the form. Affected files:

1. `app/(admin)/admin/consultations/page.tsx:252` — button in filter/dialog
2. `app/(admin)/admin/exams/create/page.tsx:158` — cancel/dismiss button
3. `app/(admin)/admin/tickets/page.tsx:112` — action button
4. `app/(admin)/admin/universities/page.tsx:175,189` — filter action buttons
5. `app/(shared)/auth/callback/page.tsx:61` — "Back to Login" button

## Target

```tsx
// Before
<button onClick={...}>Label</button>
<button className="..." onClick={...}>Label</button>

// After
<button type="button" onClick={...}>Label</button>
```

For submit buttons, either keep them as `type="submit"` (default) or add explicit `type="submit"`.

## Repo conventions to follow

- The repo's `Button` component from `@repo/ui` wraps `<button>` — check if `Button` already sets a default `type`. If the component uses `<Button>` from `@repo/ui`, check its implementation. For raw `<button>` elements, add `type="button"`.
- `app/(shared)/auth/callback/page.tsx:61` uses a raw `<button>` — this must get `type="button"`.

## Steps

1. For each file listed above, find every `<button` that lacks a `type` attribute.
2. Add `type="button"` to buttons that are NOT form submit actions.
3. For the auth callback page `line 61-66`: change `<button>` to `<button type="button">`.
4. For universities/page.tsx lines 175 and 189: these are inside form elements — confirm they're not meant to submit, then add `type="button"`.

## Boundaries

- Do NOT change `type="submit"` buttons that are supposed to submit forms.
- Do NOT change the `<Button>` component from `@repo/ui` — only raw `<button>` elements in page components.

## Verification

- **Mechanical**: `npx react-doctor@latest --scope changed` clears all `button-has-type` findings. `pnpm lint` passes.
- **Behavior check**: Visit each affected page. Click the previously-untyped buttons — confirm they perform their intended action without accidentally submitting any surrounding form.
- **Done when**: Zero `button-has-type` warnings.
