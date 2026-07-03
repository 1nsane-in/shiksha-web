import { Pool } from '@neondatabase/serverless';
const DEV = 'postgresql://neondb_owner:npg_K0dEMy5hwlHL@ep-silent-morning-aogyq67b.c-2.ap-southeast-1.aws.neon.tech/shiksha?sslmode=require';
async function main() {
  const pool = new Pool({ connectionString: DEV });
  const c = await pool.connect();
  const r = await c.query('SELECT id, name, status, type, slug, "shortName", "establishedYear", website FROM "University"');
  console.log(JSON.stringify(r.rows, null, 2));
  c.release();
  await pool.end();
}
main().catch(console.error);
