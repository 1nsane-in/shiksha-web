-- Add ranking source and subject rankings to UniversityRecognition
ALTER TABLE "public"."UniversityRecognition" 
ADD COLUMN "rankingSource" TEXT,
ADD COLUMN "subjectRankings" JSONB;
