import { Pool } from '@neondatabase/serverless';

async function main() {
  // Prisma uses pgbouncer URL
  const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_K0dEMy5hwlHL@ep-silent-morning-aogyq67b-pooler.c-2.ap-southeast-1.aws.neon.tech/shiksha?sslmode=require&pgbouncer=true' });
  const c = await pool.connect();
  try {
    const r = await c.query('SELECT id, name, slug, type, status FROM "University"');
    console.log('via pgbouncer: rows=' + r.rows.length);
    if (r.rows.length > 0) console.log(JSON.stringify(r.rows[0]));
  } finally {
    c.release();
    await pool.end();
  }
}

main().catch(console.error);
