-- Add socialLinks JSON column to University table
ALTER TABLE "public"."University" 
ADD COLUMN "socialLinks" JSONB;