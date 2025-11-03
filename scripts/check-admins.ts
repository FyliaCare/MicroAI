import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ['admin', 'super-admin']
        }
      },
      select: {
        name: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true
      }
    })

    console.log(`\n👥 Total Admin Users: ${admins.length}\n`)
    
    admins.forEach((admin, i) => {
      console.log(`${i + 1}. ${admin.name} (${admin.email})`)
      console.log(`   Role: ${admin.role}`)
      console.log(`   Active: ${admin.isActive} | Verified: ${admin.isVerified}`)
      console.log(`   Created: ${admin.createdAt}`)
      console.log('')
    })

  } catch (error: any) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdmins()
