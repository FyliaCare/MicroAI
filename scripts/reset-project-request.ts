import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetProjectRequest() {
  try {
    const requestNumber = process.argv[2] || 'PR-1762870410356850'
    
    console.log(`\n🔄 Resetting project request: ${requestNumber}\n`)
    
    const request = await prisma.projectRequest.findUnique({
      where: { requestNumber }
    })
    
    if (!request) {
      console.log('❌ Project request not found')
      return
    }
    
    console.log('📋 Current status:')
    console.log(`   Request: ${request.requestNumber}`)
    console.log(`   Client: ${request.clientName}`)
    console.log(`   Email: ${request.clientEmail}`)
    console.log(`   Project: ${request.projectName}`)
    console.log(`   Status: ${request.status}`)
    console.log(`   Converted to Project: ${request.convertedToProject}`)
    
    // Reset to pending
    const updated = await prisma.projectRequest.update({
      where: { requestNumber },
      data: {
        status: 'pending',
        convertedToProject: false,
        projectId: null,
        clientId: null,
        reviewedBy: null,
        reviewedAt: null,
        reviewNotes: null,
      }
    })
    
    console.log('\n✅ Project request reset to pending!')
    console.log(`   Status: ${updated.status}`)
    console.log('\n💡 Next step:')
    console.log('   Go to Admin Dashboard and approve the request')
    console.log('   This will create a new account and send welcome email with credentials\n')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

resetProjectRequest()
