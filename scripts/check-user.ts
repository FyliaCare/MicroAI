import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    const email = 'Benjyamp@gmail.com'
    
    console.log(`\n🔍 Checking user: ${email}\n`)
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        Client: true,
      }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    console.log('✅ User found:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Active: ${user.isActive}`)
    console.log(`   Verified: ${user.isVerified}`)
    console.log(`   Must Change Password: ${user.mustChangePassword}`)
    console.log(`   Created: ${user.createdAt.toLocaleString()}`)
    
    if (user.Client) {
      console.log(`\n👤 Client Info:`)
      console.log(`   Name: ${user.Client.name}`)
      console.log(`   Company: ${user.Client.company || 'N/A'}`)
      console.log(`   Phone: ${user.Client.phone || 'N/A'}`)
    }
    
    console.log('\n⚠️  PASSWORD INFORMATION:')
    console.log('   Passwords are hashed and cannot be retrieved.')
    console.log('   The user needs to either:')
    console.log('   1. Use their existing password to login')
    console.log('   2. Request a password reset from the login page')
    console.log('\n💡 To reset their password manually, run:')
    console.log('   npx ts-node scripts/reset-user-password.ts Benjyamp@gmail.com\n')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
