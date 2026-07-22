# 009 — Fix small performance issues

- **Status**: TODO
- **Commit**: 2f53f19
- **Severity**: LOW / MEDIUM
- **Category**: Performance
- **Rule**: rerender-state-only-in-handlers, rerender-lazy-state-init, js-combine-iterations, client-localstorage-no-version, nextjs-no-client-side-redirect, nextjs-no-a-element
- **Estimated scope**: 5 files, small edits

## Problem

Several small performance and correctness issues across different files:

### A) useState for non-rendered values (`rerender-state-only-in-handlers`)

**`app/(admin)/admin/letters/page.tsx:22`:**
```tsx
const [pendingUpload, setPendingUpload] = useState<"admission" | "invitation" | null>(null);
```
`pendingUpload` is only set in event handlers, never rendered. Causes 2 extra re-renders per upload.

**`app/(shared)/forgot-password/page.tsx:20`:**
```tsx
const [token, setToken] = useState("");
```
`token` is only set in `handleVerifyOtp`, never read in render. Used as argument to `resetPassword()`.

### B) State initializer runs on every render (`rerender-lazy-state-init`)

**`app/(admin)/admin/universities/new/page.tsx:187`:**
```tsx
const [formData, setFormData] = useState(getDefaultFormData());
```
`getDefaultFormData()` is called every render but the return value is thrown away after the first render.

### C) Chained array iterations (`js-combine-iterations`)
**`app/(admin)/admin/universities/page.tsx`:**
- Line 742: `.filter().map()` chain
- Line 855: `.filter().map()` chain

### D) Unversioned localStorage (`client-localstorage-no-version`)
**`app/(admin)/admin/universities/new/page.tsx:226`:**
```tsx
localStorage.setItem("university-create-form", JSON.stringify(...))
```
Schema change in a future update will crash on rehydrating saved form data.

### E) Client-side redirect in useEffect (`nextjs-no-client-side-redirect`)
**`app/(shared)/auth/callback/page.tsx:39-45`:**
`router.push()` in useEffect on auth-callback page. Flashes loading page before redirect.

### F) Plain `<a>` for internal link (`nextjs-no-a-element`)
**`app/(shared)/forgot-password/page.tsx:73`:**
```tsx
<a href="/" className="...">
```
Full page reload, no client-side navigation.

## Target

### A) Replace useState with useRef:

```tsx
// letters/page.tsx
const pendingUpload = useRef<"admission" | "invitation" | null>(null);
// Use: pendingUpload.current = "admission";  (not setPendingUpload("admission"))

// forgot-password/page.tsx  
const tokenRef = useRef("");
// Use: tokenRef.current = result.token; setTokenRef(result.token) — actually for the resetPassword call, use ref
```

### B) Lazy state init:

```tsx
// Before
const [formData, setFormData] = useState(getDefaultFormData());

// After (after Plan 008 moves getDefaultFormData to module scope)
const [formData, setFormData] = useState(() => getDefaultFormData());
// or if converted to static constant:
const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
```

### C) Combine iterations:

```tsx
// Before
items.filter(fn).map(fn2)

// After
items.reduce((acc, item) => { if (fn(item)) acc.push(fn2(item)); return acc; }, [])
// or for...of with push
```

### D) Version localStorage key:

```tsx
// Before
"university-create-form"

// After
"university-create-form:v1"
```

### E) Auth callback redirect:

This is an OAuth callback page — it necessarily runs on the client since it receives the token from the URL hash. The `Suspense` boundary is already correct. Just add a comment that this is intentional:

```tsx
// ponytail: OAuth callback must use client-side redirect — token comes from URL hash fragment
```

### F) Replace `<a>` with `<Link>`:

```tsx
import Link from "next/link";
// ...
<Link href="/" className="...">
```

## Steps

1. `letters/page.tsx`: change `pendingUpload` from `useState` to `useRef`. Update all reads from `pendingUpload` to `pendingUpload.current`.
2. `forgot-password/page.tsx`: 
   - Change `token` from `useState` to `useRef`. Store token in ref after verifyOtp success.
   - Replace `<a href="/">` with `<Link href="/">`.
3. `universities/new/page.tsx`:
   - Wrap `getDefaultFormData()` in `() =>` for lazy init (after Plan 008 moves it to module scope).
   - Change localStorage key `"university-create-form"` to `"university-create-form:v1"`.
4. `universities/page.tsx`: merge `.filter().map()` chains into single pass.
5. `auth/callback/page.tsx`: add `// ponytail:` comment explaining the client-side redirect is intentional.

## Boundaries

- Do NOT change any behavior — these are refactoring/performance fixes only.
- For the auth callback, the `Suspense` boundary already handles the loading state correctly.
- The ref changes for `pendingUpload` and `token` must not break any logic — verify all reads/writes.

## Verification

- **Mechanical**: `npx react-doctor@latest --scope changed` clears all targeted rules. `pnpm lint` and `pnpm build` pass.
- **Behavior check**: 
  - Letters page: upload a letter — confirm flow works end-to-end.
  - Forgot password: complete the full flow (email -> OTP -> new password -> success).
  - Universities/new: step through wizard, save draft, refresh — confirm local storage restore works.
  - Auth callback: sign in with Google — confirm redirect to correct dashboard.
  - Universities list: filter universities — confirm correct results render.
- **Done when**: All six targeted warnings are cleared and behavior is unaffected.
