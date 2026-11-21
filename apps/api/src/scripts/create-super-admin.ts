import { config } from 'dotenv';
import * as path from 'path';
import { PASSWORD_SALT_ROUNDS } from '../common/constants';

config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  const { Pool } = await import('@neondatabase/serverless');
  const bcrypt = await import('bcryptjs');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const email = process.argv[2] ?? 'admin@shiksha.com';
    const password = process.argv[3] ?? 'Admin@123456';
    const name = process.argv[4] ?? 'Super Admin';
    const role = process.argv[5] ?? 'SUPER_ADMIN';
    const hash = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS);

    const existing = await pool.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email],
    );
    if (existing.rows.length > 0) {
      console.log('Super admin already exists:', email);
      return;
    }

    await pool.query(
      `INSERT INTO "User" (id, email, "passwordHash", name, role, "emailVerified", "isActive", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, true, NOW(), NOW())`,
      [email, hash, name, role],
    );

    console.log('Super admin created');
    console.log('Email:', email);
    console.log('Password:', password);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
