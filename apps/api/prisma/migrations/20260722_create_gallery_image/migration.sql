-- GalleryImage exists in the Prisma schema but was never created by a migration.
-- Create it for fresh databases. Idempotent for databases already synced via db push.
CREATE TABLE IF NOT EXISTS "GalleryImage" (
  "id" TEXT NOT NULL,
  "title" TEXT,
  "url" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'IMAGE',
  "duration" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("id")
);
