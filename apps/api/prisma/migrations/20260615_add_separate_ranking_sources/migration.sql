-- Update ranking source fields
ALTER TABLE "public"."UniversityRecognition" 
DROP COLUMN IF EXISTS "rankingSource",
ADD COLUMN "worldRankingSource" TEXT,
ADD COLUMN "nationalRankingSource" TEXT,
ADD COLUMN "otherRankingSource" TEXT;
