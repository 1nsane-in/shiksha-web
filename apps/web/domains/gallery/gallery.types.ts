export interface GalleryImage {
  id: string;
  title: string | null;
  url: string;
  key: string;
  type: 'IMAGE' | 'VIDEO';
  duration: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryPage {
  items: GalleryImage[];
  total: number;
  page: number;
  totalPages: number;
}

/** Flattened result returned by useGalleryImages(). */
export interface GalleryInfiniteData {
  pages: GalleryImage[];
  pageParams: unknown[];
  interleaved: GalleryImage[];
}
