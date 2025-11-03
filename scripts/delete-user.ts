import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteUser() {
  try {
    const email = 'osibanjanet820@gmail.com'
    
    const deleted = await prisma.user.delete({
      where: { email }
    })

    console.log('✅ User deleted successfully!')
    console.log(`   Name: ${deleted.name}`)
    console.log(`   Email: ${deleted.email}`)
    console.log(`   Role: ${deleted.role}`)

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

deleteUser()
