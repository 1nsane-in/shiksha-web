import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const documentTypes = [
  // Stage 1 — Initial Application
  {
    name: 'Aadhaar Card (Front)',
    code: 'aadhaar-front',
    description: 'Front side — contains photo, DOB, Aadhaar number',
    requiredForStage: 1,
  },
  {
    name: 'Aadhaar Card (Back)',
    code: 'aadhaar-back',
    description: 'Back side — contains address',
    requiredForStage: 1,
  },
  {
    name: 'PAN Card (Front)',
    code: 'pan-front',
    description: 'Front side — contains photo, PAN number, name',
    requiredForStage: 1,
  },
  {
    name: 'PAN Card (Back)',
    code: 'pan-back',
    description: 'Back side',
    requiredForStage: 1,
  },
  {
    name: '10th Marksheet',
    code: 'tenth',
    description: 'Class X marksheet / equivalent',
    requiredForStage: 1,
  },
  {
    name: '12th Marksheet',
    code: 'twelfth',
    description: 'Class XII marksheet with PCB marks',
    requiredForStage: 1,
  },
  {
    name: 'NEET Scorecard',
    code: 'neet',
    description: 'NEET UG admit card or scorecard',
    requiredForStage: 1,
  },
  {
    name: 'Passport (Photo Page)',
    code: 'passport-front',
    description: 'Front page — contains photo, passport number, personal details',
    requiredForStage: 1,
  },
  {
    name: 'Passport (Back Page)',
    code: 'passport-back',
    description: 'Back page — contains spouse, address, emergency info',
    requiredForStage: 1,
  },

  // Stage 3 — Admission Letter (future)
  {
    name: 'School Leaving Certificate',
    code: 'school-leaving',
    description: 'Transfer / School leaving certificate from last institution',
    requiredForStage: 3,
  },
  {
    name: 'Character Certificate',
    code: 'character',
    description: 'Character certificate from last institution',
    requiredForStage: 3,
  },
  {
    name: 'Medical Fitness Certificate',
    code: 'medical-fitness',
    description: 'Includes HIV, Hepatitis B, Chest X-ray reports',
    requiredForStage: 3,
  },
  {
    name: 'Birth Certificate',
    code: 'birth',
    description: 'Birth certificate or equivalent age proof',
    requiredForStage: 3,
  },
  {
    name: 'Migration Certificate',
    code: 'migration',
    description: 'Migration certificate from board/university',
    requiredForStage: 3,
  },

  // Stage 4 — Invitation Letter (future)
  {
    name: 'Bank Statement (6 Months)',
    code: 'bank-statement',
    description: 'Last 6 months bank statement of parent/guardian',
    requiredForStage: 4,
  },
  {
    name: 'Affidavit of Financial Support',
    code: 'affidavit-support',
    description: 'Notarised affidavit confirming financial sponsorship',
    requiredForStage: 4,
  },
  {
    name: 'Tuition Fee Receipt',
    code: 'fee-receipt',
    description: 'Proof of tuition fee payment to university',
    requiredForStage: 4,
  },

  // Stage 5 — Visa Support (future)
  {
    name: 'Travel Insurance',
    code: 'travel-insurance',
    description: 'Valid travel medical insurance policy',
    requiredForStage: 5,
  },
  {
    name: 'Flight Itinerary',
    code: 'flight-itinerary',
    description: 'Confirmed or provisional flight booking',
    requiredForStage: 5,
  },
  {
    name: 'Visa Application Form',
    code: 'visa-form',
    description: 'Completed visa application form',
    requiredForStage: 5,
  },
  {
    name: 'Accommodation Proof',
    code: 'accommodation',
    description: 'Hostel booking or accommodation letter from university',
    requiredForStage: 5,
  },
];

async function seedDocumentTypes() {
  console.log('🌱 Seeding document types...\n');

  let created = 0;
  let skipped = 0;

  for (const doc of documentTypes) {
    const existing = await prisma.documentType.findUnique({
      where: { code: doc.code },
    });

    if (existing) {
      console.log(`  ⏭️  ${doc.code} — already exists`);
      skipped++;
      continue;
    }

    await prisma.documentType.create({ data: doc });
    console.log(`  ✅ ${doc.code} — ${doc.name}`);
    created++;
  }

  console.log(`\n📊 Summary: ${created} created, ${skipped} skipped`);
  console.log('✅ Document types seeded successfully!');
}

seedDocumentTypes()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
