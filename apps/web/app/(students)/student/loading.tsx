export default function StudentLoading() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4B2D8E] border-t-transparent" />
        <p className="text-sm text-[#6B6B6B]">Loading...</p>
      </div>
    </div>
  );
}

