import { PrismaClient, UniversityStatus, UniversityType } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

// ponytail: hardcoded for seed script - reads from .env manually
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(__dirname, '../../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
const connectionString = dbUrlMatch ? dbUrlMatch[1] : process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL not found in .env or environment');
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seedUniversities() {
  console.log('Seeding universities...');

  const universities = [
    {
      name: 'All India Institute of Medical Sciences',
      shortName: 'AIIMS Delhi',
      slug: 'aiims-delhi',
      establishedYear: 1956,
      type: UniversityType.GOVERNMENT,
      website: 'https://aiims.edu',
      status: UniversityStatus.ACTIVE,
      location: {
        create: {
          country: 'India',
          state: 'Delhi',
          city: 'New Delhi',
          address: 'Ansari Nagar',
        },
      },
      contact: {
        create: {
          email: 'info@aiims.edu',
          phone: '+91-11-26588500',
          admissionOfficeHours: 'Mon-Fri 9AM-5PM',
        },
      },
    },
    {
      name: 'Christian Medical College',
      shortName: 'CMC Vellore',
      slug: 'cmc-vellore',
      establishedYear: 1900,
      type: UniversityType.PRIVATE,
      website: 'https://cmcvellore.ac.in',
      status: UniversityStatus.ACTIVE,
      location: {
        create: {
          country: 'India',
          state: 'Tamil Nadu',
          city: 'Vellore',
          address: 'Ida Scudder Road',
        },
      },
      contact: {
        create: {
          email: 'info@cmcvellore.ac.in',
          phone: '+91-416-228-1000',
          admissionOfficeHours: 'Mon-Sat 8AM-4PM',
        },
      },
    },
    {
      name: 'Maulana Azad Medical College',
      shortName: 'MAMC',
      slug: 'mamc-delhi',
      establishedYear: 1958,
      type: UniversityType.GOVERNMENT,
      website: 'https://mamc.ac.in',
      status: UniversityStatus.ACTIVE,
      location: {
        create: {
          country: 'India',
          state: 'Delhi',
          city: 'New Delhi',
          address: 'Bahadur Shah Zafar Marg',
        },
      },
      contact: {
        create: {
          email: 'info@mamc.ac.in',
          phone: '+91-11-2323-9285',
          admissionOfficeHours: 'Mon-Fri 9AM-6PM',
        },
      },
    },
  ];

  for (const uni of universities) {
    await prisma.university.upsert({
      where: { slug: uni.slug },
      update: {},
      create: uni,
    });
  }

  console.log(`Seeded ${universities.length} universities`);
}

seedUniversities()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
