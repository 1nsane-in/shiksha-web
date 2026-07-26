-- Sync Prisma schema with deployed DB.
-- Columns added to schema without a corresponding migration file.

-- UniversityAdmin: extra fields
ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "phoneCountryCode" TEXT NOT NULL DEFAULT '+91';
ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "recipientName" TEXT;
ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "recipientBank" TEXT;
ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "bankIdCode" TEXT;
ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "recipientInn" TEXT;
ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "recipientKpp" TEXT;
ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "singleTreasuryAccount" TEXT;
ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "paymentPurpose" TEXT;
ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "bankCountry" TEXT;
ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "bankDetails" JSONB;

-- UniversityFees: extra fields
ALTER TABLE "UniversityFees" ADD COLUMN IF NOT EXISTS "programBreakdown" JSONB;

-- UniversityRecognition: re-add rankingSource if it was dropped
ALTER TABLE "UniversityRecognition" ADD COLUMN IF NOT EXISTS "rankingSource" TEXT;
