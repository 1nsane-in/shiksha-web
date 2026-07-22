# 007 — Replace plain `<img>` with `next/image`

- **Status**: TODO
- **Commit**: 2f53f19
- **Severity**: MEDIUM
- **Category**: Bugs & correctness
- **Rule**: react-doctor/nextjs-no-img-element
- **Estimated scope**: 3 files

## Problem

Plain `<img>` elements ship unoptimized, oversized images. No responsive srcsets, no lazy loading, no WebP/AVIF conversion.

Affected files:
1. `app/(admin)/admin/exams/[id]/page.tsx:252`
2. `app/(admin)/admin/universities/[id]/edit/page.tsx:171,213`
3. `app/(admin)/admin/universities/new/page.tsx:1274,1318`

These are user-uploaded images (exam images, university logo, brochure thumbnail). They lose the performance benefits of Next.js Image Optimization.

## Target

```tsx
// Before
<img src={url} alt={label} className="..." />

// After (for static dimensions or fill)
import Image from "next/image";
<Image 
  src={url} 
  alt={label} 
  width={400} 
  height={300} 
  className="..."
  // or fill with sizes for responsive
/>
```

If the image source is from a remote domain, ensure the domain is already in `next.config.ts` `images.remotePatterns` (it is — `*.r2.dev`, `images.unsplash.com`, `placehold.co`, `cdn.shiksha.study` are listed).

## Repo conventions to follow

- The repo already imports and uses `next/image` extensively — e.g., in `admin-sidebar.tsx:83`, `forgot-password/page.tsx:210`, `Header.tsx:3`.
- For user-uploaded images stored in R2, use `fill` with `sizes` prop (since dimensions vary). For fixed aspect ratio thumbnails, use explicit `width` and `height`.

## Steps

1. In `app/(admin)/admin/exams/[id]/page.tsx:252`: replace `<img>` with `<Image>` — set `width={400} height={300}` or use `fill` with a container.
2. In `app/(admin)/admin/universities/[id]/edit/page.tsx:171,213`: same replacement.
3. In `app/(admin)/admin/universities/new/page.tsx:1274,1318`: same replacement.
4. Verify the `next.config.ts` `images.remotePatterns` covers the image source domains.

## Boundaries

- Do NOT change the layout or appearance of images.
- If the image source is dynamic (user-uploaded URL), use `unoptimized={true}` as a fallback if next/image cannot determine dimensions (place `// ponytail:` comment).
- Do NOT convert images imported at build time — only runtime URLs.

## Verification

- **Mechanical**: `npx react-doctor@latest --scope changed` clears all `nextjs-no-img-element`. `pnpm build` succeeds.
- **Behavior check**: Visit exam detail and university edit/new pages — images should render identically. Check network panel — images should use `/_next/image` URL format with format negotiation.
- **Done when**: Zero `nextjs-no-img-element` warnings.
