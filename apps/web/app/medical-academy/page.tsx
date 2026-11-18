import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Academy | Shiksha International",
  description:
    "Explore Shiksha International's Medical Academy with an interactive 3D human anatomy atlas covering systems, layers, and isolated structures.",
};

const atlasSrc =
  process.env.NEXT_PUBLIC_ATLAS_URL || "/atlas-viewer/index.html";

export default function MedicalAcademyPage() {
  return (
    <iframe
      src={atlasSrc}
      title="Medical Academy 3D Human Anatomy Atlas"
      className="block h-dvh w-full border-0"
      loading="eager"
      allow="fullscreen"
    />
  );
}
