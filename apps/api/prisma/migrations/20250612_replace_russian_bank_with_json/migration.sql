-- Replace 7 Russian bank columns with generic bankCountry + bankDetails JSON
-- bankDetails stores country-specific bank fields as flexible JSON

ALTER TABLE "public"."UniversityAdmin" 
DROP COLUMN IF EXISTS "recipientName",
DROP COLUMN IF EXISTS "recipientBank",
DROP COLUMN IF EXISTS "bankIdCode",
DROP COLUMN IF EXISTS "recipientInn",
DROP COLUMN IF EXISTS "recipientKpp",
DROP COLUMN IF EXISTS "singleTreasuryAccount",
DROP COLUMN IF EXISTS "paymentPurpose",
ADD COLUMN "bankCountry" TEXT,
ADD COLUMN "bankDetails" JSONB;