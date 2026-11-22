import type { Metadata } from "next";
import {
  AcademyExplorer,
  AcademySubjectView,
} from "@/components/landing/academy/academy";
import { findSubject } from "@/lib/academy-data";

export const metadata: Metadata = {
  title: "Shiksha Academy | FMGE and NExT subjects",
  description:
    "Browse all 19 FMGE and NExT subjects at Shiksha Academy. Expand topics, track revision, and plan your study stage by stage.",
};

type PageProps = { searchParams: Promise<{ subject?: string }> };

export default async function ShikshaAcademyPage({ searchParams }: PageProps) {
  const { subject } = await searchParams;
  const activeSubject = findSubject(subject);

  return activeSubject ? (
    <AcademySubjectView subject={activeSubject} />
  ) : (
    <AcademyExplorer />
  );
}
