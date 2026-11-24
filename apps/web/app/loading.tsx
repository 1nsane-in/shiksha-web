export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        className="size-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-gold"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
