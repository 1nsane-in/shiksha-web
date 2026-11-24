"use client";

import { Suspense, lazy } from "react";

// Lazy load interactive (client) below-the-fold components.
// Static sections are server components rendered directly in page.tsx — zero JS.
const UniversityCards = lazy(() => import("./UniversityCards").then((mod) => ({ default: mod.UniversityCards })));
const FinalCTA = lazy(() => import("./FinalCTA").then((mod) => ({ default: mod.FinalCTA })));

// Skeleton placeholder
const Skeleton = ({ height }: { height: string }) => (
  <div
    className="w-full animate-pulse bg-slate-100"
    style={{ height: `${Number(height) / 4}rem` }}
  />
);

export function LazySections() {
  return (
    <Suspense fallback={<Skeleton height="96" />}>
      <UniversityCards />
    </Suspense>
  );
}

export function LazyFinalCTA() {
  return (
    <Suspense fallback={<Skeleton height="64" />}>
      <FinalCTA />
    </Suspense>
  );
}
