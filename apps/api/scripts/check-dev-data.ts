import { Pool } from '@neondatabase/serverless';

const DEV = 'postgresql://neondb_owner:npg_K0dEMy5hwlHL@ep-silent-morning-aogyq67b.c-2.ap-southeast-1.aws.neon.tech/shiksha?sslmode=require';

async function main() {
  const pool = new Pool({ connectionString: DEV });
  const c = await pool.connect();
  try {
    const r = await c.query('SELECT id, name, slug, type, status FROM "University"');
    console.log('University rows:', r.rows.length, JSON.stringify(r.rows, null, 2));

    for (const t of ['UniversityLocation','UniversityContact','UniversityAcademic','UniversityAdmission','UniversityContent','UniversityInfrastructure','UniversitySupport']) {
      const r2 = await c.query(`SELECT COUNT(*)::int AS cnt FROM "${t}"`);
      console.log(`${t}: ${r2.rows[0].cnt}`);
    }
  } finally {
    c.release();
    await pool.end();
  }
}

main().catch(console.error);
