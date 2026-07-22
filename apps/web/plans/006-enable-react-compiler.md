# 006 — Enable React Compiler

- **Status**: TODO
- **Commit**: 2f53f19
- **Severity**: MEDIUM
- **Category**: Performance
- **Rule**: Beyond the scan (missed opportunity)
- **Estimated scope**: 2 files

## Problem

React 19 supports the React Compiler (formerly "React Forget") which automatically memoizes components, hooks, and values — eliminating the need for manual `useMemo`, `useCallback`, and `memo` decisions. The project uses React 19.2.4 but the compiler is not enabled (`"hasReactCompiler": false` in the React Doctor report).

Enabling the compiler would:
- Reduce unnecessary re-renders across the entire app
- Eliminate the risk of stale closures from missing deps
- Remove the need for manual memoization decisions on all components
- Potentially fix many of the performance findings in this audit automatically

## Target

Enable the React Compiler in `next.config.ts` and install the required Babel plugin.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  // ...existing config...
  experimental: {
    reactCompiler: true,
  },
};
```

## Repo conventions to follow

- The project uses Next.js 16.2.6 with Turbopack — verify the compiler is supported in Turbopack mode.
- The project already has `babel` config via Next.js, so only the Next.js config flag should be needed.

## Steps

1. Install the compiler package:
   ```
   pnpm add babel-plugin-react-compiler
   ```
2. In `next.config.ts`, add `experimental: { reactCompiler: true }`:
   ```ts
   const nextConfig: NextConfig = {
     reactStrictMode: true,
     experimental: {
       reactCompiler: true,
     },
     // ...existing config...
   };
   ```
3. Run `pnpm build` to verify the compiler works with the codebase.
4. Run `pnpm lint` to check for any compiler-related lint issues.
5. Run `pnpm test` to verify no behavioral changes.

## Boundaries

- The React Compiler auto-memoizes; it should not change behavior, only performance. If a component breaks, there might be a hook rule violation the compiler catches.
- Do NOT remove existing `useMemo`/`useCallback`/`memo` — the compiler respects them. They can be cleaned up in a follow-up pass.
- If `experimental.reactCompiler` is not available in the installed Next.js version, upgrade Next.js or check the docs for the correct flag name.

## Verification

- **Mechanical**: `pnpm build` succeeds without compiler errors. `npx react-doctor@latest --scope changed` shows `"hasReactCompiler": true`.
- **Behavior check**: Navigate through the app — all pages should render identically. Check React DevTools "Highlight updates" — the number of highlighted re-renders on interactions should decrease.
- **Done when**: React Compiler is enabled, build passes, and no regressions observed.
