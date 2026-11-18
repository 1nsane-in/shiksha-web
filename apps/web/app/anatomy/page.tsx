import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Human Anatomy | Shiksha International",
  description:
    "Explore an interactive 3D human anatomy atlas with systems, layers, and isolated structures.",
};

const atlasSrc =
  process.env.NEXT_PUBLIC_ATLAS_URL || "/atlas-viewer/index.html";

export default function AnatomyPage() {
  return (
    <iframe
      src={atlasSrc}
      title="3D Human Anatomy Atlas"
      className="block h-dvh w-full border-0"
      loading="eager"
      allow="fullscreen"
    />
  );
}
