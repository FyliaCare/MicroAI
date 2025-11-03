import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllAdmins() {
  console.log('🔥 Deleting all admin accounts...');
  try {
    const { count } = await prisma.admin.deleteMany({});
    console.log(`✅ Successfully deleted ${count} admin account(s).`);
  } catch (error) {
    console.error('❌ Error deleting admin accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllAdmins();
