import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking settings in database...\n')

  try {
    const allSettings = await prisma.setting.findMany({
      orderBy: { category: 'asc' }
    })

    if (allSettings.length === 0) {
      console.log('❌ No settings found in database!')
      console.log('   Run: npx tsx scripts/seed-comprehensive-settings.ts')
      return
    }

    console.log(`✅ Found ${allSettings.length} settings\n`)

    // Group by category
    const byCategory: Record<string, any[]> = {}
    allSettings.forEach(s => {
      if (!byCategory[s.category]) byCategory[s.category] = []
      byCategory[s.category].push(s)
    })

    console.log('📊 Settings by category:\n')
    Object.entries(byCategory).forEach(([category, settings]) => {
      console.log(`   ${category}: ${settings.length} settings`)
      settings.slice(0, 3).forEach(s => {
        console.log(`      - ${s.key}: ${s.value}`)
      })
      if (settings.length > 3) {
        console.log(`      ... and ${settings.length - 3} more`)
      }
      console.log()
    })
  } catch (error) {
    console.error('❌ Database error:', error)
    console.log('\n💡 Your Neon database might be hibernating.')
    console.log('   Visit: https://console.neon.tech/app/projects')
  }
}

main()
  .finally(() => prisma.$disconnect())
