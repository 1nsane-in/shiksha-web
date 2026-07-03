-- Per-application payment tracking.
-- Before: Payment.applicationId was declared in schema but never migrated
-- to the DB; and the admin application details page loaded
-- `student.payments` (all payments for the student, across every
-- application). Result: a fresh applicant's Payment Ledger could show
-- pre-seeded or other-application payment records.
-- Fix: add the missing column, scope the query, and make it required.

-- 1. Add the column. Existing rows (incl. any orphan seed data) become
--    NULL and will be deleted in the next step.
ALTER TABLE "Payment" ADD COLUMN "applicationId" TEXT;

-- 2. Drop rows that have no applicationId. These are invalid records
--    from prior seeds / dev data and have no valid home under the new
--    constraint.
DELETE FROM "Payment" WHERE "applicationId" IS NULL;

-- 3. Flip to NOT NULL.
ALTER TABLE "Payment" ALTER COLUMN "applicationId" SET NOT NULL;

-- 4. Add the index Prisma declares via @@index([applicationId]).
CREATE INDEX "Payment_applicationId_idx" ON "Payment"("applicationId");

-- 5. Add the FK from Payment to UniversityApplication (Cascade on
--    delete to keep the relation tight).
ALTER TABLE "Payment"
  ADD CONSTRAINT "Payment_applicationId_fkey"
  FOREIGN KEY ("applicationId") REFERENCES "UniversityApplication"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
