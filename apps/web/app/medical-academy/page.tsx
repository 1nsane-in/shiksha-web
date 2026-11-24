import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Medical Academy | Shiksha International",
  description:
    "Explore Shiksha International's Medical Academy with an interactive 3D human anatomy atlas covering systems, layers, and isolated structures.",
};

const atlasSrc =
  process.env.NEXT_PUBLIC_ATLAS_URL || "https://shiksha-anatomy.pages.dev";

export default function MedicalAcademyPage() {
  return (
    // ponytail: static backdrop so page paints before the cross-origin iframe
    <div className="relative h-dvh w-full" style={{ background: brand.navy }}>
      <p className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
        Loading 3D anatomy atlas…
      </p>
      <iframe
        src={atlasSrc}
        title="Medical Academy 3D Human Anatomy Atlas"
        className="relative block h-dvh w-full border-0"
        loading="eager"
        allow="fullscreen"
      />
    </div>
  );
}
