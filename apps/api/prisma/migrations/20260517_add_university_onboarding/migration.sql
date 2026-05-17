-- CreateEnum
CREATE TYPE "UniversityType" AS ENUM ('GOVERNMENT', 'PRIVATE', 'DEEMED', 'AUTONOMOUS');

-- CreateEnum
CREATE TYPE "UniversityStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ECFMGStatus" AS ENUM ('APPROVED', 'NOT_APPROVED', 'PENDING');

-- CreateEnum
CREATE TYPE "UniversityDocType" AS ENUM ('BROCHURE', 'PROSPECTUS', 'RECOGNITION_CERTIFICATE', 'AFFILIATION_DOCUMENT', 'DEGREE_SAMPLE', 'FEE_STRUCTURE', 'ADMISSION_FORM', 'HOSTEL_RULES', 'ANTI_RAGGING_POLICY', 'AGREEMENT');

-- AlterTable: Drop old columns and add new ones
ALTER TABLE "University" DROP COLUMN IF EXISTS "country",
DROP COLUMN IF EXISTS "city",
DROP COLUMN IF EXISTS "description",
DROP COLUMN IF EXISTS "website",
DROP COLUMN IF EXISTS "logoUrl",
DROP COLUMN IF EXISTS "ranking",
DROP COLUMN IF EXISTS "isActive",
DROP COLUMN IF EXISTS "metadata";

-- AlterTable: Add new columns
ALTER TABLE "University" 
ADD COLUMN "slug" TEXT,
ADD COLUMN "shortName" TEXT,
ADD COLUMN "establishedYear" INTEGER,
ADD COLUMN "type" "UniversityType",
ADD COLUMN "website" TEXT,
ADD COLUMN "logo" TEXT,
ADD COLUMN "bannerImage" TEXT,
ADD COLUMN "status" "UniversityStatus" DEFAULT 'DRAFT',
ADD COLUMN "verifiedAt" TIMESTAMP(3);

-- Update existing records with default values
UPDATE "University" SET 
  "slug" = LOWER(REGEXP_REPLACE("name", '[^a-zA-Z0-9]+', '-', 'g')),
  "shortName" = "name",
  "establishedYear" = 2000,
  "type" = 'PRIVATE',
  "website" = 'https://example.com',
  "logo" = 'https://example.com/logo.png',
  "bannerImage" = 'https://example.com/banner.png',
  "status" = 'ACTIVE'
WHERE "slug" IS NULL;

-- Make columns NOT NULL after setting defaults
ALTER TABLE "University" 
ALTER COLUMN "slug" SET NOT NULL,
ALTER COLUMN "shortName" SET NOT NULL,
ALTER COLUMN "establishedYear" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "website" SET NOT NULL,
ALTER COLUMN "logo" SET NOT NULL,
ALTER COLUMN "bannerImage" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- CreateTable: UniversityLocation
CREATE TABLE "UniversityLocation" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "UniversityLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UniversityContact
CREATE TABLE "UniversityContact" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "admissionOfficeHours" TEXT NOT NULL,

    CONSTRAINT "UniversityContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UniversityAcademic
CREATE TABLE "UniversityAcademic" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "programs" TEXT[],
    "duration" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "specializations" TEXT[],
    "intakeMonths" TEXT[],
    "totalSeats" INTEGER NOT NULL,
    "governmentSeats" INTEGER NOT NULL,
    "managementSeats" INTEGER NOT NULL,
    "nriSeats" INTEGER NOT NULL,
    "curriculumType" TEXT,
    "clinicalTraining" TEXT,

    CONSTRAINT "UniversityAcademic_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UniversityRecognition
CREATE TABLE "UniversityRecognition" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "bodies" TEXT[],
    "ecfmgStatus" "ECFMGStatus" NOT NULL,
    "naacGrade" TEXT,
    "nbaAccredited" BOOLEAN NOT NULL DEFAULT false,
    "worldRank" INTEGER,
    "nationalRank" INTEGER,
    "accreditations" TEXT[],

    CONSTRAINT "UniversityRecognition_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UniversityFees
CREATE TABLE "UniversityFees" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "tuitionAnnual" DOUBLE PRECISION NOT NULL,
    "totalProgram" DOUBLE PRECISION NOT NULL,
    "hostelAnnual" DOUBLE PRECISION,
    "registration" DOUBLE PRECISION NOT NULL,
    "examination" DOUBLE PRECISION,
    "library" DOUBLE PRECISION,
    "otherFees" JSONB,
    "currency" TEXT NOT NULL,
    "scholarshipAvailable" BOOLEAN NOT NULL DEFAULT false,
    "scholarshipDetails" TEXT,
    "paymentSchedule" TEXT NOT NULL,
    "refundPolicy" TEXT NOT NULL,
    "feeHikePolicy" TEXT,

    CONSTRAINT "UniversityFees_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UniversityInfrastructure
CREATE TABLE "UniversityInfrastructure" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "hospitalBeds" INTEGER NOT NULL,
    "departments" INTEGER NOT NULL,
    "librarySize" TEXT,
    "hostelBoys" INTEGER NOT NULL,
    "hostelGirls" INTEGER NOT NULL,
    "laboratories" INTEGER NOT NULL,
    "campusArea" DOUBLE PRECISION,
    "facilities" TEXT[],
    "cafeteria" BOOLEAN NOT NULL DEFAULT false,
    "wifiCampus" BOOLEAN NOT NULL DEFAULT false,
    "transportation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UniversityInfrastructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UniversityAdmission
CREATE TABLE "UniversityAdmission" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "entranceExams" TEXT[],
    "minimumMarks" TEXT NOT NULL,
    "ageCriteria" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "requiredDocuments" TEXT[],
    "applicationDeadline" TIMESTAMP(3) NOT NULL,
    "applicationFee" DOUBLE PRECISION NOT NULL,
    "selectionProcess" TEXT NOT NULL,
    "reservationPolicy" TEXT,

    CONSTRAINT "UniversityAdmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UniversitySupport
CREATE TABLE "UniversitySupport" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "placementRate" DOUBLE PRECISION,
    "averagePackage" DOUBLE PRECISION,
    "topRecruiters" TEXT[],
    "alumniNetwork" BOOLEAN NOT NULL DEFAULT false,
    "alumniCount" INTEGER,
    "internationalStudentSupport" BOOLEAN NOT NULL DEFAULT false,
    "visaAssistance" BOOLEAN NOT NULL DEFAULT false,
    "languageSupport" TEXT[],
    "counselingServices" BOOLEAN NOT NULL DEFAULT false,
    "careerGuidance" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UniversitySupport_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UniversityContent
CREATE TABLE "UniversityContent" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "highlights" TEXT[],
    "whyChooseUs" TEXT,
    "gallery" TEXT[],
    "videoTour" TEXT,
    "virtualTour" TEXT,

    CONSTRAINT "UniversityContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UniversityAdmin
CREATE TABLE "UniversityAdmin" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "pocName" TEXT NOT NULL,
    "pocDesignation" TEXT NOT NULL,
    "pocEmail" TEXT NOT NULL,
    "pocPhone" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankBranch" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "gstNumber" TEXT,
    "panNumber" TEXT,
    "commission" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UniversityAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UniversityDocument
CREATE TABLE "UniversityDocument" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "type" "UniversityDocType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UniversityDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "University_slug_key" ON "University"("slug");

-- CreateIndex
CREATE INDEX "University_slug_idx" ON "University"("slug");

-- CreateIndex
CREATE INDEX "University_status_idx" ON "University"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityLocation_universityId_key" ON "UniversityLocation"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityContact_universityId_key" ON "UniversityContact"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityAcademic_universityId_key" ON "UniversityAcademic"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityRecognition_universityId_key" ON "UniversityRecognition"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityFees_universityId_key" ON "UniversityFees"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityInfrastructure_universityId_key" ON "UniversityInfrastructure"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityAdmission_universityId_key" ON "UniversityAdmission"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversitySupport_universityId_key" ON "UniversitySupport"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityContent_universityId_key" ON "UniversityContent"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityAdmin_universityId_key" ON "UniversityAdmin"("universityId");

-- CreateIndex
CREATE INDEX "UniversityDocument_universityId_idx" ON "UniversityDocument"("universityId");

-- CreateIndex
CREATE INDEX "UniversityDocument_type_idx" ON "UniversityDocument"("type");

-- AddForeignKey
ALTER TABLE "UniversityLocation" ADD CONSTRAINT "UniversityLocation_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityContact" ADD CONSTRAINT "UniversityContact_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityAcademic" ADD CONSTRAINT "UniversityAcademic_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityRecognition" ADD CONSTRAINT "UniversityRecognition_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityFees" ADD CONSTRAINT "UniversityFees_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityInfrastructure" ADD CONSTRAINT "UniversityInfrastructure_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityAdmission" ADD CONSTRAINT "UniversityAdmission_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversitySupport" ADD CONSTRAINT "UniversitySupport_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityContent" ADD CONSTRAINT "UniversityContent_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityAdmin" ADD CONSTRAINT "UniversityAdmin_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityDocument" ADD CONSTRAINT "UniversityDocument_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;
