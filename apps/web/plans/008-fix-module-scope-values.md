# 008 — Move static values and pure functions to module scope

- **Status**: TODO
- **Commit**: 2f53f19
- **Severity**: MEDIUM
- **Category**: Maintainability & architecture
- **Rule**: prefer-module-scope-static-value, prefer-module-scope-pure-function
- **Estimated scope**: 1 file

## Problem

**`app/(admin)/admin/universities/new/page.tsx`:**
- `UNIVERSAL_MEDIUMS` array (lines 42-63) — defined inside component, rebuilt every render, breaks memoized children by appearing as a new reference
- `getDefaultFormData()` function (lines 73-185) — pure function, no local state dependency, rebuilt every render
- `normalizeUrl()` function (lines 377-385) — pure function, rebuilt every render

Each rebuild wastes memory and makes the values look "new" to child components, defeating memoization.

## Target

```tsx
// Before — inside component
export default function NewUniversityPage() {
  const UNIVERSAL_MEDIUMS = [/* ... */];
  const getDefaultFormData = () => ({/* ... */});
  const normalizeUrl = (url: string) => {/* ... */};
  // ...
}

// After — at module scope
const UNIVERSAL_MEDIUMS = [/* ... */];
const DEFAULT_FORM_DATA = { /* ... */ };  // object literal, not function
function normalizeUrl(url: string) { /* ... */ }

export default function NewUniversityPage() {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  // ...
}
```

## Repo conventions to follow

- The rest of the codebase handles this correctly: `app/(admin)/admin/universities/page.tsx` has its static data outside the component.
- If `getDefaultFormData()` computes dynamic values (like `new Date().getFullYear()`), keep it as a function but move it to module scope.

## Steps

1. Move `UNIVERSAL_MEDIUMS` from inside `NewUniversityPage()` to the top of the file (before the component function).
2. If `getDefaultFormData()` does not use any component state/props, convert it to a module-scope constant `DEFAULT_FORM_DATA`. If it uses `new Date()` or other dynamic values, keep it as a module-scope function.
3. Move `normalizeUrl()` to module scope as a standalone function.
4. Update `useState(getDefaultFormData())` to `useState(DEFAULT_FORM_DATA)` if converted to constant.

## Boundaries

- Do NOT change the shape or values of any data.
- Do NOT change component behavior.
- Do NOT extract if the value depends on props, state, or hooks — only truly static values.

## Verification

- **Mechanical**: `npx react-doctor@latest --scope changed` clears both rules. `pnpm build` passes.
- **Behavior check**: Navigate to universities/new page — all form sections should render with correct default values. No reference equality issues.
- **Done when**: Zero `prefer-module-scope-static-value` and `prefer-module-scope-pure-function` warnings.
