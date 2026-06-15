-- Add Russian bank payment fields to UniversityAdmin
ALTER TABLE "public"."UniversityAdmin" 
ADD COLUMN "recipientName" TEXT,
ADD COLUMN "recipientBank" TEXT,
ADD COLUMN "bankIdCode" TEXT,
ADD COLUMN "recipientInn" TEXT,
ADD COLUMN "recipientKpp" TEXT,
ADD COLUMN "singleTreasuryAccount" TEXT,
ADD COLUMN "paymentPurpose" TEXT;
