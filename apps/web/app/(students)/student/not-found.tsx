import Link from "next/link";

export default function StudentNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 px-4">
      <h2 className="text-xl font-semibold text-[#2D2154]">Page not found</h2>
      <p className="text-sm text-[#6B6B6B] max-w-md text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/student/dashboard"
        className="inline-flex items-center justify-center rounded-md bg-[#4B2D8E] px-4 py-2 text-sm font-medium text-white hover:bg-[#3D2370] transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
