/**
 * READ-ONLY from prod. Writes to dev only.
 * Uses environment variable swap to connect Prisma to dev DB.
 * NEVER writes to prod.
 */
import { Pool } from '@neondatabase/serverless';

const PROD_URL = 'postgresql://neondb_owner:npg_jtc2nQNFZ3ET@ep-lingering-recipe-aoofy9hu-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function main() {
  // Prod: read-only
  const prod = new Pool({ connectionString: PROD_URL });
  const prodClient = await prod.connect();

  try {
    // Read all university data from prod
    const [uniRows, locRows, contactRows, acadRows, admRows, contRows, infraRows, suppRows] = await Promise.all([
      prodClient.query(`SELECT * FROM "University"`),
      prodClient.query(`SELECT * FROM "UniversityLocation"`),
      prodClient.query(`SELECT * FROM "UniversityContact"`),
      prodClient.query(`SELECT * FROM "UniversityAcademic"`),
      prodClient.query(`SELECT * FROM "UniversityAdmission"`),
      prodClient.query(`SELECT * FROM "UniversityContent"`),
      prodClient.query(`SELECT * FROM "UniversityInfrastructure"`),
      prodClient.query(`SELECT * FROM "UniversitySupport"`),
    ]);

    console.log(`Prod data: University=${uniRows.rows.length}, Location=${locRows.rows.length}, Contact=${contactRows.rows.length}, Academic=${acadRows.rows.length}, Admission=${admRows.rows.length}, Content=${contRows.rows.length}, Infrastructure=${infraRows.rows.length}, Support=${suppRows.rows.length}`);

    if (uniRows.rows.length === 0) {
      console.log('No university data in prod.');
      return;
    }

    // Dev: use Prisma through direct pg (avoid pgbouncer for typed inserts)
    const DEV_DIRECT = 'postgresql://neondb_owner:npg_K0dEMy5hwlHL@ep-silent-morning-aogyq67b.c-2.ap-southeast-1.aws.neon.tech/shiksha?sslmode=require';
    const dev = new Pool({ connectionString: DEV_DIRECT });
    const devClient = await dev.connect();

    try {
      // Clear existing dev data (FK order: children first)
      await devClient.query(`DELETE FROM "UniversitySupport"`);
      await devClient.query(`DELETE FROM "UniversityInfrastructure"`);
      await devClient.query(`DELETE FROM "UniversityContent"`);
      await devClient.query(`DELETE FROM "UniversityAdmission"`);
      await devClient.query(`DELETE FROM "UniversityAcademic"`);
      await devClient.query(`DELETE FROM "UniversityContact"`);
      await devClient.query(`DELETE FROM "UniversityLocation"`);
      await devClient.query(`DELETE FROM "University"`);

      // Insert University rows (with proper type casting)
      for (const row of uniRows.rows) {
        const { id, name, createdAt, updatedAt, slug, shortName, establishedYear, type, website, logo, bannerImage, status, verifiedAt, brochureUrl, studentDemographics, socialLinks } = row;
        await devClient.query(
          `INSERT INTO "University" (id, name, "createdAt", "updatedAt", slug, "shortName", "establishedYear", type, website, logo, "bannerImage", status, "verifiedAt", "brochureUrl", "studentDemographics", "socialLinks")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8::"UniversityType", $9, $10, $11, $12::"UniversityStatus", $13, $14, $15::jsonb, $16::jsonb)`,
          [id, name, createdAt, updatedAt, slug, shortName, establishedYear, type, website, logo, bannerImage, status, verifiedAt, brochureUrl, studentDemographics ? JSON.stringify(studentDemographics) : null, socialLinks ? JSON.stringify(socialLinks) : null]
        );
      }
      console.log(`Dev: University → ${uniRows.rows.length} rows`);

      // Helper: insert related table
      // jsonArrays: columns that are JSON-typed but come back as JS arrays from driver
      const insertRelated = async (table: string, rows: any[], cols: string[], typeCasts: Record<string, string> = {}, jsonArrays: string[] = []) => {
        if (rows.length === 0) return;
        for (const row of rows) {
          const colNames = cols.map(c => `"${c}"`);
          const colCasts = cols.map(c => typeCasts[c] ? `::${typeCasts[c]}` : '');
          const ph = cols.map((_, i) => `$${i + 1}${colCasts[i]}`);
          const vals = cols.map(c => {
            const v = row[c];
            if (v === null || v === undefined) return null;
            // JSON columns that come as JS arrays → JSON.stringify so pg doesn't format as PG array
            if (jsonArrays.includes(c)) return JSON.stringify(v);
            // TEXT[] columns → pass JS array, pg formats correctly
            if (Array.isArray(v)) return v;
            // JSONB/JSON objects → JSON.stringify
            if (typeof v === 'object') return JSON.stringify(v);
            return v;
          });
          await devClient.query(
            `INSERT INTO "${table}" (${colNames.join(', ')}) VALUES (${ph.join(', ')})`,
            vals
          );
        }
        console.log(`Dev: ${table} → ${rows.length} rows`);
      };

      await insertRelated('UniversityLocation', locRows.rows, ['id', 'universityId', 'country', 'state', 'city', 'address', 'latitude', 'longitude']);
      await insertRelated('UniversityContact', contactRows.rows, ['id', 'universityId', 'email', 'phone', 'admissionOfficeHours']);
      await insertRelated('UniversityAcademic', acadRows.rows, ['id', 'universityId', 'duration', 'medium', 'specializations', 'intakeMonths', 'totalSeats', 'governmentSeats', 'managementSeats', 'nriSeats', 'curriculumType', 'clinicalTraining', 'programs'], { specializations: 'TEXT[]', intakeMonths: 'TEXT[]' }, ['programs']);
      await insertRelated('UniversityAdmission', admRows.rows, ['id', 'universityId', 'entranceExams', 'minimumMarks', 'ageCriteria', 'eligibility', 'programEligibility', 'requiredDocuments', 'applicationDeadline', 'applicationFee', 'selectionProcess', 'reservationPolicy'], { entranceExams: 'TEXT[]', requiredDocuments: 'TEXT[]' }, ['programEligibility']);
      await insertRelated('UniversityContent', contRows.rows, ['id', 'universityId', 'shortDescription', 'longDescription', 'highlights', 'whyChooseUs', 'gallery', 'virtualTour'], { highlights: 'TEXT[]', gallery: 'TEXT[]' });
      await insertRelated('UniversityInfrastructure', infraRows.rows, ['id', 'universityId', 'hospitalBeds', 'librarySize', 'hostelBoys', 'hostelGirls', 'campusArea', 'facilities', 'cafeteria', 'wifiCampus', 'transportation', 'departments', 'laboratories'], { facilities: 'TEXT[]', departments: 'TEXT[]', laboratories: 'TEXT[]' });
      await insertRelated('UniversitySupport', suppRows.rows, ['id', 'universityId', 'placementRate', 'averagePackage', 'topRecruiters', 'alumniNetwork', 'alumniCount', 'internationalStudentSupport', 'visaAssistance', 'languageSupport', 'counselingServices', 'careerGuidance'], { topRecruiters: 'TEXT[]', languageSupport: 'TEXT[]' });

      console.log('\nDone! All university data copied from prod to dev.');
    } finally {
      devClient.release();
      await dev.end();
    }
  } finally {
    prodClient.release();
    await prod.end();
  }
}

main().catch(console.error);
