import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixEmailCase() {
  try {
    console.log('\n🔧 Fixing email case to lowercase...\n')
    
    // Find user with capital letters
    const user = await prisma.user.findUnique({
      where: { email: 'Benjyamp@gmail.com' },
      include: { client: true }
    })
    
    if (!user) {
      console.log('❌ User not found with capital B')
      return
    }
    
    console.log('📋 Current email:', user.email)
    const newEmail = user.email.toLowerCase()
    console.log('🔄 New email:', newEmail)
    
    // Update user email to lowercase
    await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail }
    })
    console.log('✅ User email updated')
    
    // Update client email if exists
    if (user.client) {
      await prisma.client.update({
        where: { id: user.client.id },
        data: { email: newEmail }
      })
      console.log('✅ Client email updated')
    }
    
    console.log('\n✅ Email case fixed successfully!')
    console.log('\n🔐 Login credentials:')
    console.log(`   Email: ${newEmail}`)
    console.log(`   Password: MicroAI2025!`)
    console.log(`   URL: https://microai-kz7f.onrender.com/client/login\n`)
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

fixEmailCase()
