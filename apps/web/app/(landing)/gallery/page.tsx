import { serverGet } from "@/shared/api/server-fetch";
import type { GalleryPage } from "@/domains/gallery";
import { GalleryHero } from "@/components/landing/gallery/gallery-hero";
import { GalleryClient } from "@/components/landing/gallery/gallery-client";
import { resolveGalleryView } from "@/lib/gallery-views";
import type { Metadata } from "next";

export const metadata : Metadata = {
  title: "Student Life Gallery | Shiksha International",
  description:
    "Real campus moments, accommodation, travel support and student experiences from Shiksha International's partner universities.",
};

type PageProps = { searchParams: Promise<{ view?: string }> };

/**
 * Gallery page. Server-fetches the first page so the grid paints on first
 * paint; infinite scroll + lightbox stay client-side.
 */
export default async function GalleryPage({ searchParams }: PageProps) {
  const { view: viewParam } = await searchParams;
  const view = resolveGalleryView(viewParam ?? null);
  const firstPage = await serverGet<GalleryPage>("/gallery?page=1&limit=12");

  return (
    <>
      <GalleryHero view={view} />
      <GalleryClient view={view} initialPage={firstPage} />
    </>
  );
}
