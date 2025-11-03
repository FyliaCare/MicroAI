import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUnreadNotifications() {
  try {
    console.log('🔔 Checking unread notifications...\n')

    const unread = await prisma.notification.findMany({
      where: { isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    console.log(`📊 Unread Notifications: ${unread.length}\n`)

    if (unread.length === 0) {
      console.log('✅ No unread notifications')
    } else {
      unread.forEach((notif, i) => {
        console.log(`${i + 1}. ${notif.title}`)
        console.log(`   ${notif.message}`)
        console.log(`   Priority: ${notif.priority || 'normal'}`)
        console.log(`   Created: ${notif.createdAt}`)
        console.log(`   ID: ${notif.id}`)
        console.log('')
      })
    }

    // Also check total notifications
    const total = await prisma.notification.count()
    const readCount = await prisma.notification.count({ where: { isRead: true } })
    
    console.log(`\n📈 Summary:`)
    console.log(`   Total: ${total}`)
    console.log(`   Read: ${readCount}`)
    console.log(`   Unread: ${unread.length}`)

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkUnreadNotifications()
