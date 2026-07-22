# 002 — Fix array index keys in universities CRUD pages

- **Status**: TODO
- **Commit**: 2f53f19
- **Severity**: HIGH
- **Category**: Bugs & correctness
- **Rule**: react-doctor/no-array-index-as-key
- **Estimated scope**: 2 files, ~15 occurrences

## Problem

Array index used as `key` prop in list renders across universities admin pages. When items reorder (sort, filter, add/remove), React attaches component state to the wrong row — users see and submit incorrect data.

Affected locations (from React Doctor scan):

**`app/(admin)/admin/universities/new/page.tsx`:**
- Line 312: `key={idx}` in a map
- Line 1618: `key={i}`
- Line 2261: `key={i}`
- Line 2384: `key={i}`
- Line 2483: `key={i}`
- Line 2543: `key={i}`
- Line 2648: `key={i}`
- Line 2721: `key={i}`
- Line 3254: `key={i}`

**`app/(admin)/admin/universities/[id]/edit/page.tsx`:**
- Line 490: `key={i}`
- Line 624: `key={i}`
- Line 676: `key={i}`
- Line 776: `key={i}`
- Line 925: `key={i}`

Also:
- `app/(admin)/admin/visa-support/page.tsx:181` — `key={i}`
- `app/(admin)/admin/universities/new/page.tsx:312` — `key={idx}`

## Target

Replace every `key={i}` / `key={idx}` with `key={item.id}` or `key={item.code}` or another stable unique field from the item object.

```tsx
// Before
{items.map((item, i) => <div key={i}>...</div>)}

// After
{items.map((item) => <div key={item.id}>...</div>)}
```

## Repo conventions to follow

- The rest of the codebase already uses stable IDs: `app/(admin)/admin/documents/page.tsx` uses `key={doc.id}`, `components/admin/nav-main.tsx` uses `key={item.title}`.
- Do not concatenate strings to create keys — use the item's natural unique ID.

## Steps

1. Open `app/(admin)/admin/universities/new/page.tsx`. For each `.map((..., i) =>` or `.map((..., idx) =>` that uses `key={i}` or `key={idx}`:
   - Find the stable identifier on the item (e.g., item has `id`, `code`, or some unique field; if the item is a string, use the string value itself as key)
   - Replace `key={i}` → `key={item.id}` (or appropriate field)
   - If the item has no stable ID, use a combination of fields that is unique (e.g., `key={item.name + item.field}`) or add a counter-based ID
2. Repeat for `app/(admin)/admin/universities/[id]/edit/page.tsx`
3. Fix `app/(admin)/admin/visa-support/page.tsx:181`
4. Verify each render path: forms that have dynamic item lists (add/remove items), sortable tables, multi-step form sections with repeated sub-lists

## Boundaries

- Do NOT change any data model or API response shape.
- Do NOT change the visual rendering.
- If an item truly has no stable unique field, use `${item.someField}-${index}` as a last resort (strictly better than bare index), and add a `// ponytail:` comment noting the missing ID.

## Verification

- **Mechanical**: `npx react-doctor@latest --scope changed` clears all `no-array-index-as-key` occurrences. `pnpm lint` and `pnpm build` pass.
- **Behavior check**: In the universities/new page, add multiple items to a list (e.g., programs, fee items), remove the middle one, and confirm no state leaks. In universities/edit, reorder items and confirm the right data stays with each row.
- **Done when**: Zero `no-array-index-as-key` warnings in the scanned files.
