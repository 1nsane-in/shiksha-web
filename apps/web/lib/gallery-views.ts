/**
 * Student Life gallery views. Query value: /gallery?view=<key>
 * Since gallery items have no category column, views match keywords in
 * title, storage key and URL. Untagged images fall back to the full gallery.
 */

export const galleryViews = {
  all: {
    label: "All photos",
    eyebrow: "Shiksha Global Campus Life",
    title: "Our University Gallery",
    description:
      "Explore our world-class campus infrastructures, modern academic libraries, advanced anatomy labs, hostel facilities, and the vibrant life of our medical students abroad.",
    keywords: [] as string[],
  },
  experiences: {
    label: "Student Experiences",
    eyebrow: "Life on Campus",
    title: "Student Experiences",
    description:
      "Classrooms, labs, events and everyday moments from students living and studying abroad.",
    keywords: [
      "experience",
      "student",
      "campus",
      "class",
      "study",
      "lab",
      "event",
      "fest",
      "friend",
      "activity",
    ],
  },
  accommodation: {
    label: "Accommodation",
    eyebrow: "Where Students Live",
    title: "Accommodation",
    description:
      "A look at hostels, residences and the spaces students call home during their medical course.",
    keywords: [
      "hostel",
      "accommodation",
      "room",
      "dorm",
      "housing",
      "residence",
      "warden",
    ],
  },
  "travel-support": {
    label: "Travel Support",
    eyebrow: "From Arrival Onwards",
    title: "Travel Support",
    description:
      "Airport pickups, arrival support and the journeys that take students from home to campus.",
    keywords: [
      "travel",
      "airport",
      "flight",
      "visa",
      "pickup",
      "arrival",
      "transport",
      "trip",
    ],
  },
} as const;

export type GalleryView = keyof typeof galleryViews;

export const galleryViewKeys = Object.keys(galleryViews) as GalleryView[];

export function resolveGalleryView(value: string | null): GalleryView {
  return value && value in galleryViews ? (value as GalleryView) : "all";
}

export function galleryHref(view: GalleryView): string {
  return view === "all" ? "/gallery" : `/gallery?view=${view}`;
}

export function matchesGalleryView(
  image: { title: string | null; key: string; url: string },
  view: GalleryView,
): boolean {
  if (view === "all") return true;
  const haystack = `${image.title ?? ""} ${image.key} ${image.url}`.toLowerCase();
  return galleryViews[view].keywords.some((keyword) => haystack.includes(keyword));
}
