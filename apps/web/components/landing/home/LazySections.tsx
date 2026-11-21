"use client";

import { Suspense, lazy } from "react";

// Lazy load below-the-fold components
const TrustBar = lazy(() => import("./TrustBar").then((mod) => ({ default: mod.TrustBar })));
const ProblemSection = lazy(() => import("./ProblemSection").then((mod) => ({ default: mod.ProblemSection })));
const SolutionSection = lazy(() => import("./SolutionSection").then((mod) => ({ default: mod.SolutionSection })));
const HowItWorks = lazy(() => import("./HowItWorks").then((mod) => ({ default: mod.HowItWorks })));
const Features = lazy(() => import("./Features").then((mod) => ({ default: mod.Features })));
const UniversityComparison = lazy(() => import("./UniversityComparison").then((mod) => ({ default: mod.UniversityComparison })));
const FinalCTA = lazy(() => import("./FinalCTA").then((mod) => ({ default: mod.FinalCTA })));
const Footer = lazy(() => import("./Footer").then((mod) => ({ default: mod.Footer })));
const UniversityCards = lazy(() => import("./UniversityCards").then((mod) => ({ default: mod.UniversityCards })));
const {
  WhyShikshaSection,
  ScholarshipsSection,
  StudentStoriesSection,
} = {
  WhyShikshaSection: lazy(() => import("./AdditionalSections").then((mod) => ({ default: mod.WhyShikshaSection }))),
  ScholarshipsSection: lazy(() => import("./AdditionalSections").then((mod) => ({ default: mod.ScholarshipsSection }))),
  StudentStoriesSection: lazy(() => import("./AdditionalSections").then((mod) => ({ default: mod.StudentStoriesSection }))),
};

// Skeleton placeholders
const Skeleton = ({ height }: { height: string }) => <div className={`h-${height} animate-pulse bg-slate-100` } />;

export function LazySections() {
  return (
    <>
      <main className="mx-auto">
        <Suspense fallback={<Skeleton height="96" />}>
          <UniversityCards />
        </Suspense>
        <Suspense fallback={<Skeleton height="64" />}>
          <WhyShikshaSection />
        </Suspense>
        <Suspense fallback={<Skeleton height="64" />}>
          <ScholarshipsSection />
        </Suspense>
        <Suspense fallback={<Skeleton height="64" />}>
          <StudentStoriesSection />
        </Suspense>
        <Suspense fallback={<Skeleton height="16" />}>
          <TrustBar />
        </Suspense>
        <Suspense fallback={<Skeleton height="64" />}>
          <ProblemSection />
        </Suspense>
        <Suspense fallback={<Skeleton height="64" />}>
          <SolutionSection />
        </Suspense>
        <Suspense fallback={<Skeleton height="64" />}>
          <HowItWorks />
        </Suspense>
        {/* <Suspense fallback={<Skeleton height="64" />}>
          <Features />
        </Suspense> */}
        <Suspense fallback={<Skeleton height="64" />}>
          <UniversityComparison />
        </Suspense>
        <Suspense fallback={<Skeleton height="64" />}>
          <FinalCTA />
        </Suspense>
      </main>
      <Suspense fallback={<Skeleton height="32" />}>
        <Footer />
      </Suspense>
    </>
  );
}