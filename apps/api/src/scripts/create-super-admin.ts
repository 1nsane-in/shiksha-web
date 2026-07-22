import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  const { Pool } = await import('@neondatabase/serverless');
  const bcrypt = await import('bcryptjs');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const email = 'admin@shiksha.com';
    const password = 'Admin@123456';
    const name = 'Super Admin';
    const hash = bcrypt.hashSync(password, 8);

    const existing = await pool.query('SELECT id FROM "User" WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('Super admin already exists:', email);
      return;
    }

    await pool.query(
      `INSERT INTO "User" (id, email, "passwordHash", name, role, "emailVerified", "isActive", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, 'SUPER_ADMIN', true, true, NOW(), NOW())`,
      [email, hash, name]
    );

    console.log('Super admin created');
    console.log('Email:', email);
    console.log('Password:', password);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
