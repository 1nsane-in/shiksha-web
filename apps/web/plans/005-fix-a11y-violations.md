# 005 — Fix accessibility violations: labels, controls, keyboard handlers

- **Status**: TODO
- **Commit**: 2f53f19
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Rule**: label-has-associated-control, control-has-associated-label, click-events-have-key-events, no-static-element-interactions
- **Estimated scope**: 8 files, ~30+ occurrences

## Problem

Widespread a11y violations across admin pages. Screen reader and keyboard users cannot discover or operate controls.

**`label-has-associated-control`** (labels without associated controls):
- `app/(admin)/admin/consultations/page.tsx` — 6 occurrences (lines 268, 277, 286, 295, 304, ...)
- `app/(admin)/admin/universities/page.tsx` — 12 occurrences (lines 226, 247, 267, 508, 529, 549, 579, 608, 628, 831, 850, 873, 901)

**`control-has-associated-label`** (controls without accessible labels):
- `app/(admin)/admin/exams/page.tsx:113`
- `app/(admin)/admin/tickets/page.tsx:139`
- `app/(admin)/admin/universities/[id]/edit/page.tsx` — 4 occurrences (lines 178, 221, 259, ...)
- `app/(admin)/admin/universities/[id]/page.tsx:357`
- `app/(admin)/admin/universities/new/page.tsx` — 4 occurrences (lines 1281, 1326, 1365, ...)

**`click-events-have-key-events`** (clickable elements without keyboard handlers):
- `app/(admin)/admin/courses/page.tsx:136`
- `app/(admin)/admin/universities/[id]/edit/page.tsx:251`
- `app/(admin)/admin/universities/new/page.tsx:1357`
- `app/(admin)/admin/universities/page.tsx:293`

**`no-static-element-interactions`** (interactive static elements without role):
- Same locations as click-events-have-key-events above (these co-occur on the same elements)

## Target

### Labels without controls:
```tsx
// Before
<label>Email</label>
<input ... />

// After
<label htmlFor="email">Email</label>
<input id="email" ... />
```

### Controls without labels:
```tsx
// Before
<button onClick={...}><Icon /></button>

// After
<button onClick={...} aria-label="Description"><Icon /></button>
```

### Clickable static elements:
```tsx
// Before
<div onClick={...}>...</div>

// After
<button type="button" onClick={...} onKeyDown={(e) => e.key === 'Enter' && handler()}>...</button>
// Or if it must be a div, add role and keyboard handler:
<div role="button" tabIndex={0} onClick={...} onKeyDown={(e) => e.key === 'Enter' && handler()}>...</div>
```

## Repo conventions to follow

- Prefer semantic HTML (`<button>`, `<a>`) over `<div>` with roles. Only use `role="button"` when styling constraints prevent semantic elements.
- Use `aria-label` for icon-only buttons (consistent with `admin-sidebar.tsx` which uses `title="Sign out"`).
- Use `htmlFor` + `id` for label-input associations (consistent with `forgot-password/page.tsx` which already does this correctly).

## Steps

1. For each `label-has-associated-control` in consultations/page.tsx and universities/page.tsx: add `htmlFor` to `<label>` matching the `id` of the associated `<input>`/`<select>`.
2. For each `control-has-associated-label`: add `aria-label` to `<button>`, `<input>`, and `<select>` elements that lack visible labels.
3. For each `click-events-have-key-events` + `no-static-element-interactions`: replace `<div onClick={...}>` with `<button type="button" onClick={...}>`, or add `role="button"` + `tabIndex={0}` + `onKeyDown` handler.
4. Repeat for all 8 affected files.

## Boundaries

- Do NOT change visible styling or layout.
- Do NOT change component logic or data flow.
- If a `<div>` truly cannot be a `<button>` (e.g., complex inner content with other interactive elements), add `role="button"` + keyboard handler as fallback.

## Verification

- **Mechanical**: `npx react-doctor@latest --scope changed` clears all four rules. `pnpm lint` passes.
- **Behavior check**: Tab through each affected page — every interactive element must receive keyboard focus and be activatable with Enter/Space. Screen reader should announce each control's purpose.
- **Done when**: Zero `label-has-associated-control`, `control-has-associated-label`, `click-events-have-key-events`, and `no-static-element-interactions` warnings.
