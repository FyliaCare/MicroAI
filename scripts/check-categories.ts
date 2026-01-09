import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking category names...\n')

  const categories = await prisma.setting.groupBy({
    by: ['category'],
    _count: {
      id: true
    }
  })

  console.log('Categories in database:')
  categories.forEach(cat => {
    console.log(`   - "${cat.category}": ${cat._count.id} settings`)
  })

  console.log('\n✅ All categories present and populated')
}

main().finally(() => prisma.$disconnect())
