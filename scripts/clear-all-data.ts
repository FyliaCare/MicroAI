import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 CLEARING ALL DATA - PREPARING FOR PRODUCTION\n')
  console.log('⚠️  This will delete ALL test data but keep your admin account\n')

  // Delete in correct order (respecting foreign key constraints)
  
  console.log('🗑️  Deleting activity logs...')
  const activityLogs = await prisma.activityLog.deleteMany({})
  console.log(`   ✅ Deleted ${activityLogs.count} activity logs`)

  console.log('🗑️  Deleting notifications...')
  const notifications = await prisma.notification.deleteMany({})
  console.log(`   ✅ Deleted ${notifications.count} notifications`)

  console.log('🗑️  Deleting email queue...')
  const emailQueue = await prisma.emailQueue.deleteMany({})
  console.log(`   ✅ Deleted ${emailQueue.count} queued emails`)

  console.log('🗑️  Deleting project requests...')
  const projectRequests = await prisma.projectRequest.deleteMany({})
  console.log(`   ✅ Deleted ${projectRequests.count} project requests`)

  console.log('🗑️  Deleting projects...')
  const projects = await prisma.project.deleteMany({})
  console.log(`   ✅ Deleted ${projects.count} projects`)

  console.log('🗑️  Deleting sessions...')
  const sessions = await prisma.session.deleteMany({})
  console.log(`   ✅ Deleted ${sessions.count} sessions`)

  console.log('🗑️  Deleting verification tokens...')
  const tokens = await prisma.verificationToken.deleteMany({})
  console.log(`   ✅ Deleted ${tokens.count} verification tokens`)

  console.log('🗑️  Deleting accounts...')
  const accounts = await prisma.account.deleteMany({})
  console.log(`   ✅ Deleted ${accounts.count} accounts`)

  console.log('🗑️  Deleting test users (keeping admin)...')
  const users = await prisma.user.deleteMany({
    where: {
      email: {
        not: 'admin@microaisystems.com'
      }
    }
  })
  console.log(`   ✅ Deleted ${users.count} test users`)

  console.log('🗑️  Deleting chat messages...')
  const chatMessages = await prisma.chatMessage.deleteMany({})
  console.log(`   ✅ Deleted ${chatMessages.count} chat messages`)

  console.log('🗑️  Deleting chat sessions...')
  const chatSessions = await prisma.chatSession.deleteMany({})
  console.log(`   ✅ Deleted ${chatSessions.count} chat sessions`)

  console.log('🗑️  Deleting blog comments...')
  const blogComments = await prisma.blogComment.deleteMany({})
  console.log(`   ✅ Deleted ${blogComments.count} blog comments`)

  console.log('🗑️  Deleting blog posts...')
  const blogPosts = await prisma.blogPost.deleteMany({})
  console.log(`   ✅ Deleted ${blogPosts.count} blog posts`)

  console.log('🗑️  Deleting newsletter subscribers...')
  const subscribers = await prisma.newsletterSubscriber.deleteMany({})
  console.log(`   ✅ Deleted ${subscribers.count} subscribers`)

  console.log('\n✅ DATABASE CLEANED SUCCESSFULLY!\n')
  
  // Show what's left
  const remainingAdmin = await prisma.admin.findMany({
    where: { isActive: true },
    select: { email: true, name: true, role: true }
  })
  
  console.log('👤 Active Admin Account:')
  remainingAdmin.forEach(admin => {
    console.log(`   ${admin.name} (${admin.email}) - ${admin.role}`)
  })

  const quoteTemplates = await prisma.quoteTemplate.count()
  console.log(`\n📋 Quote Templates: ${quoteTemplates} (preserved)`)
  
  console.log('\n🚀 System is now ready for production use!')
  console.log('   - All test data removed')
  console.log('   - Admin account preserved')
  console.log('   - Quote templates intact')
  console.log('   - Ready for real clients\n')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
