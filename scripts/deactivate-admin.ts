import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Deactivate sales@microaisystems.com
  const updated = await prisma.admin.update({
    where: {
      email: 'sales@microaisystems.com'
    },
    data: {
      isActive: false
    }
  })

  console.log('✅ Admin deactivated:', updated.email)
  console.log('   This admin will no longer receive notifications')
  
  // Show remaining active admins
  const activeAdmins = await prisma.admin.findMany({
    where: { isActive: true }
  })
  
  console.log('\n👥 Active admins:', activeAdmins.length)
  activeAdmins.forEach((admin, i) => {
    console.log(`${i + 1}. ${admin.name} (${admin.email})`)
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
