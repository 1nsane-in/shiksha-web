-- Delete application (cascades to: Payment, ApplicationTimeline, ExamRecord)
DELETE FROM "UniversityApplication" WHERE id = 'f3f9eaa0-400d-4597-8ff5-568e6c4d7e98';

-- Reset student
UPDATE "Student" SET "applicationStatus" = 'NOT_STARTED', "currentStage" = 1 WHERE id = '76b0a355-b1ec-4b36-8ae1-17fd3297d6a2';
