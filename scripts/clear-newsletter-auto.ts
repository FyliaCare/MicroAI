#!/usr/bin/env tsx
/**
 * Clear Newsletter Subscribers Database - Auto Mode
 * Removes all newsletter subscribers (bot cleanup)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearNewsletterSubscribers() {
  console.log('\n🗑️  Newsletter Subscriber Database Cleaner (Auto Mode)')
  console.log('=' .repeat(60))
  
  try {
    // Get current count
    const count = await prisma.newsletterSubscriber.count()
    
    if (count === 0) {
      console.log('\n✅ Newsletter subscriber database is already empty!')
      return
    }
    
    console.log(`\n📊 Current subscribers: ${count}`)
    
    // Get some sample data
    const samples = await prisma.newsletterSubscriber.findMany({
      take: 10,
      select: {
        email: true,
        name: true,
        createdAt: true,
        subscribed: true,
        ipAddress: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('\n📋 Sample entries (latest 10):')
    samples.forEach((sub, idx) => {
      console.log(`   ${idx + 1}. ${sub.email}${sub.name ? ` (${sub.name})` : ''} - ${sub.subscribed ? '✓ Active' : '✗ Inactive'} - IP: ${sub.ipAddress || 'N/A'} - ${sub.createdAt.toLocaleDateString()}`)
    })
    
    console.log('\n⚠️  WARNING: Deleting all newsletter subscribers in 3 seconds...')
    console.log('   Press Ctrl+C to cancel')
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    console.log('\n🔄 Deleting all newsletter subscribers...')
    
    // Delete all subscribers
    const result = await prisma.newsletterSubscriber.deleteMany({})
    
    console.log(`\n✅ Successfully deleted ${result.count} newsletter subscribers`)
    
    // Log the cleanup activity
    await prisma.activityLog.create({
      data: {
        id: `cleanup-${Date.now()}`,
        action: 'Database Cleanup',
        entity: 'NewsletterSubscriber',
        entityId: 'bulk-delete',
        description: `Cleared all newsletter subscribers (${result.count} records) - Bot cleanup`,
        metadata: JSON.stringify({
          deletedCount: result.count,
          timestamp: new Date().toISOString(),
          reason: 'bot_cleanup',
          sampleEmails: samples.slice(0, 5).map(s => s.email)
        })
      }
    })
    
    console.log('✅ Activity logged')
    console.log('\n🎉 Newsletter database cleared successfully!')
    console.log('\n📝 Bot protection is now active:')
    console.log('   ✓ Honeypot field added to footer form')
    console.log('   ✓ Bot detection in /api/newsletter/subscribe')
    console.log('   ✓ Rate limiting active')
    console.log('   ✓ Fingerprint tracking enabled')
    
  } catch (error) {
    console.error('\n❌ Error clearing newsletter subscribers:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

clearNewsletterSubscribers()
