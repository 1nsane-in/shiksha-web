import Image from "next/image";

/**
 * Root Suspense fallback (route transition splash).
 * Full-bleed brand splash instead of a bare spinner: shows the logo + name
 * while a dynamic segment streams in. Static markup, so it never blocks
 * hydration.
 */
export default function RootLoading() {
  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-dvh flex-col items-center justify-center gap-4 bg-brand-navy"
      role="status"
      aria-live="polite"
      aria-label="Loading Shiksha International"
    >
      <Image
        src="/img/shiksha-logo.png"
        alt=""
        width={64}
        height={64}
        priority
        className="h-16 w-16 rounded-full bg-white/10 p-2 shadow-[0_0_40px_rgba(201,164,92,0.25)] motion-safe:animate-pulse"
      />
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg font-bold uppercase tracking-[0.18em] text-white">
          Shiksha
        </p>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand-gold">
          International
        </p>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
