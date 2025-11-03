import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSubmissions() {
  try {
    console.log('🔍 Checking recent submissions...\n')

    // Check recent project requests
    const requests = await prisma.projectRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        requestNumber: true,
        clientName: true,
        clientEmail: true,
        source: true,
        createdAt: true
      }
    })

    console.log('📋 Recent Project Requests:')
    requests.forEach((req, i) => {
      console.log(`${i + 1}. ${req.requestNumber} - ${req.clientName} (${req.source})`)
      console.log(`   Email: ${req.clientEmail}`)
      console.log(`   Created: ${req.createdAt}`)
      console.log('')
    })

    // Check admins
    const admins = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'admin' },
          { role: 'super-admin' }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    console.log(`\n👥 Admin Users: ${admins.length}`)
    admins.forEach((admin, i) => {
      console.log(`${i + 1}. ${admin.name} (${admin.email}) - ${admin.role}`)
    })

    // Check recent notifications
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true
      }
    })

    console.log(`\n🔔 Recent Notifications: ${notifications.length}`)
    notifications.forEach((notif, i) => {
      console.log(`${i + 1}. ${notif.title}`)
      console.log(`   ${notif.message}`)
      console.log(`   Read: ${notif.isRead} | Created: ${notif.createdAt}`)
      console.log('')
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSubmissions()
