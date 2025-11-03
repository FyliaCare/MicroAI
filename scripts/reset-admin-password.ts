import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    console.log('🔄 Resetting admin password...')
    
    const hashedPassword = await bcrypt.hash('1Billion7991', 10)
    
    await prisma.admin.update({
      where: { email: 'admin@microaisystems.com' },
      data: { password: hashedPassword }
    })
    
    console.log('✅ Password reset successfully for admin@microaisystems.com')
    console.log('📧 Email: admin@microaisystems.com')
    console.log('🔑 Password: 1Billion7991')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()
