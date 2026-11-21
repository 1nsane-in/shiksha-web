-- CreateEnum
CREATE TYPE "ExamResult" AS ENUM ('AWAITED', 'PASSED', 'FAILED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('SINGLE_CHOICE', 'MULTI_CHOICE', 'TRUE_FALSE', 'SUBJECTIVE');

-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'READY', 'ATTENDED', 'ABSENT', 'COMPLETED', 'INTERRUPTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('READY', 'ACTIVE', 'COMPLETED', 'INTERRUPTED', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "ProctorEventType" AS ENUM ('TAB_SWITCH', 'FACE_MISSING', 'MULTIPLE_FACES', 'GAZE_AWAY', 'AUDIO_DETECTED', 'SCREEN_CAPTURE_FAILED', 'CONNECTIVITY_LOST', 'CONNECTIVITY_RESTORED', 'DEVTOOLS_OPENED', 'RIGHT_CLICK', 'COPY_PASTE', 'FULLSCREEN_EXITED', 'CAMERA_DISABLED', 'MIC_DISABLED');

-- CreateEnum
CREATE TYPE "ProctorSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ExamScoreStatus" AS ENUM ('PASS', 'FAIL');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "CourseItemStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PlatformEnrollmentStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UniversityRequestStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ADDED');

-- CreateEnum
CREATE TYPE "VisaApplicationStatus" AS ENUM ('DRAFT', 'DOCUMENTS_PENDING', 'SUBMITTED', 'PROCESSING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "UniversityApplication" DROP CONSTRAINT "UniversityApplication_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UniversityApplication" DROP CONSTRAINT "UniversityApplication_universityId_fkey";

-- DropIndex
DROP INDEX "VisaChecklist_country_idx";

-- AlterTable
ALTER TABLE "AdmissionLetter" ADD COLUMN     "applicationId" TEXT;

-- AlterTable
ALTER TABLE "InvitationLetter" ADD COLUMN     "applicationId" TEXT;

-- AlterTable
ALTER TABLE "OtpVerification" ADD COLUMN     "phone" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "passportExpiry" TIMESTAMP(3),
ADD COLUMN     "passportIssueCountry" TEXT,
ADD COLUMN     "passportIssueDate" TIMESTAMP(3),
ADD COLUMN     "passportNumber" TEXT;

-- AlterTable
ALTER TABLE "SupportTicket" ADD COLUMN     "applicationId" TEXT;

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "brochureUrl" TEXT,
ALTER COLUMN "logo" DROP NOT NULL,
ALTER COLUMN "bannerImage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UniversityAdmin" ALTER COLUMN "pocPhone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UniversityAdmission" ADD COLUMN     "programEligibility" JSONB,
ALTER COLUMN "minimumMarks" DROP NOT NULL,
ALTER COLUMN "eligibility" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UniversityApplication" DROP COLUMN "appliedAt",
DROP COLUMN "assignedAgentId",
DROP COLUMN "matchScore",
DROP COLUMN "recommendationReason",
DROP COLUMN "recommendedBy",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "formData" JSONB,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "selectedProgram" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "courseId" DROP NOT NULL,
ALTER COLUMN "universityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UniversityCourse" ADD COLUMN     "courseId" TEXT;

-- AlterTable
ALTER TABLE "UniversityFees" ALTER COLUMN "tuitionAnnual" DROP NOT NULL,
ALTER COLUMN "totalProgram" DROP NOT NULL,
ALTER COLUMN "registration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ApplicationTimeline" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "event" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamRecord" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "examDate" TIMESTAMP(3),
    "examSubject" TEXT,
    "examCenter" TEXT,
    "result" "ExamResult",
    "resultDeclaredAt" TIMESTAMP(3),
    "resultRemarks" TEXT,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "neetScore" INTEGER,
    "state" TEXT,
    "country" TEXT,
    "preferredUniversity" TEXT,
    "preferredIntake" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "prerequisites" TEXT[],
    "department" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "maxStudents" INTEGER NOT NULL,
    "deliveryMethod" TEXT NOT NULL,
    "courseTypes" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "createdBy" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dateWindowStart" TIMESTAMP(3) NOT NULL,
    "dateWindowEnd" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "totalMarks" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "passingPercentage" DECIMAL(5,2) NOT NULL DEFAULT 50.00,
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "resultTiming" TEXT NOT NULL DEFAULT 'IMMEDIATE',
    "resultDate" TIMESTAMP(3),
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT true,
    "shuffleOptions" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamProctoringConfig" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "aiProctoringEnabled" BOOLEAN NOT NULL DEFAULT true,
    "webcamRequired" BOOLEAN NOT NULL DEFAULT true,
    "microphoneRequired" BOOLEAN NOT NULL DEFAULT true,
    "screenRecordingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "faceDetectionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "gazeTrackingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "tabSwitchWarnings" INTEGER NOT NULL DEFAULT 3,
    "autoSubmitOnViolation" BOOLEAN NOT NULL DEFAULT false,
    "connectivityGraceMinutes" INTEGER NOT NULL DEFAULT 2,
    "preventCopyPaste" BOOLEAN NOT NULL DEFAULT true,
    "preventRightClick" BOOLEAN NOT NULL DEFAULT true,
    "preventDevTools" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamProctoringConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamQuestion" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionImageUrl" TEXT,
    "marks" DECIMAL(6,2) NOT NULL,
    "negativeMarks" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "difficulty" "QuestionDifficulty",
    "topic" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamQuestionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamQuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSlot" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "slotDate" DATE NOT NULL,
    "slotTime" TIME NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "maxStudents" INTEGER NOT NULL,
    "registeredCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "ExamSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamRegistration" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "slotId" TEXT,
    "studentId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "idVerified" BOOLEAN NOT NULL DEFAULT false,
    "idVerificationPhotoUrl" TEXT,
    "feePaid" BOOLEAN NOT NULL DEFAULT false,
    "feeAmount" DECIMAL(10,2),
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSession" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "actualDuration" INTEGER,
    "status" "SessionStatus" NOT NULL DEFAULT 'READY',
    "ipAddress" TEXT,
    "deviceInfo" JSONB,
    "browserInfo" JSONB,
    "connectivityIssues" INTEGER NOT NULL DEFAULT 0,
    "violationCount" INTEGER NOT NULL DEFAULT 0,
    "warningCount" INTEGER NOT NULL DEFAULT 0,
    "autoSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResponse" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOption" INTEGER,
    "textAnswer" TEXT,
    "isCorrect" BOOLEAN,
    "marksObtained" DECIMAL(6,2),
    "timeTaken" INTEGER,
    "flaggedForReview" BOOLEAN NOT NULL DEFAULT false,
    "autoSaved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProctorLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventType" "ProctorEventType" NOT NULL,
    "severity" "ProctorSeverity" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "screenshotUrl" TEXT,
    "details" JSONB,
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "isViolation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProctorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamScore" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "sessionId" TEXT,
    "totalMarks" DECIMAL(6,2) NOT NULL,
    "obtainedMarks" DECIMAL(6,2) NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "rank" INTEGER,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "wrongAnswers" INTEGER NOT NULL DEFAULT 0,
    "unattempted" INTEGER NOT NULL DEFAULT 0,
    "timeTaken" INTEGER,
    "status" "ExamScoreStatus" NOT NULL,
    "certificateUrl" TEXT,
    "visibleToStudent" BOOLEAN NOT NULL DEFAULT false,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "category" TEXT NOT NULL,
    "smallDescription" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "CourseItemStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "platform_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_course_universities" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_course_universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_course_modules" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_course_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_course_enrollments" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "PlatformEnrollmentStatus" NOT NULL DEFAULT 'PENDING',
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "platform_course_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityRequest" (
    "id" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "website" TEXT,
    "type" TEXT NOT NULL,
    "programs" TEXT[],
    "otherPrograms" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "additionalInfo" TEXT,
    "status" "UniversityRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaApplication" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "applicationId" TEXT,
    "visaCenterId" TEXT,
    "checklistId" TEXT,
    "status" "VisaApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "passportNumber" TEXT,
    "passportExpiry" TIMESTAMP(3),
    "visaType" TEXT,
    "submissionDate" TIMESTAMP(3),
    "appointmentDate" TIMESTAMP(3),
    "documentUrls" TEXT[],
    "remarks" TEXT,
    "notes" TEXT,
    "submittedAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),
    "decidedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicationTimeline_applicationId_stage_idx" ON "ApplicationTimeline"("applicationId", "stage");

-- CreateIndex
CREATE INDEX "ApplicationTimeline_studentId_idx" ON "ApplicationTimeline"("studentId");

-- CreateIndex
CREATE INDEX "ApplicationTimeline_occurredAt_idx" ON "ApplicationTimeline"("occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExamRecord_applicationId_key" ON "ExamRecord"("applicationId");

-- CreateIndex
CREATE INDEX "ExamRecord_studentId_idx" ON "ExamRecord"("studentId");

-- CreateIndex
CREATE INDEX "ExamRecord_applicationId_idx" ON "ExamRecord"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE INDEX "Exam_universityId_idx" ON "Exam"("universityId");

-- CreateIndex
CREATE INDEX "Exam_status_idx" ON "Exam"("status");

-- CreateIndex
CREATE INDEX "Exam_createdBy_idx" ON "Exam"("createdBy");

-- CreateIndex
CREATE INDEX "Exam_dateWindowStart_dateWindowEnd_idx" ON "Exam"("dateWindowStart", "dateWindowEnd");

-- CreateIndex
CREATE UNIQUE INDEX "ExamProctoringConfig_examId_key" ON "ExamProctoringConfig"("examId");

-- CreateIndex
CREATE INDEX "ExamProctoringConfig_examId_idx" ON "ExamProctoringConfig"("examId");

-- CreateIndex
CREATE INDEX "ExamQuestion_examId_idx" ON "ExamQuestion"("examId");

-- CreateIndex
CREATE INDEX "ExamQuestion_examId_type_idx" ON "ExamQuestion"("examId", "type");

-- CreateIndex
CREATE INDEX "ExamQuestion_examId_difficulty_idx" ON "ExamQuestion"("examId", "difficulty");

-- CreateIndex
CREATE INDEX "ExamQuestion_examId_topic_idx" ON "ExamQuestion"("examId", "topic");

-- CreateIndex
CREATE UNIQUE INDEX "ExamQuestion_examId_orderIndex_key" ON "ExamQuestion"("examId", "orderIndex");

-- CreateIndex
CREATE INDEX "ExamQuestionOption_questionId_idx" ON "ExamQuestionOption"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamQuestionOption_questionId_orderIndex_key" ON "ExamQuestionOption"("questionId", "orderIndex");

-- CreateIndex
CREATE INDEX "ExamSlot_examId_idx" ON "ExamSlot"("examId");

-- CreateIndex
CREATE INDEX "ExamSlot_examId_status_idx" ON "ExamSlot"("examId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ExamRegistration_applicationId_key" ON "ExamRegistration"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamRegistration_registrationNumber_key" ON "ExamRegistration"("registrationNumber");

-- CreateIndex
CREATE INDEX "ExamRegistration_examId_idx" ON "ExamRegistration"("examId");

-- CreateIndex
CREATE INDEX "ExamRegistration_studentId_idx" ON "ExamRegistration"("studentId");

-- CreateIndex
CREATE INDEX "ExamRegistration_applicationId_idx" ON "ExamRegistration"("applicationId");

-- CreateIndex
CREATE INDEX "ExamRegistration_status_idx" ON "ExamRegistration"("status");

-- CreateIndex
CREATE INDEX "ExamSession_registrationId_idx" ON "ExamSession"("registrationId");

-- CreateIndex
CREATE INDEX "ExamSession_status_idx" ON "ExamSession"("status");

-- CreateIndex
CREATE INDEX "ExamResponse_sessionId_idx" ON "ExamResponse"("sessionId");

-- CreateIndex
CREATE INDEX "ExamResponse_questionId_idx" ON "ExamResponse"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResponse_sessionId_questionId_key" ON "ExamResponse"("sessionId", "questionId");

-- CreateIndex
CREATE INDEX "ProctorLog_sessionId_idx" ON "ProctorLog"("sessionId");

-- CreateIndex
CREATE INDEX "ProctorLog_eventType_idx" ON "ProctorLog"("eventType");

-- CreateIndex
CREATE INDEX "ProctorLog_sessionId_eventType_idx" ON "ProctorLog"("sessionId", "eventType");

-- CreateIndex
CREATE UNIQUE INDEX "ExamScore_registrationId_key" ON "ExamScore"("registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamScore_sessionId_key" ON "ExamScore"("sessionId");

-- CreateIndex
CREATE INDEX "ExamScore_status_idx" ON "ExamScore"("status");

-- CreateIndex
CREATE INDEX "ExamScore_visibleToStudent_idx" ON "ExamScore"("visibleToStudent");

-- CreateIndex
CREATE UNIQUE INDEX "platform_courses_slug_key" ON "platform_courses"("slug");

-- CreateIndex
CREATE INDEX "platform_courses_authorId_idx" ON "platform_courses"("authorId");

-- CreateIndex
CREATE INDEX "platform_courses_status_idx" ON "platform_courses"("status");

-- CreateIndex
CREATE INDEX "platform_courses_level_idx" ON "platform_courses"("level");

-- CreateIndex
CREATE INDEX "platform_courses_category_idx" ON "platform_courses"("category");

-- CreateIndex
CREATE INDEX "platform_course_universities_course_id_idx" ON "platform_course_universities"("course_id");

-- CreateIndex
CREATE INDEX "platform_course_universities_university_id_idx" ON "platform_course_universities"("university_id");

-- CreateIndex
CREATE INDEX "platform_course_modules_course_id_idx" ON "platform_course_modules"("course_id");

-- CreateIndex
CREATE INDEX "platform_course_enrollments_course_id_idx" ON "platform_course_enrollments"("course_id");

-- CreateIndex
CREATE INDEX "platform_course_enrollments_user_id_idx" ON "platform_course_enrollments"("user_id");

-- CreateIndex
CREATE INDEX "Section_courseId_idx" ON "Section"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Section_courseId_title_key" ON "Section"("courseId", "title");

-- CreateIndex
CREATE INDEX "UniversityRequest_status_idx" ON "UniversityRequest"("status");

-- CreateIndex
CREATE INDEX "UniversityRequest_createdAt_idx" ON "UniversityRequest"("createdAt");

-- CreateIndex
CREATE INDEX "DeviceToken_userId_idx" ON "DeviceToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_userId_token_key" ON "DeviceToken"("userId", "token");

-- CreateIndex
CREATE INDEX "VisaApplication_studentId_idx" ON "VisaApplication"("studentId");

-- CreateIndex
CREATE INDEX "VisaApplication_applicationId_idx" ON "VisaApplication"("applicationId");

-- CreateIndex
CREATE INDEX "VisaApplication_status_idx" ON "VisaApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AdmissionLetter_applicationId_key" ON "AdmissionLetter"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationLetter_applicationId_key" ON "InvitationLetter"("applicationId");

-- CreateIndex
CREATE INDEX "OtpVerification_phone_idx" ON "OtpVerification"("phone");

-- CreateIndex
CREATE INDEX "Payment_studentId_status_createdAt_idx" ON "Payment"("studentId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_status_createdAt_idx" ON "Payment"("status", "createdAt");

-- CreateIndex
CREATE INDEX "StudentDocument_studentId_status_idx" ON "StudentDocument"("studentId", "status");

-- CreateIndex
CREATE INDEX "StudentDocument_status_createdAt_idx" ON "StudentDocument"("status", "createdAt");

-- CreateIndex
CREATE INDEX "SupportTicket_applicationId_idx" ON "SupportTicket"("applicationId");

-- CreateIndex
CREATE INDEX "UniversityApplication_universityId_idx" ON "UniversityApplication"("universityId");

-- CreateIndex
CREATE INDEX "UniversityApplication_status_createdAt_idx" ON "UniversityApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "UniversityApplication_studentId_status_idx" ON "UniversityApplication"("studentId", "status");

-- CreateIndex
CREATE INDEX "UniversityLocation_country_idx" ON "UniversityLocation"("country");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "UniversityApplication" ADD CONSTRAINT "UniversityApplication_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "UniversityCourse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityApplication" ADD CONSTRAINT "UniversityApplication_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationTimeline" ADD CONSTRAINT "ApplicationTimeline_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "UniversityApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationTimeline" ADD CONSTRAINT "ApplicationTimeline_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionLetter" ADD CONSTRAINT "AdmissionLetter_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "UniversityApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRecord" ADD CONSTRAINT "ExamRecord_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "UniversityApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRecord" ADD CONSTRAINT "ExamRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationLetter" ADD CONSTRAINT "InvitationLetter_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "UniversityApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamProctoringConfig" ADD CONSTRAINT "ExamProctoringConfig_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamQuestion" ADD CONSTRAINT "ExamQuestion_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamQuestionOption" ADD CONSTRAINT "ExamQuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ExamQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSlot" ADD CONSTRAINT "ExamSlot_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRegistration" ADD CONSTRAINT "ExamRegistration_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRegistration" ADD CONSTRAINT "ExamRegistration_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "ExamSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRegistration" ADD CONSTRAINT "ExamRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRegistration" ADD CONSTRAINT "ExamRegistration_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "UniversityApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "ExamRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResponse" ADD CONSTRAINT "ExamResponse_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ExamSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResponse" ADD CONSTRAINT "ExamResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ExamQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProctorLog" ADD CONSTRAINT "ProctorLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ExamSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProctorLog" ADD CONSTRAINT "ProctorLog_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamScore" ADD CONSTRAINT "ExamScore_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "ExamRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamScore" ADD CONSTRAINT "ExamScore_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ExamSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_courses" ADD CONSTRAINT "platform_courses_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_course_universities" ADD CONSTRAINT "platform_course_universities_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "platform_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_course_universities" ADD CONSTRAINT "platform_course_universities_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_course_modules" ADD CONSTRAINT "platform_course_modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "platform_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_course_enrollments" ADD CONSTRAINT "platform_course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "platform_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_course_enrollments" ADD CONSTRAINT "platform_course_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "UniversityApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityCourse" ADD CONSTRAINT "UniversityCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceToken" ADD CONSTRAINT "DeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaApplication" ADD CONSTRAINT "VisaApplication_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "VisaChecklist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaApplication" ADD CONSTRAINT "VisaApplication_visaCenterId_fkey" FOREIGN KEY ("visaCenterId") REFERENCES "VisaCenter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
