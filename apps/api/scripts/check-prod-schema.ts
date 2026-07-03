/**
 * READ-ONLY check of prod database.
 * Only SELECT queries — no INSERT/UPDATE/DELETE.
 */
import { Pool } from '@neondatabase/serverless';

const PROD_URL = 'postgresql://neondb_owner:npg_jtc2nQNFZ3ET@ep-lingering-recipe-aoofy9hu-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function main() {
  const pool = new Pool({ connectionString: PROD_URL });
  const client = await pool.connect();

  try {
    // Check what tables exist in prod
    const tables = await client.query(`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename`);
    console.log('=== Tables in prod DB ===');
    console.log(tables.rows.map((t: any) => t.tablename).join('\n'));

    // Check if University table exists
    const hasUni = tables.rows.some((t: any) => t.tablename === 'University');
    if (hasUni) {
      const cols = await client.query(
        `SELECT column_name, data_type, is_nullable
         FROM information_schema.columns
         WHERE table_name = 'University'
         ORDER BY ordinal_position`
      );
      console.log('\n=== University table columns ===');
      console.log(JSON.stringify(cols.rows, null, 2));

      const count = await client.query(`SELECT COUNT(*) as count FROM "University"`);
      console.log(`\n=== University row count: ${count.rows[0].count} ===`);

      const sample = await client.query(`SELECT * FROM "University" LIMIT 1`);
      console.log('\n=== Sample row ===');
      console.log(JSON.stringify(sample.rows, null, 2));
    }

    // Check for related university tables
    const uniTables = tables.rows.filter((t: any) => 
      t.tablename.startsWith('University') || 
      t.tablename.startsWith('university')
    );
    console.log('\n=== University-related tables ===');
    for (const t of uniTables) {
      const cnt = await client.query(`SELECT COUNT(*) as count FROM "${t.tablename}"`);
      console.log(`  ${t.tablename}: ${cnt.rows[0].count} rows`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
