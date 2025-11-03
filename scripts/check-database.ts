import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection and tables...\n')

    await prisma.$connect()
    console.log('✅ Database connected successfully\n')

    console.log('📊 Table Record Counts:')
    
    const userCount = await prisma.user.count()
    console.log(`  Users: ${userCount}`)

    const projectRequestCount = await prisma.projectRequest.count()
    console.log(`  Project Requests: ${projectRequestCount}`)

    const notificationCount = await prisma.notification.count()
    console.log(`  Notifications: ${notificationCount}`)

    const blogPostCount = await prisma.blogPost.count()
    console.log(`  Blog Posts: ${blogPostCount}`)

    const serviceCount = await prisma.service.count()
    console.log(`  Services: ${serviceCount}`)

    const quoteCount = await prisma.quote.count()
    console.log(`  Quotes: ${quoteCount}`)

    const clientCount = await prisma.client.count()
    console.log(`  Clients: ${clientCount}`)

    const projectCount = await prisma.project.count()
    console.log(`  Projects: ${projectCount}`)

    console.log('\n✅ All critical tables accessible')

  } catch (error: any) {
    console.error('❌ Database error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
