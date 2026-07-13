const { neon } = require('@neondatabase/serverless');

const url = process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL env var required'); process.exit(1); }

const sql = neon(url);

async function main() {
  const id = 'e2a535f2-0d54-4d75-a81a-5ac2cb282f99';

  const apps = await sql`SELECT id, status, "selectedProgram", "submittedAt" FROM "UniversityApplication" WHERE "studentId" = ${id}`;
  console.log('Applications:', JSON.stringify(apps, null, 2));

  const student = await sql`SELECT id, "applicationStatus", "currentStage" FROM "Student" WHERE id = ${id}`;
  console.log('Student:', JSON.stringify(student, null, 2));

  const counts = await sql`
    SELECT 'AdmissionLetter' as tbl, count(*)::int FROM "AdmissionLetter" WHERE "studentId" = ${id}
    UNION ALL SELECT 'InvitationLetter', count(*)::int FROM "InvitationLetter" WHERE "studentId" = ${id}
    UNION ALL SELECT 'Payment', count(*)::int FROM "Payment" p JOIN "UniversityApplication" ua ON p."applicationId" = ua.id WHERE ua."studentId" = ${id}
    UNION ALL SELECT 'SupportTicket', count(*)::int FROM "SupportTicket" WHERE "applicationId" IN (SELECT id FROM "UniversityApplication" WHERE "studentId" = ${id})
  `;
  console.log('Related counts:', JSON.stringify(counts, null, 2));
}

main().catch(console.error);
