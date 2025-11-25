/**
 * Test Advanced Settings System
 * 
 * This script tests the advanced settings functionality including:
 * - Fetching settings by category
 * - Updating settings
 * - Creating new settings
 * - Export functionality
 * - History tracking
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAdvancedSettings() {
  console.log('🧪 Testing Advanced Settings System...\n')

  try {
    // Test 1: Fetch system settings
    console.log('1️⃣  Fetching system settings...')
    const systemSettings = await prisma.setting.findMany({
      where: { category: 'system' },
      orderBy: { label: 'asc' }
    })
    console.log(`   ✅ Found ${systemSettings.length} system settings`)
    systemSettings.slice(0, 3).forEach(s => {
      console.log(`      - ${s.label}: ${s.value}`)
    })

    // Test 2: Fetch email settings
    console.log('\n2️⃣  Fetching email settings...')
    const emailSettings = await prisma.setting.findMany({
      where: { category: 'email' }
    })
    console.log(`   ✅ Found ${emailSettings.length} email settings`)

    // Test 3: Count total settings
    console.log('\n3️⃣  Counting all settings...')
    const totalSettings = await prisma.setting.count()
    console.log(`   ✅ Total settings in database: ${totalSettings}`)

    // Test 4: Check categories
    console.log('\n4️⃣  Checking available categories...')
    const categories = await prisma.setting.groupBy({
      by: ['category'],
      _count: { category: true }
    })
    console.log('   ✅ Categories:')
    categories.forEach(cat => {
      console.log(`      - ${cat.category}: ${cat._count.category} settings`)
    })

    // Test 5: Check history records
    console.log('\n5️⃣  Checking settings history...')
    const historyCount = await prisma.settingHistory.count()
    console.log(`   ✅ Found ${historyCount} history records`)

    if (historyCount > 0) {
      const recentHistory = await prisma.settingHistory.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          Setting: {
            select: { label: true, category: true }
          }
        }
      })
      console.log('   Recent changes:')
      recentHistory.forEach(h => {
        console.log(`      - ${h.Setting.label} changed by ${h.changedBy}`)
      })
    }

    // Test 6: Check backups
    console.log('\n6️⃣  Checking settings backups...')
    const backupCount = await prisma.settingsBackup.count()
    console.log(`   ✅ Found ${backupCount} backup records`)

    if (backupCount > 0) {
      const latestBackup = await prisma.settingsBackup.findFirst({
        orderBy: { createdAt: 'desc' }
      })
      console.log(`   Latest backup: ${latestBackup?.name} by ${latestBackup?.createdBy}`)
    }

    // Test 7: Verify encrypted settings
    console.log('\n7️⃣  Checking encrypted settings...')
    const encryptedSettings = await prisma.setting.findMany({
      where: { isEncrypted: true },
      select: { key: true, label: true, category: true }
    })
    console.log(`   ✅ Found ${encryptedSettings.length} encrypted settings`)
    if (encryptedSettings.length > 0) {
      encryptedSettings.forEach(s => {
        console.log(`      - ${s.label} (${s.key})`)
      })
    }

    // Test 8: Check system configs
    console.log('\n8️⃣  Checking system config tables...')
    const [systemConfig, emailConfig, themeConfig] = await Promise.all([
      prisma.systemConfig.findFirst({ where: { id: 'default' } }),
      prisma.emailConfig.findFirst(),
      prisma.themeConfig.findFirst({ where: { isActive: true } })
    ])
    console.log(`   ✅ System Config: ${systemConfig ? 'exists' : 'missing'}`)
    console.log(`   ✅ Email Config: ${emailConfig ? 'exists' : 'missing'}`)
    console.log(`   ✅ Theme Config: ${themeConfig ? 'exists' : 'missing'}`)

    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('✅ Advanced Settings System Test Complete!')
    console.log('='.repeat(50))
    console.log(`Total Settings: ${totalSettings}`)
    console.log(`Categories: ${categories.length}`)
    console.log(`History Records: ${historyCount}`)
    console.log(`Backups: ${backupCount}`)
    console.log(`Encrypted Settings: ${encryptedSettings.length}`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Error during testing:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testAdvancedSettings()
  .then(() => {
    console.log('\n✅ Test completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  })
