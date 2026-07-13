import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL env var required');
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const studentId = 'e2a535f2-0d54-4d75-a81a-5ac2cb282f99';

  // Check what exists
  const apps = await prisma.universityApplication.findMany({
    where: { studentId },
    select: { id: true, status: true, selectedProgram: true, createdAt: true },
  });
  console.log('Applications:', JSON.stringify(apps, null, 2));

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true, applicationStatus: true, currentStage: true },
  });
  console.log('Student:', JSON.stringify(student, null, 2));

  if (apps.length === 0) {
    console.log('No applications found. Nothing to delete.');
    return;
  }

  const appIds = apps.map(a => a.id);
  console.log(`\nWill delete ${appIds.length} application(s) and all related records.`);
  console.log('Run with DELETE=true env var to actually delete.');

  if (process.env.DELETE === 'true') {
    console.log('\n--- DELETING ---');
    for (const appId of appIds) {
      // 1. AdmissionLetter
      await prisma.admissionLetter.deleteMany({ where: { applicationId: appId } });
      // 2. InvitationLetter
      await prisma.invitationLetter.deleteMany({ where: { applicationId: appId } });
      // 3. SupportTicket messages + tickets
      const tickets = await prisma.supportTicket.findMany({ where: { applicationId: appId } });
      for (const t of tickets) {
        await prisma.supportTicketMessage.deleteMany({ where: { ticketId: t.id } });
        await prisma.supportTicket.delete({ where: { id: t.id } });
      }
      // 4. Application (cascades Payment, ApplicationTimeline, ExamRecord)
      await prisma.universityApplication.delete({ where: { id: appId } });
      console.log(`  Deleted application ${appId}`);
    }
    // Reset student
    await prisma.student.update({
      where: { id: studentId },
      data: { applicationStatus: 'NOT_STARTED', currentStage: 1 },
    });
    console.log('  Reset student to NOT_STARTED');
    console.log('Done.');
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
