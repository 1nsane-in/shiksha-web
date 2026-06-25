-- CreateEnum
CREATE TYPE "ParentLinkStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable: ParentStudent (join table)
CREATE TABLE "ParentStudent" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "relation" TEXT,
    "status" "ParentLinkStatus" NOT NULL DEFAULT 'PENDING',
    "invitedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ParentInvite (track invite links)
CREATE TABLE "ParentInvite" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "relation" TEXT,
    "code" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParentInvite_pkey" PRIMARY KEY ("id")
);

-- AlterTable: Add familyCode to Student
ALTER TABLE "Student" ADD COLUMN "familyCode" TEXT;

-- CreateIndexes
CREATE UNIQUE INDEX "ParentStudent_parentId_studentId_key" ON "ParentStudent"("parentId", "studentId");
CREATE INDEX "ParentStudent_parentId_idx" ON "ParentStudent"("parentId");
CREATE INDEX "ParentStudent_studentId_idx" ON "ParentStudent"("studentId");
CREATE INDEX "ParentStudent_status_idx" ON "ParentStudent"("status");
CREATE UNIQUE INDEX "ParentInvite_code_key" ON "ParentInvite"("code");
CREATE INDEX "ParentInvite_code_idx" ON "ParentInvite"("code");
CREATE INDEX "ParentInvite_studentId_idx" ON "ParentInvite"("studentId");
CREATE UNIQUE INDEX "Student_familyCode_key" ON "Student"("familyCode");

-- AddForeignKey: ParentStudent -> Parent
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: ParentStudent -> Student
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: ParentInvite -> Student
ALTER TABLE "ParentInvite" ADD CONSTRAINT "ParentInvite_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
