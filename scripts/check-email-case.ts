import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkEmailCase() {
  try {
    console.log('\n🔍 Checking email case sensitivity...\n')
    
    // Try both cases
    const upperCase = await prisma.user.findUnique({
      where: { email: 'Benjyamp@gmail.com' }
    })
    
    const lowerCase = await prisma.user.findUnique({
      where: { email: 'benjyamp@gmail.com' }
    })
    
    console.log('Testing: "Benjyamp@gmail.com" (capital B)')
    if (upperCase) {
      console.log(`✅ Found: ${upperCase.name} (${upperCase.email})`)
    } else {
      console.log('❌ Not found')
    }
    
    console.log('\nTesting: "benjyamp@gmail.com" (lowercase b)')
    if (lowerCase) {
      console.log(`✅ Found: ${lowerCase.name} (${lowerCase.email})`)
    } else {
      console.log('❌ Not found')
    }
    
    // Get all users with similar emails
    console.log('\n📋 All users with "benjy" in email:')
    const allUsers = await prisma.user.findMany({
      where: {
        email: {
          contains: 'benjy',
          mode: 'insensitive'
        }
      }
    })
    
    if (allUsers.length === 0) {
      console.log('❌ No users found')
    } else {
      allUsers.forEach(u => {
        console.log(`   - ${u.name} | ${u.email} | Role: ${u.role}`)
      })
    }
    
    console.log('\n💡 Solution:')
    if (upperCase && !lowerCase) {
      console.log('   Email is stored with capital letters')
      console.log('   Need to update email to lowercase')
      console.log('   Run: npx ts-node scripts/fix-email-case.ts\n')
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkEmailCase()
