-- Add refresh-token family + soft revocation for reuse detection (FIND-011)
ALTER TABLE "UserSession" ADD COLUMN "familyId" TEXT;
ALTER TABLE "UserSession" ADD COLUMN "revokedAt" TIMESTAMP(3);

CREATE INDEX "UserSession_familyId_idx" ON "UserSession"("familyId");
