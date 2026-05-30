import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@shiksha.com';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123456';
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  try {
    // Check if super admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('✅ Super admin already exists:', email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin
    const superAdmin = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        emailVerified: true,
        isActive: true,
      },
    });

    console.log('✅ Super admin created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
