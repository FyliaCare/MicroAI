import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📋 Checking Recent Project Requests...\n')
  
  const requests = await prisma.projectRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      requestNumber: true,
      projectName: true,
      clientName: true,
      clientEmail: true,
      source: true,
      status: true,
      createdAt: true
    }
  })

  if (requests.length === 0) {
    console.log('❌ No project requests found')
    return
  }

  console.log(`✅ Found ${requests.length} recent requests:\n`)
  
  requests.forEach((r, i) => {
    console.log(`${i + 1}. ${r.requestNumber} - ${r.clientName}`)
    console.log(`   📝 Project: ${r.projectName}`)
    console.log(`   📧 Email: ${r.clientEmail}`)
    console.log(`   📍 Source: ${r.source}`)
    console.log(`   📊 Status: ${r.status}`)
    console.log(`   📅 Created: ${r.createdAt.toLocaleString()}\n`)
  })

  // Count by source
  const bySource = await prisma.projectRequest.groupBy({
    by: ['source'],
    _count: true
  })

  console.log('\n📊 Breakdown by Source:')
  bySource.forEach(s => {
    console.log(`   ${s.source}: ${s._count} requests`)
  })
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
