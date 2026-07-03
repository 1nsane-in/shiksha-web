/**
 * Diag: dump exact types and values from prod for UniversityAcademic
 */
import { Pool } from '@neondatabase/serverless';

const PROD_URL = 'postgresql://neondb_owner:npg_jtc2nQNFZ3ET@ep-lingering-recipe-aoofy9hu-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function main() {
  const prod = new Pool({ connectionString: PROD_URL });
  const client = await prod.connect();

  try {
    const { rows } = await client.query(`SELECT * FROM "UniversityAcademic" LIMIT 1`);
    const row = rows[0];
    for (const [k, v] of Object.entries(row)) {
      console.log(`${k}: typeof=${typeof v}, isArray=${Array.isArray(v)}, isDate=${v instanceof Date}, value=${JSON.stringify(v)}`);
    }
  } finally {
    client.release();
    await prod.end();
  }
}

main().catch(console.error);
