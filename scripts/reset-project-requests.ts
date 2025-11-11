import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetProjectRequests() {
  try {
    console.log('🗑️  Starting Project Request Reset...\n')

    // Count current requests
    const count = await prisma.projectRequest.count()
    console.log(`📊 Found ${count} project requests to delete\n`)

    if (count === 0) {
      console.log('✅ No project requests to delete')
      return
    }

    // List all requests before deletion
    const requests = await prisma.projectRequest.findMany({
      select: {
        id: true,
        requestNumber: true,
        clientName: true,
        clientEmail: true,
        projectName: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    console.log('📋 Project Requests to be deleted:\n')
    requests.forEach((req, index) => {
      console.log(`${index + 1}. ${req.requestNumber} - ${req.clientName}`)
      console.log(`   Project: ${req.projectName}`)
      console.log(`   Email: ${req.clientEmail}`)
      console.log(`   Status: ${req.status}\n`)
    })

    // Delete all project requests
    const result = await prisma.projectRequest.deleteMany({})
    
    console.log(`✅ Successfully deleted ${result.count} project requests\n`)

    // Verify deletion
    const remainingCount = await prisma.projectRequest.count()
    console.log(`📊 Remaining project requests: ${remainingCount}`)

    if (remainingCount === 0) {
      console.log('✅ Project Request section successfully reset!')
    } else {
      console.log('⚠️  Warning: Some requests may not have been deleted')
    }

  } catch (error) {
    console.error('❌ Error resetting project requests:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

resetProjectRequests()
