import dynamic from "next/dynamic";

/**
 * Skeleton shown while the dynamic form chunk loads.
 */
export function FormSkeleton() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="inline-block size-6 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lazy-loaded forms — both rely on `country-state-city` (~300 KB), so we
// defer loading until the user switches to the relevant tab.
// ---------------------------------------------------------------------------
export const LazyConsultationForm = dynamic(
  () =>
    import("./consultation-form").then((mod) => ({
      default: mod.ConsultationForm,
    })),
  { loading: () => <FormSkeleton /> }
);

export const LazyUniversityRequestForm = dynamic(
  () =>
    import("./university-request-form").then((mod) => ({
      default: mod.UniversityRequestForm,
    })),
  { loading: () => <FormSkeleton /> }
);
