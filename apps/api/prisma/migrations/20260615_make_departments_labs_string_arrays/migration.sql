-- AlterTable: Make hospitalBeds optional, departments/laboratories from Int to String[]
ALTER TABLE "UniversityInfrastructure"
  ALTER COLUMN "hospitalBeds" DROP NOT NULL,
  DROP COLUMN IF EXISTS "departments",
  ADD COLUMN "departments" text[] NOT NULL DEFAULT '{}',
  DROP COLUMN IF EXISTS "laboratories",
  ADD COLUMN "laboratories" text[] NOT NULL DEFAULT '{}';
