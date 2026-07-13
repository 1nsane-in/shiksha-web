-- Check student
SELECT id, "applicationStatus", "currentStage" FROM "Student" WHERE id = 'e2a535f2-0d54-4d75-a81a-5ac2cb282f99';

-- Check applications
SELECT id, status, "selectedProgram", "submittedAt" FROM "UniversityApplication" WHERE "studentId" = 'e2a535f2-0d54-4d75-a81a-5ac2cb282f99';

-- Check related records counts
SELECT 'AdmissionLetter' as tbl, count(*) FROM "AdmissionLetter" WHERE "studentId" = 'e2a535f2-0d54-4d75-a81a-5ac2cb282f99'
UNION ALL
SELECT 'InvitationLetter', count(*) FROM "InvitationLetter" WHERE "studentId" = 'e2a535f2-0d54-4d75-a81a-5ac2cb282f99'
UNION ALL
SELECT 'Payment', count(*) FROM "Payment" p JOIN "UniversityApplication" ua ON p."applicationId" = ua.id WHERE ua."studentId" = 'e2a535f2-0d54-4d75-a81a-5ac2cb282f99'
UNION ALL
SELECT 'SupportTicket', count(*) FROM "SupportTicket" WHERE "applicationId" IN (SELECT id FROM "UniversityApplication" WHERE "studentId" = 'e2a535f2-0d54-4d75-a81a-5ac2cb282f99');
