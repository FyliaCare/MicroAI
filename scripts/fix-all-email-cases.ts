import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixAllEmailCases() {
  try {
    console.log('\n🔧 Fixing all user email cases...\n')
    
    // Get all users
    const users = await prisma.user.findMany({
      include: { client: true }
    })
    
    console.log(`📋 Found ${users.length} users\n`)
    
    let fixed = 0
    let skipped = 0
    
    for (const user of users) {
      const lowercaseEmail = user.email.toLowerCase()
      
      if (user.email !== lowercaseEmail) {
        console.log(`🔄 Fixing: ${user.email} → ${lowercaseEmail}`)
        
        // Update user email
        await prisma.user.update({
          where: { id: user.id },
          data: { email: lowercaseEmail }
        })
        
        // Update client email if exists
        if (user.client) {
          await prisma.client.update({
            where: { id: user.client.id },
            data: { email: lowercaseEmail }
          })
        }
        
        fixed++
      } else {
        console.log(`✅ OK: ${user.email}`)
        skipped++
      }
    }
    
    console.log(`\n📊 Summary:`)
    console.log(`   Fixed: ${fixed}`)
    console.log(`   Already lowercase: ${skipped}`)
    console.log(`   Total: ${users.length}`)
    console.log('\n✅ All emails are now lowercase!\n')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAllEmailCases()
