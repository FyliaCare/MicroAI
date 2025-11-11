import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testPassword() {
  try {
    const email = 'Benjyamp@gmail.com'
    const testPassword = 'MicroAI2025!'
    
    console.log(`\n🔐 Testing password for: ${email}\n`)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    console.log('👤 User Details:')
    console.log(`   Name: ${user.name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Active: ${user.isActive}`)
    console.log(`   Verified: ${user.isVerified}`)
    console.log(`   Login Attempts: ${user.loginAttempts || 0}`)
    console.log(`   Locked Until: ${user.lockedUntil || 'Not locked'}`)
    
    console.log(`\n🔑 Testing Password: "${testPassword}"`)
    
    // Test the password
    const isValid = await bcrypt.compare(testPassword, user.password)
    
    if (isValid) {
      console.log('\n✅ PASSWORD IS CORRECT!')
      console.log('   The password matches the database hash')
      console.log(`   User should be able to login with: ${testPassword}\n`)
    } else {
      console.log('\n❌ PASSWORD IS INCORRECT!')
      console.log('   The password does NOT match the database hash')
      console.log('\n💡 Need to reset password? Run:')
      console.log(`   npx ts-node scripts/reset-user-password.ts ${email} NewPassword123!\n`)
      
      // Show the hash for debugging
      console.log('🔍 Debug Info:')
      console.log(`   Password hash length: ${user.password.length}`)
      console.log(`   Hash starts with: ${user.password.substring(0, 10)}...\n`)
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testPassword()
