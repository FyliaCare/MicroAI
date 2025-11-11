import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetUserPassword() {
  try {
    const email = process.argv[2] || 'Benjyamp@gmail.com'
    const newPassword = process.argv[3] || generateSecurePassword()
    
    console.log(`\n🔄 Resetting password for: ${email}\n`)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Update user with new password and require password change
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        mustChangePassword: true,
      }
    })
    
    console.log('✅ Password reset successfully!\n')
    console.log('📧 User Information:')
    console.log(`   Email: ${email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   🔑 New Password: ${newPassword}`)
    console.log('\n⚠️  IMPORTANT:')
    console.log('   1. Share this password securely with the user')
    console.log('   2. User will be required to change it on first login')
    console.log('   3. This password will not be displayed again\n')
    
    // Optionally send email
    console.log('💡 To send password reset email, you can manually send:')
    console.log(`   Login URL: ${process.env.NEXT_PUBLIC_APP_URL}/client/login`)
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${newPassword}\n`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function generateSecurePassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

resetUserPassword()
