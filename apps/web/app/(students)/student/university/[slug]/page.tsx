"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useUniversity } from "@/domains/universities/universities.queries";
import {
  Skeleton,
  ErrorState,
  UniversityContent,
} from "@/components/student/university-detail/page-content";

export default function UniversityDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: uni, isLoading, error, refetch } = useUniversity(slug);

  // scroll to top on mount so back button is visible
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) return <Skeleton />;
  if (error || !uni)
    return <ErrorState error={error as Error} onRetry={() => refetch?.()} />;

  // validate required fields
  if (!uni.name || !uni.location) {
    return (
      <ErrorState
        error={new Error("University data incomplete. Required information (name or location) is missing.")}
        onRetry={() => refetch?.()}
      />
    );
  }

  return <UniversityContent uni={uni} />;
}
