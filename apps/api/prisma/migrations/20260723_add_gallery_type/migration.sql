-- Add type and duration columns to GalleryImage
ALTER TABLE "GalleryImage" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'IMAGE';
ALTER TABLE "GalleryImage" ADD COLUMN IF NOT EXISTS "duration" INTEGER;
