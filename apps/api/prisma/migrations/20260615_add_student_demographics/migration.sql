-- Add studentDemographics JSON column to University table
ALTER TABLE "University" ADD COLUMN IF NOT EXISTS "studentDemographics" JSONB;
