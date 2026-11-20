"use client";

import { Button } from "@/ui";

export default function StudentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 px-4">
      <h2 className="text-xl font-semibold text-navy">Something went wrong</h2>
      <p className="text-sm text-slate-500 max-w-md text-center">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}

