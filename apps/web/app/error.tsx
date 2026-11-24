"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // eslint-disable-next-line no-console -- log digest for support triage
  console.error("Root error boundary:", error.digest ?? error.message);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-brand-ink">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-slate-600">
        An unexpected error occurred. Please try again — if it persists,
        contact support.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </main>
  );
}
