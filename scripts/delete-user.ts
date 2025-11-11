import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteUser() {
  try {
    const email = process.argv[2] || 'Benjyamp@gmail.com'
    
    console.log(`\n🗑️  Deleting user: ${email}\n`)
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        client: true,
      }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    console.log('📋 User to delete:')
    console.log(`   Name: ${user.name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Created: ${user.createdAt.toLocaleString()}`)
    
    // Delete in transaction to handle all related records
    await prisma.$transaction(async (tx) => {
      // Delete related records first
      console.log('\n🔄 Deleting related records...')
      
      // Delete notifications
      const notificationsDeleted = await tx.notification.deleteMany({
        where: { 
          OR: [
            { entityType: 'user', entityId: user.id },
            { entityType: 'client', entityId: user.client?.id }
          ]
        }
      })
      console.log(`   Notifications: ${notificationsDeleted.count}`)
      
      // Delete email queue entries
      const emailsDeleted = await tx.emailQueue.deleteMany({
        where: { userId: user.id }
      })
      console.log(`   Emails: ${emailsDeleted.count}`)
      
      // Delete activity feed entries
      const activityDeleted = await tx.activityFeed.deleteMany({
        where: { 
          OR: [
            { actorType: 'user', actorId: user.id },
            { actorType: 'client', actorId: user.client?.id }
          ]
        }
      })
      console.log(`   Activity entries: ${activityDeleted.count}`)
      
      // Delete client record if exists
      if (user.client) {
        await tx.client.delete({
          where: { id: user.client.id }
        })
        console.log(`   Client record: 1`)
      }
      
      // Finally delete the user
      await tx.user.delete({
        where: { email }
      })
      console.log(`   User: 1`)
    })
    
    console.log('\n✅ User and all related records deleted successfully!')
    console.log('\n💡 Next steps:')
    console.log('   1. Go to Admin Dashboard → Project Requests')
    console.log('   2. Find the project request for this user')
    console.log('   3. Click "Approve" to create new account with fresh credentials')
    console.log('   4. New welcome email will be sent automatically\n')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

deleteUser()
