-- AlterTable: Change programs from text[] to Json
ALTER TABLE "UniversityAcademic" 
  DROP COLUMN IF EXISTS "programs",
  ADD COLUMN "programs" JSON NOT NULL DEFAULT '[]'::json;
