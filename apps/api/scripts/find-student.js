const { neon } = require('@neondatabase/serverless');

const url = process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL env var required'); process.exit(1); }

const sql = neon(url);

async function main() {
  const userId = 'e2a535f2-0d54-4d75-a81a-5ac2cb282f99';

  // Get student id
  const students = await sql`SELECT id, "applicationStatus", "currentStage" FROM "Student" WHERE "userId" = ${userId}`;
  const studentId = students[0]?.id;
  console.log('Student ID:', studentId);
  console.log('Student status:', students[0]?.applicationStatus);

  if (!studentId) { console.log('No student found'); return; }

  // Get applications
  const apps = await sql`SELECT id, status, "selectedProgram", "universityId" FROM "UniversityApplication" WHERE "studentId" = ${studentId}`;
  console.log('Applications:', JSON.stringify(apps, null, 2));

  if (apps.length === 0) { console.log('No applications'); return; }

  // Check related records for each application
  for (const app of apps) {
    console.log(`\n--- Application ${app.id} ---`);
    
    const al = await sql`SELECT id FROM "AdmissionLetter" WHERE "applicationId" = ${app.id}`;
    console.log('AdmissionLetters:', al.length);

    const il = await sql`SELECT id FROM "InvitationLetter" WHERE "applicationId" = ${app.id}`;
    console.log('InvitationLetters:', il.length);

    const pays = await sql`SELECT id, amount, status FROM "Payment" WHERE "applicationId" = ${app.id}`;
    console.log('Payments:', JSON.stringify(pays));

    const tix = await sql`SELECT id FROM "SupportTicket" WHERE "applicationId" = ${app.id}`;
    console.log('SupportTickets:', tix.length);

    const tl = await sql`SELECT id FROM "ApplicationTimeline" WHERE "applicationId" = ${app.id}`;
    console.log('Timeline events:', tl.length);

    const exam = await sql`SELECT id FROM "ExamRecord" WHERE "applicationId" = ${app.id}`;
    console.log('ExamRecords:', exam.length);
  }
}

main().catch(console.error);
