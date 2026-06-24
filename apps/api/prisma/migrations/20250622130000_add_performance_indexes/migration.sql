-- Migration: Add performance indexes for common query patterns
-- Created: 2026-06-22

-- Student performance indexes
CREATE INDEX IF NOT EXISTS "idx_student_status_stage" ON "Student"("applicationStatus", "currentStage");
CREATE INDEX IF NOT EXISTS "idx_student_user_status" ON "Student"("userId", "applicationStatus");
CREATE INDEX IF NOT EXISTS "idx_student_country" ON "Student"("country");
CREATE INDEX IF NOT EXISTS "idx_student_created" ON "Student"("createdAt");

-- University performance indexes
CREATE INDEX IF NOT EXISTS "idx_university_status_created" ON "University"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "idx_university_type_status" ON "University"("type", "status");
CREATE INDEX IF NOT EXISTS "idx_university_location_country" ON "UniversityLocation"("country");
CREATE INDEX IF NOT EXISTS "idx_university_location_state" ON "UniversityLocation"("state");

-- Payment performance indexes
CREATE INDEX IF NOT EXISTS "idx_payment_status_date" ON "Payment"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "idx_payment_student_status" ON "Payment"("studentId", "status");
CREATE INDEX IF NOT EXISTS "idx_payment_application" ON "Payment"("applicationId");

-- Application performance indexes
CREATE INDEX IF NOT EXISTS "idx_application_student_status" ON "UniversityApplication"("studentId", "status");
CREATE INDEX IF NOT EXISTS "idx_application_university" ON "UniversityApplication"("universityId");
CREATE INDEX IF NOT EXISTS "idx_application_stage" ON "UniversityApplication"("currentStage");
CREATE INDEX IF NOT EXISTS "idx_application_status_created" ON "UniversityApplication"("status", "createdAt");

-- Document performance indexes
CREATE INDEX IF NOT EXISTS "idx_document_student_type" ON "StudentDocument"("studentId", "documentTypeId");
CREATE INDEX IF NOT EXISTS "idx_document_status" ON "StudentDocument"("status", "createdAt");

-- User performance indexes
CREATE INDEX IF NOT EXISTS "idx_user_email_active" ON "User"("email", "isActive");
CREATE INDEX IF NOT EXISTS "idx_user_role" ON "User"("role");

-- Notification performance indexes
CREATE INDEX IF NOT EXISTS "idx_notification_user_unread" ON "Notification"("userId", "isRead", "createdAt");

-- Audit log performance indexes
CREATE INDEX IF NOT EXISTS "idx_audit_entity" ON "AuditLog"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "idx_audit_user_created" ON "AuditLog"("userId", "createdAt");

-- GIN index for JSON metadata (StageHistory)
CREATE INDEX IF NOT EXISTS "idx_stage_history_metadata_gin" ON "StageHistory" USING GIN ("metadata");

-- Full-text search index for University
CREATE INDEX IF NOT EXISTS "idx_university_name_fts" ON "University" 
  USING gin(to_tsvector('english', "name" || ' ' || COALESCE("shortName", '')));

-- Verify indexes were created
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename IN ('Student', 'University', 'Payment', 'UniversityApplication', 'StudentDocument');
